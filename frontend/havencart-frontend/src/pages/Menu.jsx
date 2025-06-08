import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
  Badge,
  Pagination,
  Avatar,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  Restaurant as RestaurantIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  LocalFireDepartment as DifficultyIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Yemek kategorileri
const categories = [
  'Tümü',
  'Çorbalar',
  'Ana Yemekler',
  'Et Yemekleri',
  'Tavuk Yemekleri',
  'Balık & Deniz Ürünleri',
  'Sebze Yemekleri',
  'Pilavlar',
  'Makarnalar',
  'Salatalar',
  'Tatlılar',
  'İçecekler',
  'Aperatifler',
  'Kahvaltı',
  'Hamur İşleri'
];

// Zorluk seviyeleri
const difficultyLevels = ['Kolay', 'Orta', 'Zor'];

// Pişirme süreleri
const cookingTimes = ['15 dk', '30 dk', '45 dk', '1 saat', '1+ saat'];

const Menu = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userFavorites, setUserFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  // Better user ID handling
  const getUserId = () => {
    if (!user) return null;
    return user.id || user._id || null;
  };

  useEffect(() => {
    loadRecipes();
    if (isLoggedIn && getUserId()) {
      loadUserFavorites();
    }
  }, [isLoggedIn]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedTime]);

  const loadRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      // Fallback to sample data if API fails
      setRecipes(generateSampleRecipes());
    }
  };

  const loadUserFavorites = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      
      const response = await fetch(`http://localhost:5001/api/user/recipe-favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        setUserFavorites(favorites.map(fav => fav._id));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleToggleFavorite = async (recipeId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Favorilere eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.', severity: 'error' });
      return;
    }

    const isFavorite = userFavorites.includes(recipeId);

    try {
      if (isFavorite) {
        const response = await fetch(`http://localhost:5001/api/user/recipe-favorites/${userId}/${recipeId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setUserFavorites(prev => prev.filter(id => id !== recipeId));
          setSnackbar({ open: true, message: 'Tarif favorilerden çıkarıldı', severity: 'info' });
        } else {
          throw new Error('Failed to remove from favorites');
        }
      } else {
        const response = await fetch('http://localhost:5001/api/user/recipe-favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId, recipeId })
        });
        if (response.ok) {
          setUserFavorites(prev => [...prev, recipeId]);
          setSnackbar({ open: true, message: 'Tarif favorilere eklendi', severity: 'success' });
        } else {
          throw new Error('Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const handleAddToCart = async (recipeId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Sepete eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId, 
          productId: recipeId, 
          quantity: 1,
          type: 'recipe' // Mark as recipe item
        })
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Tarif sepete eklendi (malzemeler listesi)', severity: 'success' });
        // Refresh cart count in navbar
        if (window.refreshCartCount) {
          window.refreshCartCount();
        }
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Tümü' || recipe.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    const matchesTime = !selectedTime || recipe.cookTime === selectedTime;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Yemek Tarifleri
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Enfes tariflerle mutfağınızı zenginleştirin • {recipes.length} tarif
        </Typography>
        
        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tarif ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Kategori"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Zorluk</InputLabel>
                <Select
                  value={selectedDifficulty}
                  label="Zorluk"
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Süre</InputLabel>
                <Select
                  value={selectedTime}
                  label="Süre"
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {cookingTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Recipe Grid */}
      <Grid container spacing={3}>
        {currentRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 6 
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={recipe.image || `https://source.unsplash.com/400x300/?${encodeURIComponent(recipe.name)},food`}
                  alt={recipe.name}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                />
                
                {/* Favorite Button */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                  }}
                  onClick={() => handleToggleFavorite(recipe._id)}
                >
                  {userFavorites.includes(recipe._id) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>

                {/* Difficulty Badge */}
                <Chip
                  label={recipe.difficulty}
                  size="small"
                  color={
                    recipe.difficulty === 'Kolay' ? 'success' : 
                    recipe.difficulty === 'Orta' ? 'warning' : 'error'
                  }
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    minHeight: '3rem',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' }
                  }}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                >
                  {recipe.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {recipe.description}
                </Typography>

                {/* Recipe Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="caption">{recipe.cookTime}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="caption">{recipe.servings} kişi</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating 
                      value={recipe.rating || 4.5} 
                      readOnly 
                      size="small" 
                      precision={0.1}
                    />
                    <Typography variant="caption">({recipe.reviewCount || 0})</Typography>
                  </Box>
                </Box>

                <Chip 
                  label={recipe.category} 
                  size="small" 
                  variant="outlined" 
                  sx={{ alignSelf: 'flex-start', mb: 2 }}
                />

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(recipe._id)}
                    sx={{ flex: 1 }}
                  >
                    Sepet
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6b4190 90%)',
                      }
                    }}
                  >
                    Gör
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {currentRecipes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Tarif bulunamadı
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Arama kriterlerinizi değiştirip tekrar deneyin.
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Sample recipe data generator (400 recipes)
const generateSampleRecipes = () => {
  const turkishRecipes = [
    // Çorbalar
    { name: 'Mercimek Çorbası', category: 'Çorbalar', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Geleneksel Türk mutfağının vazgeçilmez çorbası. Besleyici ve lezzetli.' },
    { name: 'Yayla Çorbası', category: 'Çorbalar', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Yoğurt ve pirinçle hazırlanan nefis Anadolu çorbası.' },
    { name: 'İşkembe Çorbası', category: 'Çorbalar', difficulty: 'Zor', cookTime: '1+ saat', servings: 4, description: 'Türk mutfağının geleneksel kahvaltı çorbası.' },
    { name: 'Tarhana Çorbası', category: 'Çorbalar', difficulty: 'Kolay', cookTime: '15 dk', servings: 4, description: 'Fermente tarhana ile hazırlanan besleyici çorba.' },
    { name: 'Ezogelin Çorbası', category: 'Çorbalar', difficulty: 'Orta', cookTime: '30 dk', servings: 6, description: 'Kırmızı mercimek ve bulgurla hazırlanan Gaziantep usulü çorba.' },
    
    // Ana Yemekler
    { name: 'Döner Kebap', category: 'Et Yemekleri', difficulty: 'Zor', cookTime: '1+ saat', servings: 8, description: 'Türk mutfağının dünyaca ünlü et yemeği.' },
    { name: 'Adana Kebap', category: 'Et Yemekleri', difficulty: 'Orta', cookTime: '45 dk', servings: 4, description: 'Acılı kıyma ile hazırlanan geleneksel Adana kebabı.' },
    { name: 'İskender Kebap', category: 'Et Yemekleri', difficulty: 'Orta', cookTime: '30 dk', servings: 4, description: 'Yoğurt ve tereyağı ile servis edilen döner.' },
    { name: 'Şiş Kebap', category: 'Et Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Marine edilmiş kuzu etinden hazırlanan şiş kebap.' },
    { name: 'Köfte', category: 'Et Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 6, description: 'Türk mutfağının klasik köfte tarifi.' },
    
    // Tavuk Yemekleri
    { name: 'Tavuk Şiş', category: 'Tavuk Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Marine edilmiş tavuk göğsü ile hazırlanan şiş.' },
    { name: 'Tavuk Döner', category: 'Tavuk Yemekleri', difficulty: 'Orta', cookTime: '1 saat', servings: 6, description: 'Tavuk etinden hazırlanan döner kebap.' },
    { name: 'Tavuk Sote', category: 'Tavuk Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Sebzeli tavuk sote, hafif ve lezzetli.' },
    { name: 'Tavuk Çorbası', category: 'Çorbalar', difficulty: 'Kolay', cookTime: '45 dk', servings: 6, description: 'Besleyici tavuk çorbası.' },
    { name: 'Tavuk Pilav', category: 'Pilavlar', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Tavuklu pilav, doyurucu ana yemek.' },
    
    // Sebze Yemekleri
    { name: 'İmam Bayıldı', category: 'Sebze Yemekleri', difficulty: 'Orta', cookTime: '1 saat', servings: 4, description: 'Zeytinyağlı patlıcan yemeği.' },
    { name: 'Dolma', category: 'Sebze Yemekleri', difficulty: 'Zor', cookTime: '1+ saat', servings: 8, description: 'Pirinçli yaprak dolması.' },
    { name: 'Türlü', category: 'Sebze Yemekleri', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Karışık sebze yemeği.' },
    { name: 'Pırasa Yemeği', category: 'Sebze Yemekleri', difficulty: 'Kolay', cookTime: '30 dk', servings: 4, description: 'Zeytinyağlı pırasa yemeği.' },
    { name: 'Fasulye', category: 'Sebze Yemekleri', difficulty: 'Orta', cookTime: '1 saat', servings: 6, description: 'Etli kuru fasulye.' },
    
    // Pilavlar
    { name: 'Pilav', category: 'Pilavlar', difficulty: 'Kolay', cookTime: '30 dk', servings: 6, description: 'Geleneksel Türk pilavı.' },
    { name: 'Bulgur Pilavı', category: 'Pilavlar', difficulty: 'Kolay', cookTime: '25 dk', servings: 4, description: 'Besleyici bulgur pilavı.' },
    { name: 'İç Pilav', category: 'Pilavlar', difficulty: 'Orta', cookTime: '45 dk', servings: 8, description: 'Kuş üzümü ve bademli pilav.' },
    { name: 'Şehriyeli Pilav', category: 'Pilavlar', difficulty: 'Kolay', cookTime: '25 dk', servings: 4, description: 'Şehriye ile hazırlanan pilav.' },
    { name: 'Nohutlu Pilav', category: 'Pilavlar', difficulty: 'Orta', cookTime: '45 dk', servings: 6, description: 'Nohut ve baharatlarla zenginleştirilmiş pilav.' },
    
    // Tatlılar
    { name: 'Baklava', category: 'Tatlılar', difficulty: 'Zor', cookTime: '1+ saat', servings: 12, description: 'Türk mutfağının dünyaca ünlü tatlısı.' },
    { name: 'Künefe', category: 'Tatlılar', difficulty: 'Orta', cookTime: '30 dk', servings: 6, description: 'Tel kadayıf ve peynirle hazırlanan sıcak tatlı.' },
    { name: 'Sütlaç', category: 'Tatlılar', difficulty: 'Kolay', cookTime: '45 dk', servings: 8, description: 'Geleneksel süt tatlısı.' },
    { name: 'Kazandibi', category: 'Tatlılar', difficulty: 'Orta', cookTime: '1 saat', servings: 6, description: 'Karamelize süt tatlısı.' },
    { name: 'Lokma', category: 'Tatlılar', difficulty: 'Orta', cookTime: '30 dk', servings: 20, description: 'Şerbetli hamur tatlısı.' },
  ];

  // Generate more recipes to reach 400
  const recipes = [];
  let id = 1;

  // Add main recipes
  turkishRecipes.forEach(recipe => {
    recipes.push({
      _id: id.toString(),
      ...recipe,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3-5 rating
      reviewCount: Math.floor(Math.random() * 200) + 10,
      image: `https://source.unsplash.com/400x300/?${encodeURIComponent(recipe.name)},turkish,food`,
      ingredients: ['Malzeme 1', 'Malzeme 2', 'Malzeme 3'], // Sample ingredients
      instructions: ['Adım 1', 'Adım 2', 'Adım 3'], // Sample instructions
    });
    id++;
  });

  // Generate variations and additional recipes to reach 400
  const variations = ['Ev Usulü', 'Özel', 'Geleneksel', 'Modern', 'Pratik', 'Lezzetli', 'Nefis', 'Enfes'];
  const additionalCategories = ['Makarnalar', 'Salatalar', 'İçecekler', 'Aperatifler', 'Kahvaltı', 'Hamur İşleri'];
  
  while (recipes.length < 400) {
    const baseRecipe = turkishRecipes[Math.floor(Math.random() * turkishRecipes.length)];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    
    recipes.push({
      _id: id.toString(),
      name: `${variation} ${baseRecipe.name}`,
      category: Math.random() > 0.3 ? baseRecipe.category : additionalCategories[Math.floor(Math.random() * additionalCategories.length)],
      difficulty: difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)],
      cookTime: cookingTimes[Math.floor(Math.random() * cookingTimes.length)],
      servings: Math.floor(Math.random() * 8) + 2,
      description: `${baseRecipe.description} ${variation} tarif.`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 200) + 5,
      image: `https://source.unsplash.com/400x300/?${encodeURIComponent(baseRecipe.name)},food,recipe`,
      ingredients: ['Malzeme 1', 'Malzeme 2', 'Malzeme 3'],
      instructions: ['Adım 1', 'Adım 2', 'Adım 3'],
    });
    id++;
  }

  return recipes;
};

export default Menu; 