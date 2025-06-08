import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Rating,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
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
    loadProduct();
    if (isLoggedIn && getUserId()) {
      checkIfFavorite();
    }
  }, [id, isLoggedIn]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/products`);
      const products = await response.json();
      const foundProduct = products.find(p => p._id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setSnackbar({ open: true, message: 'Ürün bulunamadı', severity: 'error' });
        navigate('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setSnackbar({ open: true, message: 'Ürün yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found. User object:', user);
        return;
      }

      const response = await fetch(`http://localhost:5001/api/user/favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        setIsFavorite(favorites.some(fav => fav._id === id));
      } else {
        console.error('Failed to check favorites. Status:', response.status);
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
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
      const response = await fetch('http://localhost:5001/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, productId: product._id, quantity })
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

  const toggleFavorite = async () => {
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

    try {
      if (isFavorite) {
        const response = await fetch(`http://localhost:5001/api/user/favorites/${userId}/${product._id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setIsFavorite(false);
          setSnackbar({ open: true, message: 'Ürün favorilerden çıkarıldı', severity: 'info' });
        } else {
          console.error('Failed to remove from favorites. Status:', response.status);
          throw new Error('Failed to remove from favorites');
        }
      } else {
        const response = await fetch('http://localhost:5001/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId, productId: product._id })
        });
        if (response.ok) {
          setIsFavorite(true);
          setSnackbar({ open: true, message: 'Ürün favorilere eklendi', severity: 'success' });
        } else {
          console.error('Failed to add to favorites. Status:', response.status);
          throw new Error('Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const getProductImages = () => {
    if (!product) return [];
    
    // If product has multiple images, use them; otherwise use the main image
    if (product.images && product.images.length > 0) {
      return product.images.sort((a, b) => a.order - b.order);
    } else if (product.image) {
      return [{ url: product.image, isPrimary: true, order: 0 }];
    }
    return [{ url: 'https://via.placeholder.com/600', isPrimary: true, order: 0 }];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Ürün yükleniyor...
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Ürün bulunamadı</Typography>
      </Container>
    );
  }

  const productImages = getProductImages();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={6}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Main Image */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <img
                src={productImages[selectedImageIndex]?.url || 'https://via.placeholder.com/600'}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                }}
                onClick={toggleFavorite}
              >
                {isFavorite ? (
                  <FavoriteIcon sx={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <Grid container spacing={1}>
                {productImages.map((image, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      sx={{
                        border: selectedImageIndex === index ? '2px solid #667eea' : '1px solid #e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': { borderColor: '#667eea' }
                      }}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Category and Brand */}
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={product.category} 
                variant="outlined" 
                sx={{ mr: 2, mb: 1 }} 
              />
              {product.brand && (
                <Chip 
                  label={product.brand} 
                  variant="outlined" 
                  color="secondary"
                />
              )}
            </Box>

            {/* Product Name */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating 
                value={product.averageRating || 0} 
                precision={0.1} 
                readOnly 
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({product.totalReviews || 0} değerlendirme)
              </Typography>
            </Box>

            {/* Price */}
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              ₺{product.price}
            </Typography>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                Stok Durumu: {' '}
                <span style={{ 
                  color: product.stock > 0 ? '#4caf50' : '#f44336',
                  fontWeight: 'bold'
                }}>
                  {product.stock > 0 ? `${product.stock} adet mevcut` : 'Stokta yok'}
                </span>
              </Typography>
            </Box>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Özellikler
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.features.map((feature, index) => (
                    <Chip key={index} label={feature} variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Açıklama
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
            </Box>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Miktar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{
                      min: 1,
                      max: product.stock
                    }}
                    sx={{ width: '100px' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    (Maksimum {product.stock} adet)
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{
                  flex: 1,
                  py: 2,
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
              </Button>
              <IconButton
                size="large"
                onClick={toggleFavorite}
                sx={{
                  border: '1px solid #e0e0e0',
                  '&:hover': { borderColor: '#667eea' }
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon sx={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>

            {/* Specifications */}
            {product.specifications && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Teknik Özellikler
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {product.specifications}
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

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

export default ProductDetail; 