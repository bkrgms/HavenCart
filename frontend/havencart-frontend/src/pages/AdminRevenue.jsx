import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const AdminRevenue = () => {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentTransactions: []
  });

  useEffect(() => {
    loadRevenueData();
  }, [timeFilter]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      setTimeout(() => {
        setRevenueData({
          totalRevenue: 125750.00,
          monthlyRevenue: 45200.00,
          weeklyRevenue: 12800.00,
          dailyRevenue: 2400.00,
          totalOrders: 342,
          averageOrderValue: 367.84,
          topProducts: [
            { name: 'Modern Aydınlatma', revenue: 12500, orders: 42 },
            { name: 'Dekoratif Vazo Seti', revenue: 8900, orders: 35 },
            { name: 'Mutfak Organizeri', revenue: 7200, orders: 28 },
            { name: 'Yatak Odası Takımı', revenue: 15600, orders: 12 },
            { name: 'Bahçe Mobilyası', revenue: 9800, orders: 15 }
          ],
          recentTransactions: [
            { id: 'SP001', customer: 'Ahmet Yılmaz', amount: 1299.99, date: '2024-01-25T14:30:00Z', status: 'completed' },
            { id: 'SP002', customer: 'Fatma Demir', amount: 899.50, date: '2024-01-25T12:15:00Z', status: 'completed' },
            { id: 'SP003', customer: 'Mehmet Özkan', amount: 2150.00, date: '2024-01-25T10:45:00Z', status: 'completed' },
            { id: 'SP004', customer: 'Ayşe Kaya', amount: 750.75, date: '2024-01-24T16:20:00Z', status: 'completed' },
            { id: 'SP005', customer: 'Ali Vural', amount: 1680.25, date: '2024-01-24T14:10:00Z', status: 'pending' }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setLoading(false);
    }
  };

  const getGrowthPercentage = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Gelir verileri yükleniyor...
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
            Gelir Analizi
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Satış performansı ve gelir raporları
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Zaman Aralığı</InputLabel>
          <Select
            value={timeFilter}
            label="Zaman Aralığı"
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <MenuItem value="day">Bugün</MenuItem>
            <MenuItem value="week">Bu Hafta</MenuItem>
            <MenuItem value="month">Bu Ay</MenuItem>
            <MenuItem value="year">Bu Yıl</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Revenue Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Toplam Gelir
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ₺{revenueData.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +{getGrowthPercentage(revenueData.totalRevenue, 98000)}% bu ay
                  </Typography>
                </Box>
                <RevenueIcon sx={{ fontSize: 48, color: 'primary.main' }} />
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
                    Aylık Gelir
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ₺{revenueData.monthlyRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% geçen aya göre
                  </Typography>
                </Box>
                <CalendarIcon sx={{ fontSize: 48, color: 'success.main' }} />
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
                    Toplam Sipariş
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {revenueData.totalOrders}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +8% bu ay
                  </Typography>
                </Box>
                <OrdersIcon sx={{ fontSize: 48, color: 'warning.main' }} />
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
                    Ortalama Sipariş
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    ₺{revenueData.averageOrderValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +5% geçen aya göre
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1 }} />
              En Çok Gelir Getiren Ürünler
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ürün</TableCell>
                    <TableCell align="right">Gelir</TableCell>
                    <TableCell align="right">Sipariş</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueData.topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ₺{product.revenue.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={product.orders} size="small" color="primary" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ mr: 1 }} />
              Son İşlemler
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sipariş</TableCell>
                    <TableCell>Müşteri</TableCell>
                    <TableCell align="right">Tutar</TableCell>
                    <TableCell align="right">Durum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueData.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          #{transaction.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.date).toLocaleDateString('tr-TR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {transaction.customer}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ₺{transaction.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={transaction.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                          color={transaction.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Revenue Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Haftalık Gelir
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                ₺{revenueData.weeklyRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Son 7 gün
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Günlük Gelir
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ₺{revenueData.dailyRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bugün
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Büyüme Oranı
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                +15%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Geçen aya göre
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminRevenue; 