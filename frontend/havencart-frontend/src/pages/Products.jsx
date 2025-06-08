import React, { useState, useContext, useEffect } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../contexts/ProductsContext';

// Kategoriler
const categories = [
  'Tümü',
  'Ev Dekorasyon',
  'Mutfak',
  'Aydınlatma',
  'Banyo',
  'Tekstil',
  'Elektronik',
  'Bahçe',
  'Mobilya',
  'Yatak Odası',
  'Oturma Odası'
];

const Products = () => {
  const { products, loading } = useContext(ProductsContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [userFavorites, setUserFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  // Better user ID handling
  const getUserId = () => {
    if (!user) return null;
    return user.id || user._id || null;
  };

  useEffect(() => {
    if (isLoggedIn && getUserId()) {
      loadUserFavorites();
    }
  }, [isLoggedIn]);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const loadUserFavorites = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found. User object:', user);
        return;
      }
      
      console.log('Loading favorites for user ID:', userId);
      const response = await fetch(`http://localhost:5001/api/user/favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        setUserFavorites(favorites.map(fav => fav._id));
      } else {
        console.error('Failed to load favorites. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Favorilere eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found. User object:', user);
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.', severity: 'error' });
      return;
    }

    const isFavorite = userFavorites.includes(productId);

    try {
      console.log('Toggling favorite for user:', userId, 'product:', productId);
      if (isFavorite) {
        const response = await fetch(`http://localhost:5001/api/user/favorites/${userId}/${productId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setUserFavorites(prev => prev.filter(id => id !== productId));
          setSnackbar({ open: true, message: 'Ürün favorilerden çıkarıldı', severity: 'info' });
        } else {
          const errorText = await response.text();
          console.error('Remove favorite error:', response.status, errorText);
          throw new Error('Failed to remove from favorites');
        }
      } else {
        const response = await fetch('http://localhost:5001/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId, productId })
        });
        if (response.ok) {
          setUserFavorites(prev => [...prev, productId]);
          setSnackbar({ open: true, message: 'Ürün favorilere eklendi', severity: 'success' });
        } else {
          const errorText = await response.text();
          console.error('Add favorite error:', response.status, errorText);
          throw new Error('Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Sepete eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found. User object:', user);
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.', severity: 'error' });
      return;
    }

    try {
      console.log('Adding to cart for user:', userId, 'product:', productId);
      const response = await fetch('http://localhost:5001/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, productId, quantity: 1 })
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Ürün sepete eklendi', severity: 'success' });
        // Refresh cart count in navbar
        if (window.refreshCartCount) {
          window.refreshCartCount();
        }
      } else {
        const errorText = await response.text();
        console.error('Add to cart error:', response.status, errorText);
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const filteredItems = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalProducts = filteredItems.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ürünlerimiz
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Evinizi güzelleştirecek kaliteli ürünleri keşfedin
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Ürün ara..."
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
          <Grid item xs={12} md={4}>
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
            <Typography variant="body2" color="text.secondary" align="center">
              {totalProducts} ürün bulundu
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Sayfa {currentPage} / {totalPages}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {currentProducts.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || 'https://via.placeholder.com/300'}
                  alt={item.name}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                  }}
                  onClick={() => handleToggleFavorite(item._id)}
                >
                  {userFavorites.includes(item._id) ? (
                    <FavoriteIcon sx={{ color: 'red' }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                {item.category && (
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'primary.main',
                      color: 'white',
                    }}
                  />
                )}
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                
                {item.brand && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.brand}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        sx={{ 
                          fontSize: 16, 
                          color: i < (item.averageRating || 0) ? '#FFC107' : '#E0E0E0' 
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ({item.totalReviews || 0})
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  paragraph
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    ₺{item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stok: {item.stock || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      py: 1,
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                    onClick={() => handleAddToCart(item._id)}
                    disabled={item.stock === 0}
                  >
                    {item.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/product/${item._id}`)}
                    sx={{ minWidth: 'auto' }}
                  >
                    <VisibilityIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 'bold',
              },
              '& .Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              },
            }}
          />
        </Box>
      )}

      {currentProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            Aradığınız kriterlere uygun ürün bulunamadı
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Farklı arama terimleri veya kategoriler deneyebilirsiniz
          </Typography>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products; 