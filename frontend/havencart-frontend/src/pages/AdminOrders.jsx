import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Pending as PendingIcon,
  Cancel as CancelledIcon,
  TrendingUp as RevenueIcon,
} from '@mui/icons-material';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Mock data for demonstration
      setOrders([
        {
          _id: '1',
          orderNumber: 'SP001',
          user: { name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
          items: [
            { product: { name: 'Modern Aydınlatma', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=100' }, quantity: 1, price: 299.99 }
          ],
          totalAmount: 299.99,
          status: 'delivered',
          createdAt: '2024-01-15T10:00:00Z',
          shippingAddress: { name: 'Ahmet Yılmaz', address: 'Çankaya, Ankara', city: 'Ankara', phone: '5551234567' },
          trackingNumber: 'TR123456789'
        },
        {
          _id: '2',
          orderNumber: 'SP002',
          user: { name: 'Fatma Demir', email: 'fatma@example.com' },
          items: [
            { product: { name: 'Dekoratif Vazo', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' }, quantity: 2, price: 149.99 }
          ],
          totalAmount: 299.98,
          status: 'shipping',
          createdAt: '2024-01-20T14:30:00Z',
          shippingAddress: { name: 'Fatma Demir', address: 'Kadıköy, İstanbul', city: 'İstanbul', phone: '5559876543' },
          trackingNumber: 'TR123456790'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewOrderDialog(true);
  };

  const handleCloseDialog = () => {
    setViewOrderDialog(false);
    setSelectedOrder(null);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Beklemede', color: 'warning', icon: <PendingIcon /> },
      confirmed: { label: 'Onaylandı', color: 'info', icon: <CheckCircle /> },
      shipping: { label: 'Kargoda', color: 'primary', icon: <ShippingIcon /> },
      delivered: { label: 'Teslim Edildi', color: 'success', icon: <DeliveredIcon /> },
      cancelled: { label: 'İptal Edildi', color: 'error', icon: <CancelledIcon /> }
    };
    return statusMap[status] || { label: status, color: 'default', icon: <PendingIcon /> };
  };

  const filterOrders = (status) => {
    switch (status) {
      case 0: return orders;
      case 1: return orders.filter(order => order.status === 'pending');
      case 2: return orders.filter(order => order.status === 'shipping');
      case 3: return orders.filter(order => order.status === 'delivered');
      case 4: return orders.filter(order => order.status === 'cancelled');
      default: return orders;
    }
  };

  const filteredOrders = filterOrders(selectedTab);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Siparişler yükleniyor...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Sipariş Yönetimi
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Tüm siparişleri buradan yönetebilirsiniz
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <OrdersIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Sipariş
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Beklemede
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShippingIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.shipping}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kargoda
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DeliveredIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.delivered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teslim Edildi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RevenueIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ₺{stats.revenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Gelir
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ px: 2 }}
        >
          <Tab label={`Tümü (${stats.total})`} />
          <Tab label={`Beklemede (${stats.pending})`} />
          <Tab label={`Kargoda (${stats.shipping})`} />
          <Tab label={`Teslim Edildi (${stats.delivered})`} />
          <Tab label={`İptal Edildi (${stats.cancelled})`} />
        </Tabs>
      </Paper>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sipariş No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <TableRow key={order._id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      #{order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.items.length} ürün
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{order.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      ₺{order.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusInfo.icon}
                      label={statusInfo.label}
                      color={statusInfo.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewOrder(order)}
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'warning.main' }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog open={viewOrderDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6">
            Sipariş Detayları - #{selectedOrder?.orderNumber}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Müşteri Bilgileri</Typography>
                  <Typography><strong>Ad:</strong> {selectedOrder.user.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedOrder.user.email}</Typography>
                  <Typography><strong>Telefon:</strong> {selectedOrder.shippingAddress?.phone}</Typography>
                  <Typography><strong>Adres:</strong> {selectedOrder.shippingAddress?.address}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Sipariş Bilgileri</Typography>
                  <Typography><strong>Sipariş No:</strong> #{selectedOrder.orderNumber}</Typography>
                  <Typography><strong>Tarih:</strong> {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</Typography>
                  <Typography><strong>Durum:</strong> {getStatusInfo(selectedOrder.status).label}</Typography>
                  <Typography><strong>Kargo No:</strong> {selectedOrder.trackingNumber}</Typography>
                  <Typography><strong>Toplam:</strong> ₺{selectedOrder.totalAmount.toLocaleString()}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Ürünler</Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar src={item.product.image} alt={item.product.name} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.product.name}
                          secondary={`${item.quantity} adet × ₺${item.price} = ₺${(item.quantity * item.price).toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Durumu Güncelle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrders; 