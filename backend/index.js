const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/havencart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 saniye timeout
    socketTimeoutMS: 45000, // 45 saniye socket timeout
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('MongoDB bağlantısı başarısız, ancak server çalışmaya devam ediyor...');
});

// Import Models
const Product = require('./models/Product');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Order = require('./models/Order');
const Contact = require('./models/Contact');

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token yok, erişim reddedildi' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin yetkisi gerekli' });
  }
  next();
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ROUTES

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server çalışıyor!' });
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resim dosyası bulunamadı' });
    }

    // Create the full URL for the uploaded image
    const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Resim başarıyla yüklendi',
      url: imageUrl, // Frontend 'data.url' arıyor
      imageUrl: imageUrl, // Backup için
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Resim yükleme hatası' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const token = generateToken(user._id, 'user');
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, 'admin');
    res.json({
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor' });
    }

    // Create new user
    const user = new User({ name, email, password, phone });
    await user.save();

    // Generate token
    const token = generateToken(user._id, 'user');

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: { $ne: false } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product (Admin only)
app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description || '',
      price: parseFloat(req.body.price),
      category: req.body.category,
      brand: req.body.brand || '',
      stock: parseInt(req.body.stock) || 0,
      specifications: req.body.specifications || '',
      features: req.body.features || [],
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      image: req.body.image || '',
      images: req.body.images || []
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      product: product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Ürün eklenirken hata oluştu: ' + error.message });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    
    const updateData = {
      name: req.body.name,
      description: req.body.description || '',
      price: parseFloat(req.body.price),
      category: req.body.category,
      brand: req.body.brand || '',
      stock: parseInt(req.body.stock) || 0,
      specifications: req.body.specifications || '',
      features: req.body.features || [],
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      updatedAt: new Date()
    };

    // Only update image fields if provided
    if (req.body.image) {
      updateData.image = req.body.image;
    }
    if (req.body.images) {
      updateData.images = req.body.images;
    }

    const product = await Product.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      product: product
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Ürün güncellenirken hata oluştu: ' + error.message });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'Ürün silinirken hata oluştu: ' + error.message });
  }
});

// Cart operations
app.get('/api/user/cart/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Process cart items and populate based on type
    const processedCartItems = [];
    
    for (const cartItem of user.cart) {
      try {
        let itemData = null;
        
        switch (cartItem.type) {
          case 'product':
            itemData = await Product.findById(cartItem.productId);
            break;
          case 'recipe':
            try {
              const Recipe = require('./models/Recipe');
              itemData = await Recipe.findById(cartItem.productId);
            } catch (modelError) {
              console.log('Recipe model not found, skipping recipe item');
              continue;
            }
            break;
          case 'book':
            // For now, create mock book data since Book model doesn't exist
            itemData = {
              _id: cartItem.productId,
              name: 'Sample Book',
              price: 50,
              image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
              type: 'book'
            };
            break;
          default:
            // Default to product
            itemData = await Product.findById(cartItem.productId);
        }
        
        if (itemData) {
          processedCartItems.push({
            _id: cartItem._id,
            product: itemData, // Keep 'product' key for frontend compatibility
            quantity: cartItem.quantity,
            type: cartItem.type,
            addedAt: cartItem.addedAt
          });
        }
      } catch (error) {
        console.error('Error processing cart item:', error);
        // Skip invalid items
      }
    }
    
    // Update user's cart if we filtered out invalid items
    if (processedCartItems.length !== user.cart.length) {
      user.cart = user.cart.filter(item => 
        processedCartItems.some(processed => 
          processed._id && processed._id.toString() === item._id.toString()
        )
      );
      await user.save();
    }
    
    res.json(processedCartItems);
  } catch (error) {
    console.error('Cart GET error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/cart', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, type = 'product' } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find existing cart item
    const existingItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId && item.type === type
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        productId,
        quantity,
        type,
        addedAt: new Date()
      });
    }

    await user.save();
    
    res.json({ 
      message: `${type === 'recipe' ? 'Recipe' : type === 'book' ? 'Book' : 'Product'} added to cart`,
      cartCount: user.cart.length 
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Add cart item update and delete endpoints
app.put('/api/user/cart', async (req, res) => {
  try {
    const { userId, productId, quantity, type = 'product' } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find and update the cart item
    const cartItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId && item.type === type
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();
      res.json({ message: 'Cart updated successfully' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Cart UPDATE error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.delete('/api/user/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { type = 'product' } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove the cart item
    user.cart = user.cart.filter(item => 
      !(item.productId.toString() === productId && item.type === type)
    );
    
    await user.save();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// Reviews
app.get('/api/reviews/:itemType/:itemId', async (req, res) => {
  try {
    // For now, return empty array until Review model is created
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    // For now, just return the review data
    const newReview = {
      _id: Date.now().toString(),
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: false
    };
    
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book Favorites
app.get('/api/user/book-favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json(user.bookFavorites || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/book-favorites', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    
    // Add to user's book favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookFavorites: bookId } },
      { new: true }
    );
    
    res.json({ message: 'Book added to favorites' });
  } catch (error) {
    console.error('Add book favorite error:', error);
    res.status(500).json({ error: 'Failed to add book to favorites' });
  }
});

app.delete('/api/user/book-favorites/:userId/:bookId', async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    
    await User.findByIdAndUpdate(
      userId,
      { $pull: { bookFavorites: bookId } },
      { new: true }
    );
    
    res.json({ message: 'Book removed from favorites' });
  } catch (error) {
    console.error('Remove book favorite error:', error);
    res.status(500).json({ error: 'Failed to remove book from favorites' });
  }
});

// Admin dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Recent statistics
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const newUsersThisMonth = await User.countDocuments({ 
      createdAt: { $gte: last30Days } 
    });
    
    const ordersThisMonth = await Order.countDocuments({ 
      createdAt: { $gte: last30Days } 
    });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      newUsersThisMonth,
      ordersThisMonth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin users endpoint
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin analytics endpoint
app.get('/api/admin/analytics', async (req, res) => {
  try {
    // Sales by month (last 12 months)
    const salesByMonth = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      salesByMonth,
      topProducts,
      orderStatusDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin contacts endpoint
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor!', timestamp: new Date() });
});

// Recipe routes
app.get('/api/recipes', async (req, res) => {
  try {
    // Try to get recipes from MongoDB first
    // If no Recipe model, create one or use sample data
    const Recipe = require('./models/Recipe');
    const recipes = await Recipe.find({ isActive: { $ne: false } });
    
    // If no recipes in DB, populate with sample data once
    if (recipes.length === 0) {
      console.log('No recipes found in DB, populating with sample data...');
      const sampleRecipes = generateSampleRecipes();
      await Recipe.insertMany(sampleRecipes);
      const newRecipes = await Recipe.find({ isActive: { $ne: false } });
      res.json(newRecipes);
    } else {
      res.json(recipes);
    }
  } catch (error) {
    console.error('Recipe model not found, using temporary data:', error.message);
    // Fallback to temporary data if no model
    const recipes = generateSampleRecipes();
    res.json(recipes);
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const Recipe = require('./models/Recipe');
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Tarif bulunamadı' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Recipe model error:', error.message);
    // Fallback to sample data
    const recipes = generateSampleRecipes();
    const recipe = recipes.find(r => r._id === req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Tarif bulunamadı' });
    }
    res.json(recipe);
  }
});

// Recipe favorites
app.get('/api/user/recipe-favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('recipeFavorites');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // If Recipe model exists, populate properly
    try {
      const Recipe = require('./models/Recipe');
      const favorites = await Recipe.find({ _id: { $in: user.recipeFavorites || [] } });
      res.json(favorites);
    } catch (modelError) {
      // Fallback to IDs if no model
      res.json(user.recipeFavorites || []);
    }
  } catch (error) {
    console.error('Get recipe favorites error:', error);
    res.status(500).json({ error: 'Failed to get recipe favorites' });
  }
});

app.post('/api/user/recipe-favorites', async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    
    // Add to user's recipe favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { recipeFavorites: recipeId } },
      { new: true }
    );
    
    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    console.error('Add recipe favorite error:', error);
    res.status(500).json({ error: 'Failed to add recipe to favorites' });
  }
});

app.delete('/api/user/recipe-favorites/:userId/:recipeId', async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    
    await User.findByIdAndUpdate(
      userId,
      { $pull: { recipeFavorites: recipeId } },
      { new: true }
    );
    
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Remove recipe favorite error:', error);
    res.status(500).json({ error: 'Failed to remove recipe from favorites' });
  }
});

// User product favorites routes
app.get('/api/user/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // If Product model exists, populate properly
    try {
      const favorites = await Product.find({ _id: { $in: user.favorites || [] } });
      res.json(favorites);
    } catch (modelError) {
      // Fallback to IDs if no model
      res.json(user.favorites || []);
    }
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

app.post('/api/user/favorites', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    // Add to user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: productId } },
      { new: true }
    );
    
    res.json({ message: 'Product added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

app.delete('/api/user/favorites/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: productId } },
      { new: true }
    );
    
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Sample recipe data generator (400 recipes)
const generateSampleRecipes = () => {
  const turkishRecipes = [
    // Çorbalar
    { name: 'Mercimek Çorbası', category: 'Çorbalar', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Geleneksel Türk mutfağının vazgeçilmez çorbası. Besleyici ve lezzetli.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop' },
    { name: 'Yayla Çorbası', category: 'Çorbalar', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Yoğurt ve pirinçle hazırlanan nefis Anadolu çorbası.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
    { name: 'İşkembe Çorbası', category: 'Çorbalar', difficulty: 'Zor', cookTime: '1+ saat', servings: 4, description: 'Türk mutfağının geleneksel kahvaltı çorbası.', image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=800&h=600&fit=crop' },
    { name: 'Tarhana Çorbası', category: 'Çorbalar', difficulty: 'Kolay', cookTime: '15 dk', servings: 4, description: 'Fermente tarhana ile hazırlanan besleyici çorba.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
    { name: 'Ezogelin Çorbası', category: 'Çorbalar', difficulty: 'Orta', cookTime: '30 dk', servings: 6, description: 'Kırmızı mercimek ve bulgurla hazırlanan Gaziantep usulü çorba.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop' },
    
    // Et Yemekleri
    { name: 'Döner Kebap', category: 'Et Yemekleri', difficulty: 'Zor', cookTime: '1+ saat', servings: 8, description: 'Türk mutfağının dünyaca ünlü et yemeği.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop' },
    { name: 'Adana Kebap', category: 'Et Yemekleri', difficulty: 'Orta', cookTime: '45 dk', servings: 4, description: 'Acılı kıyma ile hazırlanan geleneksel Adana kebabı.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop' },
    { name: 'İskender Kebap', category: 'Et Yemekleri', difficulty: 'Orta', cookTime: '30 dk', servings: 4, description: 'Yoğurt ve tereyağı ile servis edilen döner.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop' },
    { name: 'Şiş Kebap', category: 'Et Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Marine edilmiş kuzu etinden hazırlanan şiş kebap.', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&h=600&fit=crop' },
    { name: 'Köfte', category: 'Et Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 6, description: 'Türk mutfağının klasik köfte tarifi.', image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop' },
    
    // Tavuk Yemekleri
    { name: 'Tavuk Şiş', category: 'Tavuk Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Marine edilmiş tavuk göğsü ile hazırlanan şiş.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop' },
    { name: 'Tavuk Döner', category: 'Tavuk Yemekleri', difficulty: 'Orta', cookTime: '1 saat', servings: 6, description: 'Tavuk etinden hazırlanan döner kebap.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop' },
    { name: 'Tavuk Sote', category: 'Tavuk Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Sebzeli tavuk sote, hafif ve lezzetli.', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&h=600&fit=crop' },
    { name: 'Tavuk Çorbası', category: 'Çorbalar', difficulty: 'Kolay', cookTime: '45 dk', servings: 6, description: 'Besleyici tavuk çorbası.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' },
    { name: 'Tavuk Pilav', category: 'Pilavlar', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Tavuklu pilav, doyurucu ana yemek.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop' },
    
    // Sebze Yemekleri
    { name: 'İmam Bayıldı', category: 'Sebze Yemekleri', difficulty: 'Orta', cookTime: '1 saat', servings: 4, description: 'Zeytinyağlı patlıcan yemeği.', image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&h=600&fit=crop' },
    { name: 'Dolma', category: 'Sebze Yemekleri', difficulty: 'Zor', cookTime: '1+ saat', servings: 8, description: 'Pirinçli yaprak dolması.', image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop' },
    { name: 'Türlü', category: 'Sebze Yemekleri', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Karışık sebze yemeği.', image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91d?w=800&h=600&fit=crop' },
    { name: 'Pırasa Yemeği', category: 'Sebze Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Zeytinyağlı pırasa yemeği.', image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&h=600&fit=crop' },
    { name: 'Fasulye', category: 'Sebze Yemekleri', difficulty: 'Orta', cookTime: '1 saat', servings: 6, description: 'Etli kuru fasulye.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop' },
    
    // Pilavlar
    { name: 'Pilav', category: 'Pilavlar', difficulty: 'Kolay', cookTime: '30 dk', servings: 6, description: 'Geleneksel Türk pilavı.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop' },
    { name: 'Bulgur Pilavı', category: 'Pilavlar', difficulty: 'Kolay', cookTime: '25 dk', servings: 4, description: 'Besleyici bulgur pilavı.', image: 'https://images.unsplash.com/photo-1596040033229-a0b3b6087345?w=800&h=600&fit=crop' },
    { name: 'İç Pilav', category: 'Pilavlar', difficulty: 'Orta', cookTime: '45 dk', servings: 8, description: 'Kuş üzümü ve bademli pilav.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop' },
    { name: 'Şehriyeli Pilav', category: 'Pilavlar', difficulty: 'Kolay', cookTime: '25 dk', servings: 4, description: 'Şehriye ile hazırlanan pilav.', image: 'https://images.unsplash.com/photo-1596040033229-a0b3b6087345?w=800&h=600&fit=crop' },
    { name: 'Nohutlu Pilav', category: 'Pilavlar', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Nohut ve baharatlarla zenginleştirilmiş pilav.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop' },
    
    // Tatlılar
    { name: 'Baklava', category: 'Tatlılar', difficulty: 'Zor', cookTime: '1+ saat', servings: 12, description: 'Türk mutfağının dünyaca ünlü tatlısı.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop' },
    { name: 'Künefe', category: 'Tatlılar', difficulty: 'Orta', cookTime: '30 dk', servings: 6, description: 'Tel kadayıf ve peynirle hazırlanan sıcak tatlı.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop' },
    { name: 'Sütlaç', category: 'Tatlılar', difficulty: 'Kolay', cookTime: '45 dk', servings: 8, description: 'Geleneksel süt tatlısı.', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop' },
    { name: 'Kazandibi', category: 'Tatlılar', difficulty: 'Orta', cookTime: '1 saat', servings: 6, description: 'Karamelize süt tatlısı.', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop' },
    { name: 'Lokma', category: 'Tatlılar', difficulty: 'Orta', cookTime: '30 dk', servings: 20, description: 'Şerbetli hamur tatlısı.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop' },
  ];

  // Generate more recipes to reach 400
  const recipes = [];
  let id = 1;
  const difficultyLevels = ['Kolay', 'Orta', 'Zor'];
  const cookingTimes = ['15 dk', '30 dk', '45 dk', '1 saat', '1+ saat'];
  
  // Food images for Turkish dishes
  const foodImages = [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', // kebap
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop', // meat dish
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop', // iskender
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop', // soup
    'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop', // rice
    'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&h=600&fit=crop', // vegetables
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop', // baklava
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop', // dessert
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop', // dolma
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop', // kunefe
  ];

  // Add main recipes
  turkishRecipes.forEach(recipe => {
    recipes.push({
      _id: id.toString(),
      ...recipe,
      prepTime: '15 dk',
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3-5 rating
      reviewCount: Math.floor(Math.random() * 200) + 10,
      ingredients: [
        { name: 'Ana malzeme', amount: '500', unit: 'gram' },
        { name: 'Soğan', amount: '1', unit: 'adet' },
        { name: 'Tuz', amount: '1', unit: 'tatlı kaşığı' },
        { name: 'Karabiber', amount: '1', unit: 'çimdik' },
        { name: 'Zeytinyağı', amount: '3', unit: 'yemek kaşığı' }
      ],
      instructions: [
        'Malzemeleri hazırlayın ve temizleyin.',
        'Soğanları doğrayıp yağda kavurun.',
        'Ana malzemeyi ekleyip karıştırın.',
        'Baharatları ekleyip pişirin.',
        'Sıcak servis yapın.'
      ],
      tips: [
        'Malzemelerin taze olmasına dikkat edin.',
        'Orta ateşte pişirmeniz önerilir.',
        'Servis sırasında limon ekleyebilirsiniz.'
      ]
    });
    id++;
  });

  // Generate variations and additional recipes to reach 400
  const variations = ['Ev Usulü', 'Özel', 'Geleneksel', 'Modern', 'Pratik', 'Lezzetli', 'Nefis', 'Enfes'];
  const additionalCategories = ['Makarnalar', 'Salatalar', 'İçecekler', 'Aperatifler', 'Kahvaltı', 'Hamur İşleri'];
  
  while (recipes.length < 400) {
    const baseRecipe = turkishRecipes[Math.floor(Math.random() * turkishRecipes.length)];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const randomImage = foodImages[Math.floor(Math.random() * foodImages.length)];
    
    recipes.push({
      _id: id.toString(),
      name: `${variation} ${baseRecipe.name}`,
      category: Math.random() > 0.3 ? baseRecipe.category : additionalCategories[Math.floor(Math.random() * additionalCategories.length)],
      difficulty: difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)],
      cookTime: cookingTimes[Math.floor(Math.random() * cookingTimes.length)],
      prepTime: ['10 dk', '15 dk', '20 dk'][Math.floor(Math.random() * 3)],
      servings: Math.floor(Math.random() * 8) + 2,
      description: `${baseRecipe.description} ${variation} tarif.`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 200) + 5,
      image: randomImage,
      ingredients: [
        { name: 'Ana malzeme', amount: Math.floor(Math.random() * 500 + 200).toString(), unit: 'gram' },
        { name: 'Soğan', amount: Math.floor(Math.random() * 3 + 1).toString(), unit: 'adet' },
        { name: 'Baharat karışımı', amount: '1', unit: 'çay kaşığı' }
      ],
      instructions: [
        'Malzemeleri hazırlayın.',
        'Karıştırıp pişirin.',
        'Lezzetle servis edin.'
      ],
      tips: [
        'Taze malzeme kullanın.',
        'Orta ateşte pişirin.'
      ]
    });
    id++;
  }

  return recipes;
};

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor!`);
  console.log('MongoDB veritabanı bağlantısı aktif!');
}); 