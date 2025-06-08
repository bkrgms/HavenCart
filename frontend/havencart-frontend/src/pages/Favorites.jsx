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
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  // Better user ID handling
  const getUserId = () => {
    if (!user) return null;
    return user.id || user._id || null;
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/login');
      return;
    }
    loadFavorites();
  }, [isLoggedIn, navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found. User object:', user);
        setFavorites([]);
        setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.', severity: 'error' });
        return;
      }

      console.log('Loading favorites for user ID:', userId);
      const response = await fetch(`http://localhost:5001/api/user/favorites/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        console.error('Failed to load favorites. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setSnackbar({ open: true, message: 'Favoriler yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
        return;
      }

      const response = await fetch(`http://localhost:5001/api/user/favorites/${userId}/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(product => product._id !== productId));
        setSnackbar({ open: true, message: 'Ürün favorilerden çıkarıldı', severity: 'info' });
      } else {
        console.error('Failed to remove favorite. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setSnackbar({ open: true, message: 'Ürün çıkarılamadı', severity: 'error' });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
        return;
      }

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
        console.error('Failed to add to cart. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setSnackbar({ open: true, message: 'Ürün eklenemedi', severity: 'error' });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Favoriler yükleniyor...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Favorilerim
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {favorites.length} ürün favorilerinizde
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Favori ürününüz yok
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Beğendiğiniz ürünleri favorilere ekleyerek buradan kolayca ulaşabilirsiniz
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Ürünleri Keşfet
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
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
                    onClick={() => handleRemoveFavorite(product._id)}
                  >
                    <FavoriteIcon sx={{ color: 'red' }} />
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
                  
                  {product.brand && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.brand}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          sx={{ 
                            fontSize: 16, 
                            color: i < (product.averageRating || 0) ? '#FFC107' : '#E0E0E0' 
                          }} 
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      ({product.totalReviews || 0})
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
                    {product.description}
                  </Typography>

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
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveFavorite(product._id)}
                      sx={{ minWidth: 'auto' }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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

export default Favorites; 