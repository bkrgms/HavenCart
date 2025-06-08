require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Order = require('./models/Order');
const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'havencart' },
});
const upload = multer({ storage });

// JWT token generation
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'havencart-secret', {
    expiresIn: '7d',
  });
};

// AUTH ENDPOINTS

// User Registration
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
      message: 'Kayıt başarılı!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    // Generate token
    const token = generateToken(user._id, 'user');

    res.json({
      message: 'Giriş başarılı!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.json({
      message: 'Admin girişi başarılı!',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ENDPOINTS

// Get Dashboard Statistics
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

// Get all users (Admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (Admin only)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Analytics Data
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

// CONTACT ENDPOINTS

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });
    
    await contact.save();
    
    res.status(201).json({
      message: 'Mesajınız başarıyla gönderildi!',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contact messages (Admin only)
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact message status (Admin only)
app.put('/api/admin/contacts/:id', async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, priority },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'İletişim mesajı bulunamadı' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact modelini güncelleyelim
app.put('/api/admin/contacts/:id/reply', async (req, res) => {
  try {
    const { message, adminName } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'İletişim mesajı bulunamadı' });
    }
    
    // Add reply to contact
    contact.replies.push({
      message,
      from: 'admin',
      adminName,
      createdAt: new Date()
    });
    
    contact.status = 'replied';
    await contact.save();
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USER ENDPOINTS

// Get user's contacts with replies
app.get('/api/user/contacts', async (req, res) => {
  try {
    // In a real app, you'd get user ID from JWT token
    const userEmail = req.query.email; // Temporary solution
    
    const contacts = await Contact.find({ email: userEmail }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to favorites
app.post('/api/user/favorites', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Check if already in favorites
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ error: 'Ürün zaten favorilerde' });
    }
    
    user.favorites.push(productId);
    await user.save();
    
    res.json({ message: 'Ürün favorilere eklendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from favorites
app.delete('/api/user/favorites/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Ürün favorilerden çıkarıldı' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user favorites
app.get('/api/user/favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
app.post('/api/user/cart', async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Check if product already in cart
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    
    await user.save();
    res.json({ message: 'Ürün sepete eklendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user cart
app.get('/api/user/cart/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity (new endpoint for frontend compatibility)
app.put('/api/user/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      if (quantity <= 0) {
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
      } else {
        cartItem.quantity = quantity;
      }
      await user.save();
    }
    
    res.json({ message: 'Sepet güncellendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity (existing endpoint)
app.put('/api/user/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      if (quantity <= 0) {
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
      } else {
        cartItem.quantity = quantity;
      }
      await user.save();
    }
    
    res.json({ message: 'Sepet güncellendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
app.delete('/api/user/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Ürün sepetten çıkarıldı' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRODUCT ENDPOINTS (existing code)

// Tüm ürünleri getir
app.get('/api/products', async (req, res) => {
  try {
    const items = await Product.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yeni ürün ekle
app.post('/api/products', async (req, res) => {
  try {
    const item = new Product(req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ürün sil
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ürün güncelle
app.put('/api/products/:id', async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Lütfen bir resim dosyası seçin' });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test admin oluştur (sadece development için)
app.post('/api/create-test-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@havencart.com' });
    if (existingAdmin) {
      return res.json({ message: 'Test admin zaten mevcut' });
    }

    // Create test admin
    const admin = new Admin({
      name: 'Test Admin',
      email: 'admin@havencart.com',
      password: '123456',
      role: 'admin',
      permissions: ['products', 'users', 'orders', 'analytics', 'settings']
    });

    await admin.save();
    res.json({ message: 'Test admin oluşturuldu!', email: 'admin@havencart.com', password: '123456' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product images
app.put('/api/admin/products/:id/images', async (req, res) => {
  try {
    const { images } = req.body; // Array of {url, order, isPrimary}
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    
    product.images = images;
    
    // Set primary image as main image
    const primaryImage = images.find(img => img.isPrimary);
    if (primaryImage) {
      product.image = primaryImage.url;
    }
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk import products
app.post('/api/admin/products/bulk-import', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }

    console.log(`Importing ${products.length} products...`);
    
    // Insert products in batches to avoid memory issues
    const batchSize = 50;
    let importedCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const insertedProducts = await Product.insertMany(batch);
      importedCount += insertedProducts.length;
      console.log(`Imported batch ${Math.floor(i/batchSize) + 1}: ${insertedProducts.length} products`);
    }

    res.json({
      message: `Successfully imported ${importedCount} products`,
      count: importedCount
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product statistics
app.get('/api/admin/product-stats', async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ isActive: { $ne: false } });
    const lowStock = await Product.countDocuments({ stock: { $lt: 10, $gt: 0 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      total,
      active,
      lowStock,
      outOfStock,
      categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate and import products endpoint
app.post('/api/admin/generate-products', async (req, res) => {
  try {
    const { count = 100 } = req.body;
    const { generateProducts } = require('./generateProducts');
    
    // Generate products
    const products = generateProducts(count);
    
    // Insert products in batches
    const batchSize = 50;
    let importedCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const insertedProducts = await Product.insertMany(batch);
      importedCount += insertedProducts.length;
    }

    res.json({
      message: `Successfully generated and imported ${importedCount} products`,
      count: importedCount
    });
  } catch (error) {
    console.error('Generate products error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor!`)); 