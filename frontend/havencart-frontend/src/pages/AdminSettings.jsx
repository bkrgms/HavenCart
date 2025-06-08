import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Email as EmailIcon,
  Payment as PaymentIcon,
  Save as SaveIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'HavenCart',
    siteDescription: 'Ev dekorasyon ve mobilya mağazası',
    adminEmail: 'admin@havencart.com',
    timezone: 'Europe/Istanbul',
    language: 'tr',
    currency: 'TRY',
    maintenanceMode: false,
    registrationEnabled: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChar: true,
    twoFactorAuth: false,
    ipWhitelist: '',
    sslRequired: true,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'info@havencart.com',
    fromName: 'HavenCart',
    emailNotifications: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    paymentGateway: 'stripe',
    testMode: true,
    currency: 'TRY',
    taxRate: 18,
    shippingCost: 29.90,
    freeShippingThreshold: 500,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGeneralChange = (field, value) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field, value) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbarMessage('Ayarlar başarıyla kaydedildi!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbarMessage('Ayarlar kaydedilirken bir hata oluştu!');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSnackbarMessage('Sistem yedeği başarıyla oluşturuldu!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Yedek oluşturulurken bir hata oluştu!');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const tabs = [
    { label: 'Genel', icon: <SettingsIcon /> },
    { label: 'Güvenlik', icon: <SecurityIcon /> },
    { label: 'E-posta', icon: <EmailIcon /> },
    { label: 'Ödeme', icon: <PaymentIcon /> },
    { label: 'Sistem', icon: <StorageIcon /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Sistem Ayarları
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sistem yapılandırmasını yönetin
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
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

      {/* Settings Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ px: 2 }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  {tab.label}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Genel Ayarlar
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Site Adı"
                  value={generalSettings.siteName}
                  onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admin E-posta"
                  value={generalSettings.adminEmail}
                  onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Açıklaması"
                  value={generalSettings.siteDescription}
                  onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Zaman Dilimi</InputLabel>
                  <Select
                    value={generalSettings.timezone}
                    label="Zaman Dilimi"
                    onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                  >
                    <MenuItem value="Europe/Istanbul">Europe/Istanbul</MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="America/New_York">America/New_York</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Para Birimi</InputLabel>
                  <Select
                    value={generalSettings.currency}
                    label="Para Birimi"
                    onChange={(e) => handleGeneralChange('currency', e.target.value)}
                  >
                    <MenuItem value="TRY">TRY (₺)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) => handleGeneralChange('maintenanceMode', e.target.checked)}
                    />
                  }
                  label="Bakım Modu"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={generalSettings.registrationEnabled}
                      onChange={(e) => handleGeneralChange('registrationEnabled', e.target.checked)}
                    />
                  }
                  label="Kullanıcı Kaydına İzin Ver"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Güvenlik Ayarları
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Oturum Zaman Aşımı (dakika)"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maksimum Giriş Denemesi"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Şifre Uzunluğu"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => handleSecurityChange('passwordMinLength', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IP Beyaz Listesi"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.requireSpecialChar}
                      onChange={(e) => handleSecurityChange('requireSpecialChar', e.target.checked)}
                    />
                  }
                  label="Şifrede Özel Karakter Zorunlu"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                    />
                  }
                  label="İki Faktörlü Kimlik Doğrulama"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={securitySettings.sslRequired}
                      onChange={(e) => handleSecurityChange('sslRequired', e.target.checked)}
                    />
                  }
                  label="SSL Zorunlu"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              E-posta Ayarları
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Host"
                  value={emailSettings.smtpHost}
                  onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Port"
                  value={emailSettings.smtpPort}
                  onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Kullanıcı Adı"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMTP Şifre"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gönderen E-posta"
                  value={emailSettings.fromEmail}
                  onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gönderen Adı"
                  value={emailSettings.fromName}
                  onChange={(e) => handleEmailChange('fromName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailSettings.emailNotifications}
                      onChange={(e) => handleEmailChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="E-posta Bildirimlerini Etkinleştir"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ödeme Ayarları
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ödeme Ağ Geçidi</InputLabel>
                  <Select
                    value={paymentSettings.paymentGateway}
                    label="Ödeme Ağ Geçidi"
                    onChange={(e) => handlePaymentChange('paymentGateway', e.target.value)}
                  >
                    <MenuItem value="stripe">Stripe</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                    <MenuItem value="iyzico">Iyzico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="KDV Oranı (%)"
                  type="number"
                  value={paymentSettings.taxRate}
                  onChange={(e) => handlePaymentChange('taxRate', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kargo Ücreti (₺)"
                  type="number"
                  value={paymentSettings.shippingCost}
                  onChange={(e) => handlePaymentChange('shippingCost', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ücretsiz Kargo Limiti (₺)"
                  type="number"
                  value={paymentSettings.freeShippingThreshold}
                  onChange={(e) => handlePaymentChange('freeShippingThreshold', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentSettings.testMode}
                      onChange={(e) => handlePaymentChange('testMode', e.target.checked)}
                    />
                  }
                  label="Test Modu"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Sistem Yönetimi
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Sistem yedekleme ve bakım işlemleri sistem performansını etkileyebilir.
                </Alert>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <BackupIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Sistem Yedeği
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Tüm veritabanı ve dosyaların yedeğini oluşturun
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleBackup}
                    sx={{ mt: 1 }}
                  >
                    Yedek Oluştur
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <StorageIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Önbellek Temizle
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Sistem önbelleğini temizleyerek performansı artırın
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ mt: 1 }}
                  >
                    Önbelleği Temizle
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Sistem Bilgileri
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Uygulama Sürümü
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        v1.0.0
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Veritabanı Boyutu
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        245 MB
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Toplam Kullanıcı
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        1,247
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Son Güncelleme
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        25.01.2024
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSettings; 