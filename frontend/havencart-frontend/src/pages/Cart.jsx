import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  IconButton,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
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
    loadCartItems();
  }, [isLoggedIn, navigate]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found. User object:', user);
        setCartItems([]);
        setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.', severity: 'error' });
        return;
      }

      console.log('Loading cart for user ID:', userId);
      const response = await fetch(`http://localhost:5001/api/user/cart/${userId}`);
      if (response.ok) {
        const items = await response.json();
        console.log('Cart items loaded:', items);
        
        // Filter out items with null/undefined products
        const validItems = items.filter(item => item && item.product && item.product._id);
        setCartItems(validItems);
        
        // If some items were filtered out, show a warning
        if (items.length !== validItems.length) {
          console.warn('Some cart items were filtered out due to missing product data');
          setSnackbar({ 
            open: true, 
            message: 'Bazı ürünler sepetinizden kaldırıldı (artık mevcut değil)', 
            severity: 'warning' 
          });
        }
      } else {
        console.error('Failed to load cart items. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      setSnackbar({ open: true, message: 'Sepet yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity, itemType = 'product') => {
    if (newQuantity <= 0) {
      removeFromCart(productId, itemType);
      return;
    }

    try {
      const userId = getUserId();
      if (!userId) {
        setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
        return;
      }

      const response = await fetch('http://localhost:5001/api/user/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: newQuantity, type: itemType })
      });

      if (response.ok) {
        // Update local state
        setCartItems(prev => 
          prev.map(item => 
            item.product && item.product._id === productId && item.type === itemType
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        // Refresh cart count in navbar
        if (window.refreshCartCount) {
          window.refreshCartCount();
        }
      } else {
        console.error('Failed to update quantity. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setSnackbar({ open: true, message: 'Miktar güncellenemedi', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbar({ open: true, message: 'Miktar güncellenemedi', severity: 'error' });
    }
  };

  const removeFromCart = async (productId, itemType = 'product') => {
    try {
      const userId = getUserId();
      if (!userId) {
        setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
        return;
      }

      const response = await fetch(`http://localhost:5001/api/user/cart/${userId}/${productId}?type=${itemType}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Update local state
        setCartItems(prev => prev.filter(item => 
          !(item.product && item.product._id === productId && item.type === itemType)
        ));
        setSnackbar({ open: true, message: 'Ürün sepetten çıkarıldı', severity: 'info' });
        // Refresh cart count in navbar
        if (window.refreshCartCount) {
          window.refreshCartCount();
        }
      } else {
        console.error('Failed to remove from cart. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setSnackbar({ open: true, message: 'Ürün çıkarılamadı', severity: 'error' });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setSnackbar({ open: true, message: 'Ürün çıkarılamadı', severity: 'error' });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (item && item.product && item.product.price && item.quantity) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 500 ? 0 : 29.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Sepet yükleniyor...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Sepetim
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {cartItems.length} ürün sepetinizde
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Sepetiniz boş
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Alışverişe başlamak için ürünler sayfasını ziyaret edin
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
            Alışverişe Başla
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Sepet Ürünleri */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {cartItems.map((item) => {
                // Additional safety check
                if (!item || !item.product || !item.product._id) {
                  return null;
                }
                
                return (
                  <Box key={item.product._id}>
                    <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                      <Grid item xs={3}>
                        <img
                          src={item.product.image || 'https://via.placeholder.com/150'}
                          alt={item.product.name || 'Ürün'}
                          style={{ 
                            width: '100%', 
                            height: 'auto',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {item.product.name || 'Bilinmeyen Ürün'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₺{item.product.price || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Stok: {item.product.stock || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.product._id, (item.quantity || 1) - 1, item.type)}
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity || 1}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              if (newQuantity > 0 && newQuantity <= (item.product.stock || 999)) {
                                updateQuantity(item.product._id, newQuantity, item.type);
                              }
                            }}
                            inputProps={{
                              min: 1,
                              max: item.product.stock || 999,
                              style: { textAlign: 'center', width: '60px' }
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.product._id, (item.quantity || 1) + 1, item.type)}
                            disabled={(item.quantity || 1) >= (item.product.stock || 999)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          ₺{((item.product.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.product._id, item.type)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider />
                  </Box>
                );
              })}
            </Paper>
          </Grid>

          {/* Sipariş Özeti */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Sipariş Özeti
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Ara Toplam:</Typography>
                  <Typography variant="body1">₺{calculateSubtotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Kargo:</Typography>
                  <Typography variant="body1">
                    {calculateShipping() === 0 ? 'Ücretsiz' : `₺${calculateShipping().toFixed(2)}`}
                  </Typography>
                </Box>
                {calculateShipping() > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    500 TL üzeri alışverişlerde kargo ücretsiz
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Toplam:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ₺{calculateTotal().toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
                sx={{
                  py: 2,
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                Satın Al
              </Button>
            </Paper>
          </Grid>
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

export default Cart; 