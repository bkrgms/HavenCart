import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Paper,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
  LocationOn as LocationIcon,
  CreditCard as PaymentIcon,
  Delete as DeleteIcon,
  Shield as PrivacyIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Lock as PasswordIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true,
    },
    privacy: {
      profileVisible: false,
      dataSharing: false,
      analytics: true,
    },
    preferences: {
      language: 'tr',
      theme: 'light',
      currency: 'TRY',
    }
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/user/login');
      return;
    }

    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    
    // Save to localStorage
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    setSuccess('Ayarlar kaydedildi!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePasswordChange = () => {
    setPasswordDialog(false);
    setSuccess('Şifre değiştirme talebi gönderildi! Email adresinizi kontrol edin.');
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleAccountDelete = () => {
    setDeleteDialog(false);
    setError('Hesap silme işlemi şu anda aktif değil. Müşteri hizmetleri ile iletişime geçin.');
    setTimeout(() => setError(''), 5000);
  };

  const settingSections = [
    {
      title: 'Bildirim Ayarları',
      icon: <NotificationsIcon />,
      items: [
        { key: 'email', label: 'Email Bildirimleri', description: 'Sipariş güncellemeleri ve önemli bilgiler' },
        { key: 'sms', label: 'SMS Bildirimleri', description: 'Kargo ve teslimat bilgilendirmeleri' },
        { key: 'push', label: 'Push Bildirimleri', description: 'Anlık bildirimler' },
        { key: 'orderUpdates', label: 'Sipariş Güncellemeleri', description: 'Sipariş durumu değişiklikleri' },
        { key: 'promotions', label: 'Kampanya Bildirimleri', description: 'İndirim ve fırsat duyuruları' },
        { key: 'newsletter', label: 'Haber Bülteni', description: 'Haftalık ürün ve içerik güncellemeleri' },
      ]
    },
    {
      title: 'Gizlilik Ayarları',
      icon: <PrivacyIcon />,
      items: [
        { key: 'profileVisible', label: 'Profil Görünürlüğü', description: 'Diğer kullanıcılar profilinizi görebilsin' },
        { key: 'dataSharing', label: 'Veri Paylaşımı', description: 'Anonim kullanım verilerinin paylaşımı' },
        { key: 'analytics', label: 'Analitik Çerezler', description: 'Site deneyimi iyileştirme amaçlı' },
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ayarlar
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Hesap ve uygulama ayarlarınızı yönetebilirsiniz
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Settings Sections */}
        <Grid item xs={12} md={8}>
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {section.icon}
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                    {section.title}
                  </Typography>
                </Box>
                
                <List>
                  {section.items.map((item, itemIndex) => (
                    <ListItem key={item.key} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings[sectionIndex === 0 ? 'notifications' : 'privacy'][item.key]}
                          onChange={(e) => handleSettingChange(
                            sectionIndex === 0 ? 'notifications' : 'privacy',
                            item.key,
                            e.target.checked
                          )}
                          color="primary"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}

          {/* Language & Theme Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon />
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                  Dil ve Görünüm
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dil
                  </Typography>
                  <Chip label="Türkçe" color="primary" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tema
                  </Typography>
                  <Chip label="Açık Tema" color="primary" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Para Birimi
                  </Typography>
                  <Chip label="₺ TRY" color="primary" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Hesap İşlemleri
              </Typography>
              
              <List>
                <ListItem
                  button
                  onClick={() => setPasswordDialog(true)}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <PasswordIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Şifre Değiştir"
                    secondary="Hesap güvenliğinizi artırın"
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => navigate('/profile')}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <EditIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profil Düzenle"
                    secondary="Kişisel bilgilerinizi güncelleyin"
                  />
                </ListItem>

                <ListItem
                  button
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Adres Defteri"
                    secondary="Teslimat adreslerinizi yönetin"
                  />
                </ListItem>

                <ListItem
                  button
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <PaymentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ödeme Yöntemleri"
                    secondary="Kartlarınızı yönetin"
                  />
                </ListItem>

                <Divider sx={{ my: 2 }} />

                <ListItem
                  button
                  onClick={() => setDeleteDialog(true)}
                  sx={{ borderRadius: 1, '&:hover': { backgroundColor: 'error.light' } }}
                >
                  <ListItemIcon>
                    <DeleteIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hesabı Sil"
                    secondary="Hesabınızı kalıcı olarak silin"
                    primaryTypographyProps={{ color: 'error' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Paper sx={{ p: 3, mt: 3, backgroundColor: 'primary.light' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}>
                Güvenlik
              </Typography>
            </Box>
            <Typography variant="body2" color="primary.dark">
              Hesabınız 256-bit SSL şifreleme ile korunmaktadır. Şifrenizi düzenli olarak değiştirmeyi unutmayın.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Şifre Değiştir</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Şifrenizi değiştirmek için email adresinize bir bağlantı gönderilecek.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Mevcut Şifre"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Yeni Şifre"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Yeni Şifre (Tekrar)"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>İptal</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Şifre Değiştir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Account Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Hesabı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu işlem geri alınamaz! Hesabınızı sildiğinizde:
          </DialogContentText>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <li>Tüm kişisel verileriniz silinecek</li>
            <li>Sipariş geçmişiniz kaybolacak</li>
            <li>Favori ürünleriniz silinecek</li>
            <li>Bu email ile tekrar kayıt olamazsınız</li>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>İptal</Button>
          <Button onClick={handleAccountDelete} color="error" variant="contained">
            Hesabı Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings; 