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
  Paper,
  Alert,
  Snackbar,
  Chip,
  Divider,
  Tab,
  Tabs,
  Avatar,
} from '@mui/material';
import {
  ContactMail as ContactIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const Contact = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [myContacts, setMyContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn && user.email) {
      loadMyContacts();
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [isLoggedIn, user.email]);

  const loadMyContacts = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/user/contacts?email=${user.email}`);
      const contacts = await response.json();
      setMyContacts(contacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: 'Mesajınız başarıyla gönderildi!', severity: 'success' });
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          subject: '',
          message: '',
        });
        // Reload contacts to show the new message
        if (isLoggedIn && user.email) {
          loadMyContacts();
        }
      } else {
        setSnackbar({ open: true, message: result.error || 'Bir hata oluştu', severity: 'error' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSnackbar({ open: true, message: 'Mesaj gönderilirken bir hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      new: { label: 'Yeni', color: 'primary' },
      read: { label: 'Okundu', color: 'info' },
      replied: { label: 'Yanıtlandı', color: 'success' },
      closed: { label: 'Kapatıldı', color: 'default' }
    };
    return statusMap[status] || { label: status, color: 'default' };
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      low: { label: 'Düşük', color: 'success' },
      medium: { label: 'Orta', color: 'warning' },
      high: { label: 'Yüksek', color: 'error' },
      urgent: { label: 'Acil', color: 'error' }
    };
    return priorityMap[priority] || { label: priority, color: 'default' };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          İletişim
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Sorularınız, önerileriniz veya yardıma ihtiyacınız için bizimle iletişime geçin. 
          Size en kısa sürede dönüş yapacağız.
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab label="Mesaj Gönder" />
          {isLoggedIn && <Tab label={`Mesajlarım (${myContacts.length})`} />}
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={6}>
          {/* İletişim Bilgileri */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                İletişim Bilgileri
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                HavenCart ekibi olarak sizlere en iyi hizmeti sunmak için buradayız.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Telefon
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +90 (312) 123 45 67
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        E-posta
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        info@havencart.com
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Adres
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Çankaya Mahallesi, Ankara Caddesi No: 123/A
                        <br />
                        06420 Çankaya / Ankara
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Working Hours */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Çalışma Saatleri
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Pazartesi - Cuma:</strong> 09:00 - 18:00
                <br />
                <strong>Cumartesi:</strong> 10:00 - 16:00
                <br />
                <strong>Pazar:</strong> Kapalı
              </Typography>
            </Paper>
          </Grid>

          {/* İletişim Formu */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Mesaj Gönder
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ad Soyad"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Konu"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mesajınız"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<SendIcon />}
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                      }}
                    >
                      {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && isLoggedIn && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Mesajlarım
          </Typography>
          
          {myContacts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <EmailIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Henüz mesajınız yok
              </Typography>
              <Typography variant="body1" color="text.secondary">
                İlk mesajınızı göndermek için "Mesaj Gönder" sekmesini kullanın
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {myContacts.map((contact) => {
                const statusInfo = getStatusInfo(contact.status);
                const priorityInfo = getPriorityInfo(contact.priority);
                
                return (
                  <Grid item xs={12} key={contact._id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {contact.subject}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(contact.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={statusInfo.label}
                              color={statusInfo.color}
                              size="small"
                            />
                            <Chip
                              label={priorityInfo.label}
                              color={priorityInfo.color}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Typography variant="body1" paragraph>
                          {contact.message}
                        </Typography>

                        {contact.replies && contact.replies.length > 0 && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              Cevaplar:
                            </Typography>
                            {contact.replies.map((reply, index) => (
                              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: reply.from === 'admin' ? 'primary.main' : 'secondary.main' }}>
                                    {reply.from === 'admin' ? <AdminIcon /> : <PersonIcon />}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                      {reply.from === 'admin' ? (reply.adminName || 'HavenCart Destek') : 'Siz'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(reply.createdAt).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="body2">
                                  {reply.message}
                                </Typography>
                              </Box>
                            ))}
                          </>
                        )}

                        {contact.adminNotes && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Alert severity="info">
                              <Typography variant="body2">
                                <strong>Admin Notları:</strong> {contact.adminNotes}
                              </Typography>
                            </Alert>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default Contact; 