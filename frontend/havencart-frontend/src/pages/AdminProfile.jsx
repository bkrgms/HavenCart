import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountCircle as ProfileIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    department: '',
    joinDate: '',
    lastLogin: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Load admin data from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const data = {
      name: user.name || 'Admin Kullanıcı',
      email: user.email || 'admin@havencart.com',
      phone: '+90 (312) 123 45 67',
      role: user.role || 'admin',
      department: 'Yönetim',
      joinDate: '2023-01-15',
      lastLogin: new Date().toISOString()
    };
    setAdminData(data);
    setOriginalData(data);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - restore original data
      setAdminData(originalData);
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalData(adminData);
      setEditMode(false);
      setSnackbarMessage('Profil bilgileri başarıyla güncellendi!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.name = adminData.name;
      user.email = adminData.email;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Profil güncellenirken bir hata oluştu!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Admin Profili
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kişisel bilgilerinizi yönetin
          </Typography>
        </Box>
        <Button
          variant={editMode ? "outlined" : "contained"}
          startIcon={editMode ? <CancelIcon /> : <EditIcon />}
          onClick={handleEditToggle}
          sx={!editMode ? {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          } : {}}
        >
          {editMode ? 'İptal' : 'Düzenle'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {adminData.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {adminData.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {adminData.email}
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
                {adminData.role === 'admin' ? 'Sistem Yöneticisi' : adminData.role}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Departman
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {adminData.department}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Katılım Tarihi
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(adminData.joinDate).toLocaleDateString('tr-TR')}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Son Giriş
                </Typography>
                <Typography variant="body1">
                  {new Date(adminData.lastLogin).toLocaleString('tr-TR')}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Hesap İstatistikleri
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Toplam Giriş</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>247</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Aktif Oturum</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>3 saat</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Hesap Durumu</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  Aktif
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ProfileIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Kişisel Bilgiler
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ad Soyad"
                    name="name"
                    value={adminData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="E-posta"
                    name="email"
                    type="email"
                    value={adminData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    name="phone"
                    value={adminData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departman"
                    name="department"
                    value={adminData.department}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rol"
                    name="role"
                    value={adminData.role === 'admin' ? 'Sistem Yöneticisi' : adminData.role}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Katılım Tarihi"
                    value={new Date(adminData.joinDate).toLocaleDateString('tr-TR')}
                    disabled
                  />
                </Grid>

                {editMode && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={handleEditToggle}
                        startIcon={<CancelIcon />}
                      >
                        İptal
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={<SaveIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          },
                        }}
                      >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Güvenlik Ayarları
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="İki faktörlü kimlik doğrulama"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Giriş bildirimlerini e-posta ile gönder"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Şüpheli aktivite uyarıları"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ mt: 2 }}
                  >
                    Şifre Değiştir
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Bildirim Ayarları
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Yeni sipariş bildirimleri"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Sistem güncellemesi bildirimleri"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Kullanıcı aktivite raporları"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Pazarlama bildirimleri"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProfile; 