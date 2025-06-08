import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  Paper,
  Chip,
  IconButton,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  // Better user ID handling
  const getUserId = () => {
    if (!user) return null;
    return user.id || user._id || null;
  };

  useEffect(() => {
    loadFeaturedProducts();
    if (isLoggedIn && getUserId()) {
      loadUserFavorites();
    }
  }, [isLoggedIn]);

  const loadFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const products = await response.json();
      // Take first 6 products as featured
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

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

  const features = [
    {
      icon: <ShippingIcon sx={{ fontSize: 48 }} />,
      title: 'Ücretsiz Kargo',
      description: '500 TL üzeri alışverişlerde ücretsiz kargo',
      color: '#4CAF50',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Güvenli Ödeme',
      description: '256-bit SSL ile korumalı ödeme sistemi',
      color: '#2196F3',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 48 }} />,
      title: '7/24 Destek',
      description: 'Her zaman yanınızda müşteri desteği',
      color: '#FF9800',
    },
    {
      icon: <MoneyOffIcon sx={{ fontSize: 48 }} />,
      title: 'İade Garantisi',
      description: '14 gün koşulsuz iade garantisi',
      color: '#9C27B0',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            HavenCart'a Hoş Geldiniz
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Evinizi güzelleştirecek kaliteli ürünler, uygun fiyatlarla
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Ürünleri Keşfet
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Neden HavenCart?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Products Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              Öne Çıkan Ürünler
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              sx={{ fontWeight: 'bold' }}
            >
              Tümünü Gör
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
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
                      image={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                      }}
                      onClick={() => handleToggleFavorite(product._id)}
                    >
                      {userFavorites.includes(product._id) ? (
                        <FavoriteIcon sx={{ color: 'red' }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    {product.category && (
                      <Chip
                        label={product.category}
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
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: 16, color: '#FFC107' }} />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        ({product.totalReviews || 0} değerlendirme)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        ₺{product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stok: {product.stock || 0}
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
                        onClick={() => handleAddToCart(product._id)}
                      >
                        Sepete Ekle
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/product/${product._id}`)}
                        sx={{ minWidth: 'auto' }}
                      >
                        İncele
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

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
    </Box>
  );
};

export default Home; 