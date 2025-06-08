import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Pending as PendingIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/login');
      return;
    }
    loadOrders();
  }, [isLoggedIn, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Since we don't have user orders endpoint yet, we'll create empty for now
      // In a real app, this would fetch from: /api/user/orders/${user.id}
      setOrders([]); // Empty array since user hasn't made any real orders
    } catch (error) {
      console.error('Error loading orders:', error);
      setSnackbar({ open: true, message: 'Siparişler yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Hazırlanıyor', color: 'warning', icon: <PendingIcon /> },
      confirmed: { label: 'Onaylandı', color: 'info', icon: <CompletedIcon /> },
      shipping: { label: 'Kargoda', color: 'info', icon: <ShippingIcon /> },
      delivered: { label: 'Teslim Edildi', color: 'success', icon: <CompletedIcon /> },
      cancelled: { label: 'İptal Edildi', color: 'error', icon: <CancelledIcon /> }
    };
    return statusMap[status] || { label: status, color: 'default', icon: <PendingIcon /> };
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const tabs = [
    { label: 'Tümü', value: 'all', count: orders.length },
    { label: 'Hazırlanıyor', value: 'pending', count: orders.filter(o => o.status === 'pending').length },
    { label: 'Kargoda', value: 'shipping', count: orders.filter(o => o.status === 'shipping').length },
    { label: 'Teslim Edildi', value: 'delivered', count: orders.filter(o => o.status === 'delivered').length },
    { label: 'İptal Edildi', value: 'cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const currentOrders = filterOrders(tabs[activeTab].value);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Siparişler yükleniyor...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Siparişlerim
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Tüm siparişlerinizi buradan takip edebilirsiniz
        </Typography>
      </Box>

      {/* Order Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <OrderIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {orders.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Sipariş
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <ShippingIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {orders.filter(o => o.status === 'shipping').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kargoda
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CompletedIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {orders.filter(o => o.status === 'delivered').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teslim Edildi
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ₺{orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Harcama
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Filters */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            {tabs.map((tab, index) => (
              <Tab
                key={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    <Chip label={tab.count} size="small" />
                  </Box>
                }
              />
            ))}
          </Tabs>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadOrders}
            disabled={loading}
          >
            Yenile
          </Button>
        </Box>
      </Paper>

      {/* Orders List */}
      {currentOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <OrderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {activeTab === 0 ? 'Henüz siparişiniz yok' : `${tabs[activeTab].label} durumunda sipariş yok`}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {activeTab === 0 
              ? 'Alışverişe başlamak için ürünleri keşfedin ve sepete ekleyin.'
              : `${tabs[activeTab].label} durumunda herhangi bir siparişiniz bulunmuyor.`
            }
          </Typography>
          {activeTab === 0 && (
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Alışverişe Başla
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {currentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <Grid item xs={12} key={order._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Sipariş #{order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          icon={statusInfo.icon}
                          label={statusInfo.label}
                          color={statusInfo.color}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          ₺{order.totalAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Order Items */}
                    <Box sx={{ mb: 2 }}>
                      {order.items.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <img
                            src={item.product?.image || 'https://via.placeholder.com/50'}
                            alt={item.product?.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">{item.product?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} adet × ₺{item.price}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            ₺{(item.quantity * item.price).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Order Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        {order.trackingNumber && (
                          <Typography variant="body2" color="text.secondary">
                            Kargo Takip: {order.trackingNumber}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Teslimat: {order.shippingAddress?.address}, {order.shippingAddress?.city}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          startIcon={<ViewIcon />}
                          onClick={() => navigate(`/order/${order._id}`)}
                          sx={{ mr: 1 }}
                        >
                          Detaylar
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          variant="outlined"
                        >
                          Fatura
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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

export default Orders; 