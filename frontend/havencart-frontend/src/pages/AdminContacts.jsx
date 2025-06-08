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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from '@mui/material';
import {
  ContactMail as ContactIcon,
  Visibility as ViewIcon,
  Reply as ReplyIcon,
  CheckCircle as MarkIcon,
  Close as CloseIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Inbox as InboxIcon,
  MarkEmailRead as ReadIcon,
} from '@mui/icons-material';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewContactDialog, setViewContactDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/admin/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Mock data for demonstration
      setContacts([
        {
          _id: '1',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '5551234567',
          subject: 'Ürün İadesi Hakkında',
          message: 'Merhaba, satın aldığım ürünü iade etmek istiyorum. Nasıl bir prosedür izlemeliyim?',
          status: 'new',
          priority: 'medium',
          createdAt: '2024-01-25T10:30:00Z',
          adminNotes: ''
        },
        {
          _id: '2',
          name: 'Fatma Demir',
          email: 'fatma@example.com',
          phone: '5559876543',
          subject: 'Kargo Sorunu',
          message: 'Siparişimi vereli 1 hafta oldu ancak henüz kargo takip numarası alamadım. Yardımcı olabilir misiniz?',
          status: 'read',
          priority: 'high',
          createdAt: '2024-01-24T14:15:00Z',
          adminNotes: 'Kargo firması ile irtibata geçildi'
        },
        {
          _id: '3',
          name: 'Mehmet Özkan',
          email: 'mehmet@example.com',
          phone: '',
          subject: 'Ürün Bilgisi',
          message: 'Modern aydınlatma ürününüzün teknik özellikleri hakkında detaylı bilgi alabilir miyim?',
          status: 'replied',
          priority: 'low',
          createdAt: '2024-01-23T16:45:00Z',
          adminNotes: 'Detaylı ürün broşürü gönderildi'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setViewContactDialog(true);
    setReplyText('');
  };

  const handleCloseDialog = () => {
    setViewContactDialog(false);
    setSelectedContact(null);
    setReplyText('');
  };

  const handleUpdateStatus = async (contactId, newStatus, notes = '') => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes
        })
      });

      if (response.ok) {
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact._id === contactId 
            ? { ...contact, status: newStatus, adminNotes: notes }
            : contact
        ));
        
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(prev => ({ ...prev, status: newStatus, adminNotes: notes }));
        }
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      new: { label: 'Yeni', color: 'primary', icon: <InboxIcon /> },
      read: { label: 'Okundu', color: 'info', icon: <ReadIcon /> },
      replied: { label: 'Yanıtlandı', color: 'success', icon: <ReplyIcon /> },
      closed: { label: 'Kapatıldı', color: 'default', icon: <CloseIcon /> }
    };
    return statusMap[status] || { label: status, color: 'default', icon: <InboxIcon /> };
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

  const filterContacts = (status) => {
    switch (status) {
      case 0: return contacts;
      case 1: return contacts.filter(contact => contact.status === 'new');
      case 2: return contacts.filter(contact => contact.status === 'read');
      case 3: return contacts.filter(contact => contact.status === 'replied');
      case 4: return contacts.filter(contact => contact.status === 'closed');
      default: return contacts;
    }
  };

  const filteredContacts = filterContacts(selectedTab);

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    closed: contacts.filter(c => c.status === 'closed').length,
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          İletişim mesajları yükleniyor...
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
            İletişim Mesajları
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Müşteri mesajlarını yönetin ve yanıtlayın
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ContactIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Mesaj
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <InboxIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.new}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yeni
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReadIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.read}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Okundu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReplyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.replied}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yanıtlandı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CloseIcon sx={{ fontSize: 40, color: 'default', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.closed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kapatıldı
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
          <Tab label={`Yeni (${stats.new})`} />
          <Tab label={`Okundu (${stats.read})`} />
          <Tab label={`Yanıtlandı (${stats.replied})`} />
          <Tab label={`Kapatıldı (${stats.closed})`} />
        </Tabs>
      </Paper>

      {/* Contacts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gönderen</TableCell>
              <TableCell>Konu</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Öncelik</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.map((contact) => {
              const statusInfo = getStatusInfo(contact.status);
              const priorityInfo = getPriorityInfo(contact.priority);
              return (
                <TableRow key={contact._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {contact.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.email}
                      </Typography>
                      {contact.phone && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {contact.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {contact.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contact.message.substring(0, 60)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={priorityInfo.label}
                      color={priorityInfo.color}
                      size="small"
                    />
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
                      onClick={() => handleViewContact(contact)}
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon />
                    </IconButton>
                    {contact.status !== 'read' && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleUpdateStatus(contact._id, 'read')}
                        sx={{ color: 'info.main' }}
                      >
                        <MarkIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Contact Details Dialog */}
      <Dialog open={viewContactDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Mesaj Detayları</Typography>
            <Box>
              <Chip
                label={getPriorityInfo(selectedContact?.priority).label}
                color={getPriorityInfo(selectedContact?.priority).color}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={getStatusInfo(selectedContact?.status).icon}
                label={getStatusInfo(selectedContact?.status).label}
                color={getStatusInfo(selectedContact?.status).color}
                size="small"
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>İletişim Bilgileri</Typography>
                  <Typography><strong>Ad:</strong> {selectedContact.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedContact.email}</Typography>
                  {selectedContact.phone && (
                    <Typography><strong>Telefon:</strong> {selectedContact.phone}</Typography>
                  )}
                  <Typography><strong>Tarih:</strong> {new Date(selectedContact.createdAt).toLocaleString('tr-TR')}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Durum Yönetimi</Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Durum</InputLabel>
                    <Select
                      value={selectedContact.status}
                      label="Durum"
                      onChange={(e) => handleUpdateStatus(selectedContact._id, e.target.value)}
                    >
                      <MenuItem value="new">Yeni</MenuItem>
                      <MenuItem value="read">Okundu</MenuItem>
                      <MenuItem value="replied">Yanıtlandı</MenuItem>
                      <MenuItem value="closed">Kapatıldı</MenuItem>
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Konu: {selectedContact.subject}</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedContact.message}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Admin Notları</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={selectedContact.adminNotes || ''}
                    placeholder="İç notlar ekleyin..."
                    onChange={(e) => setSelectedContact(prev => ({ ...prev, adminNotes: e.target.value }))}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Yanıt Gönder</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={replyText}
                    placeholder="Müşteriye yanıt yazın..."
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
          <Button
            onClick={() => handleUpdateStatus(selectedContact._id, selectedContact.status, selectedContact.adminNotes)}
            color="primary"
          >
            Notları Kaydet
          </Button>
          <Button
            variant="contained"
            startIcon={<ReplyIcon />}
            onClick={() => {
              handleUpdateStatus(selectedContact._id, 'replied', selectedContact.adminNotes);
              // Here you would typically send the email
              handleCloseDialog();
            }}
            disabled={!replyText.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Yanıt Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminContacts; 