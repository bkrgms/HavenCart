import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    salesByMonth: [],
    topProducts: [],
    orderStatusDistribution: [],
    userGrowth: [],
    categoryPerformance: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/admin/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Mock data for demonstration
      setAnalyticsData({
        salesByMonth: [
          { month: 'Ocak', sales: 35000, orders: 150 },
          { month: 'Şubat', sales: 42000, orders: 180 },
          { month: 'Mart', sales: 38000, orders: 165 },
          { month: 'Nisan', sales: 45000, orders: 200 },
          { month: 'Mayıs', sales: 52000, orders: 220 },
          { month: 'Haziran', sales: 48000, orders: 210 }
        ],
        topProducts: [
          { name: 'Modern Aydınlatma', totalSold: 125, revenue: 37500, growth: 15 },
          { name: 'Dekoratif Vazo', totalSold: 98, revenue: 24500, growth: 8 },
          { name: 'Mutfak Seti', totalSold: 87, revenue: 52200, growth: 22 },
          { name: 'Yatak Odası Takımı', totalSold: 45, revenue: 67500, growth: -5 },
          { name: 'Bahçe Mobilyası', totalSold: 56, revenue: 33600, growth: 12 }
        ],
        orderStatusDistribution: [
          { status: 'Teslim Edildi', count: 450, percentage: 65 },
          { status: 'Kargoda', count: 120, percentage: 17 },
          { status: 'Hazırlanıyor', count: 85, percentage: 12 },
          { status: 'İptal Edildi', count: 40, percentage: 6 }
        ],
        categoryPerformance: [
          { category: 'Ev Dekorasyon', sales: 85000, orders: 340, avgValue: 250 },
          { category: 'Mutfak', sales: 62000, orders: 280, avgValue: 221 },
          { category: 'Aydınlatma', sales: 45000, orders: 150, avgValue: 300 },
          { category: 'Bahçe', sales: 38000, orders: 95, avgValue: 400 },
          { category: 'Yatak Odası', sales: 72000, orders: 120, avgValue: 600 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Teslim Edildi': 'success',
      'Kargoda': 'info',
      'Hazırlanıyor': 'warning',
      'İptal Edildi': 'error'
    };
    return colorMap[status] || 'default';
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'success.main';
    if (growth < 0) return 'error.main';
    return 'text.secondary';
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? '↗' : growth < 0 ? '↘' : '→';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Analitik veriler yükleniyor...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Analitik Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Detaylı satış ve performans analizleri
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Toplam Görüntülenme
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    24.5K
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% bu ay
                  </Typography>
                </Box>
                <ViewIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Dönüşüm Oranı
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    3.2%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +0.8% bu ay
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Müşteri Memnuniyeti
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    4.8
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +0.2 bu ay
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 48, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Aktif Kullanıcılar
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    1.8K
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +156 bu ay
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Sales Chart (simulated) */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aylık Satış Performansı
            </Typography>
            <Box sx={{ mt: 2 }}>
              {analyticsData.salesByMonth.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.month}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      ₺{item.sales.toLocaleString()} ({item.orders} sipariş)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(item.sales / 55000) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sipariş Durumu Dağılımı
            </Typography>
            <Box sx={{ mt: 2 }}>
              {analyticsData.orderStatusDistribution.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={item.status} 
                      color={getStatusColor(item.status)} 
                      size="small" 
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.count} (%{item.percentage})
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.percentage} 
                    color={getStatusColor(item.status)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Top Products Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              En İyi Performans Gösteren Ürünler
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ürün</TableCell>
                    <TableCell align="right">Satış</TableCell>
                    <TableCell align="right">Gelir</TableCell>
                    <TableCell align="right">Büyüme</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {product.totalSold}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ₺{product.revenue.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: getGrowthColor(product.growth),
                            fontWeight: 'bold'
                          }}
                        >
                          {getGrowthIcon(product.growth)} {Math.abs(product.growth)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kategori Performansı
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Kategori</TableCell>
                    <TableCell align="right">Satış</TableCell>
                    <TableCell align="right">Sipariş</TableCell>
                    <TableCell align="right">Ort. Değer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.categoryPerformance.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {category.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ₺{category.sales.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {category.orders}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ₺{category.avgValue}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Performance Indicators */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Site Performansı
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sayfa Yükleme Hızı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>2.3s</Typography>
                </Box>
                <LinearProgress variant="determinate" value={85} color="success" sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">SEO Skoru</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>92/100</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92} color="success" sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Mobil Uyumluluk</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>96/100</Typography>
                </Box>
                <LinearProgress variant="determinate" value={96} color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Müşteri Davranışları
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sepet Terk Oranı</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>23%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={23} color="warning" sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tekrar Satın Alma</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>45%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} color="info" sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Müşteri Sadakati</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Satış Kanalları
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Organik Arama</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>45%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} color="primary" sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sosyal Medya</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>30%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={30} color="secondary" sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Direkt Erişim</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>25%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={25} color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminAnalytics; 