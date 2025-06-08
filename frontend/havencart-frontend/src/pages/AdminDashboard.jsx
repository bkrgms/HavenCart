import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as OrdersIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ContactMail as ContactIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    ordersThisMonth: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    // Load dashboard data
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      const statsRes = await fetch('http://localhost:5001/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
      
      // Load recent products
      const productsRes = await fetch('http://localhost:5001/api/products');
      const products = await productsRes.json();
      setRecentProducts(products.slice(0, 5)); // Show latest 5 products
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const statCards = [
    {
      title: 'Toplam Ürünler',
      value: stats.totalProducts,
      icon: <ProductsIcon sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      action: () => navigate('/admin/products'),
    },
    {
      title: 'Toplam Kullanıcılar',
      value: stats.totalUsers,
      icon: <UsersIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Siparişler',
      value: stats.totalOrders,
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      action: () => navigate('/admin/orders'),
    },
    {
      title: 'Toplam Gelir',
      value: `₺${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#9C27B0',
      action: () => navigate('/admin/revenue'),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Dashboard yükleniyor...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Paneli
        </Typography>
        <Typography variant="h6" color="text.secondary">
          HavenCart yönetim sistemi - Hoş geldiniz!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Bu ay {stats.newUsersThisMonth} yeni kullanıcı ve {stats.ordersThisMonth} yeni sipariş kaydedildi.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={card.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: card.color, mr: 2 }}>
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Recent Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Son Eklenen Ürünler
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/products')}
                size="small"
              >
                Yeni Ürün
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <ListItem
                    key={product._id}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" size="small" sx={{ mr: 1 }}>
                          <ViewIcon />
                        </IconButton>
                        <IconButton edge="end" size="small" sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        sx={{ width: 56, height: 56 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2">
                            ₺{product.price} - {product.category}
                          </Typography>
                          <br />
                          <Chip
                            label={`Stok: ${product.stock || 0}`}
                            size="small"
                            color={product.stock > 0 ? 'success' : 'error'}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Henüz ürün eklenmemiş
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Hızlı İşlemler
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/admin/products')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ProductsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">Ürün Yönetimi</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ürün ekle, düzenle, sil
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/admin/users')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <UsersIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">Kullanıcı Yönetimi</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kullanıcıları görüntüle, yönet
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/admin/orders')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <OrdersIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6">Sipariş Yönetimi</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Siparişleri görüntüle, takip et
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate('/admin/contacts')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ContactIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6">İletişim Mesajları</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Müşteri mesajlarını yönet
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 