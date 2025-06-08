import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  DragIndicator as DragIcon,
  Star as StarIcon,
  GetApp as ImportIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [dialogTab, setDialogTab] = useState(0); // 0: Basic Info, 1: Images
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [productStats, setProductStats] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    image: '',
    images: [],
    features: '',
    specifications: '',
    isActive: true,
  });

  const categories = [
    'Ev Dekorasyon',
    'Mutfak',
    'Aydınlatma',
    'Banyo',
    'Tekstil',
    'Elektronik',
    'Bahçe',
    'Mobilya',
    'Yatak Odası',
    'Oturma Odası'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Ürünler yüklenirken hata oluştu');
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock || '',
        image: product.image || '',
        images: product.images || [],
        features: product.features ? product.features.join(', ') : '',
        specifications: product.specifications || '',
        isActive: product.isActive !== false,
      });
    } else {
      setSelectedProduct(null);
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        image: '',
        images: [],
        features: '',
        specifications: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
    setDialogTab(0);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setDialogTab(0);
    setError('');
    setSuccess('');
  };

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Handle different input types
    let processedValue = value;
    
    if (name === 'price') {
      // Ensure price is a valid number
      processedValue = value === '' ? '' : value;
    } else if (name === 'stock') {
      // Ensure stock is a valid integer
      processedValue = value === '' ? '' : value;
    } else if (name === 'isActive') {
      processedValue = checked;
    }
    
    setForm(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Lütfen sadece resim dosyası seçin');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Resim dosyası 5MB\'dan küçük olmalıdır');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
        setSuccess('Ana görsel başarıyla yüklendi');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Resim yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Resim yükleme sırasında ağ hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.url;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = uploadedUrls.map((url, index) => ({
        url,
        order: form.images.length + index,
        isPrimary: form.images.length === 0 && index === 0
      }));

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      setSuccess(`${uploadedUrls.length} resim başarıyla yüklendi`);
    } catch (err) {
      setError('Resimler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        order: i
      }))
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const handleMoveImage = (index, direction) => {
    setForm(prev => {
      const newImages = [...prev.images];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newImages.length) {
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
        // Update order values
        newImages.forEach((img, i) => {
          img.order = i;
        });
      }
      
      return { ...prev, images: newImages };
    });
  };

  const handleSave = async () => {
    // Reset previous errors
    setError('');
    
    // Validate required fields
    if (!form.name.trim()) {
      setError('Ürün adı zorunludur');
      return;
    }
    
    if (!form.category) {
      setError('Kategori seçimi zorunludur');
      return;
    }
    
    if (!form.price || parseFloat(form.price) <= 0) {
      setError('Geçerli bir fiyat giriniz');
      return;
    }
    
    if (form.stock === '' || parseInt(form.stock) < 0) {
      setError('Geçerli bir stok miktarı giriniz');
      return;
    }

    // Check main image for new products
    if (!selectedProduct && !form.image) {
      setError('Yeni ürün için ana görsel zorunludur. Lütfen önce ana görsel yükleyin.');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim() || '',
        price: parseFloat(form.price),
        category: form.category,
        brand: form.brand.trim() || '',
        stock: parseInt(form.stock),
        specifications: form.specifications.trim() || '',
        isActive: form.isActive,
        features: form.features 
          ? form.features.split(',').map(f => f.trim()).filter(f => f) 
          : []
      };

      // Include main image
      if (form.image) {
        productData.image = form.image;
      }

      // Include additional images
      if (form.images && form.images.length > 0) {
        productData.images = form.images;
      }

      console.log('Sending product data:', productData);

      const url = selectedProduct 
        ? `http://localhost:5001/api/products/${selectedProduct._id}`
        : 'http://localhost:5001/api/products';
      
      const method = selectedProduct ? 'PUT' : 'POST';

      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(selectedProduct ? 'Ürün başarıyla güncellendi' : 'Ürün başarıyla eklendi');
        loadProducts();
        handleCloseDialog();
      } else {
        console.error('Server response error:', responseData);
        
        if (responseData.validationErrors) {
          const errorMessages = responseData.validationErrors.map(err => 
            `${err.field}: ${err.message}`
          ).join(', ');
          setError(`Doğrulama hatası: ${errorMessages}`);
        } else {
          setError(responseData.error || 'Ürün kaydedilirken hata oluştu');
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Ağ bağlantı hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndImport = async () => {
    setImportLoading(true);
    try {
      // Generate products on backend
      const generateResponse = await fetch('http://localhost:5001/api/admin/generate-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 100 })
      });
      
      if (generateResponse.ok) {
        setSuccess('100 ürün başarıyla oluşturuldu ve eklendi!');
        loadProducts();
        setBulkImportOpen(false);
      } else {
        setError('Ürün oluşturma başarısız');
      }
    } catch (err) {
      setError('Toplu import sırasında hata oluştu');
    } finally {
      setImportLoading(false);
    }
  };

  const loadProductStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/product-stats');
      const stats = await response.json();
      setProductStats(stats);
    } catch (err) {
      setError('İstatistikler yüklenirken hata oluştu');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await fetch(`http://localhost:5001/api/products/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('Ürün silindi');
      setDeleteDialogOpen(false);
      setDeleteId(null);
      loadProducts();
    } catch (err) {
      setError('Ürün silinirken hata oluştu');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Ürün Yönetimi
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<StatsIcon />}
            onClick={() => { loadProductStats(); setStatsDialogOpen(true); }}
            sx={{ borderRadius: 2 }}
          >
            İstatistikler
          </Button>
          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={() => setBulkImportOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Toplu İçe Aktar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Yeni Ürün Ekle
          </Button>
        </Box>
      </Box>

      {/* Search and Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        <Button
          variant={viewMode === 'card' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('card')}
          size="small"
        >
          Kart Görünüm
        </Button>
        <Button
          variant={viewMode === 'table' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('table')}
          size="small"
        >
          Tablo Görünüm
        </Button>
        <Typography variant="body2" color="text.secondary">
          Toplam: {filteredProducts.length} ürün
        </Typography>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Products Display */}
      {viewMode === 'card' ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || '/placeholder.jpg'}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description?.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" color="primary">
                      ₺{product.price}
                    </Typography>
                    <Chip
                      label={product.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Stok: {product.stock}
                    </Typography>
                    <Chip
                      label={product.isActive !== false ? 'Aktif' : 'Pasif'}
                      size="small"
                      color={product.isActive !== false ? 'success' : 'error'}
                    />
                  </Box>
                </CardContent>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton onClick={() => handleOpenDialog(product)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => { setDeleteId(product._id); setDeleteDialogOpen(true); }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resim</TableCell>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Marka</TableCell>
                <TableCell>Fiyat</TableCell>
                <TableCell>Stok</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img 
                      src={product.image || '/placeholder.jpg'} 
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>₺{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.isActive !== false ? 'Aktif' : 'Pasif'}
                      size="small"
                      color={product.isActive !== false ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenDialog(product)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => { setDeleteId(product._id); setDeleteDialogOpen(true); }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Dialog with Tabs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </DialogTitle>
        
        <DialogContent>
          <Tabs value={dialogTab} onChange={(e, newValue) => setDialogTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Temel Bilgiler" />
            <Tab label="Resimler" />
          </Tabs>

          {dialogTab === 0 && (
            <Grid container spacing={2}>
              {/* Basic product form fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ürün Adı *"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marka *"
                  name="brand"
                  value={form.brand}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Kategori *</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fiyat *"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0, 
                    step: 0.01,
                    placeholder: "0.00"
                  }}
                  InputProps={{ 
                    startAdornment: '₺',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stok *"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleFormChange}
                  margin="normal"
                  inputProps={{ 
                    min: 0, 
                    step: 1,
                    placeholder: "0"
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Açıklama"
                  name="description"
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Özellikler (virgülle ayırın)"
                  name="features"
                  value={form.features}
                  onChange={handleFormChange}
                  margin="normal"
                  placeholder="Su geçirmez, Dayanıklı, Modern tasarım"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Ana Görsel *
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="main-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="main-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      disabled={loading}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {loading ? 'Yükleniyor...' : 'Ana Görsel Yükle'}
                    </Button>
                  </label>
                  
                  {form.image && (
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={form.image}
                        alt="Ana görsel"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
                        }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
                        ✓ Ana görsel yüklendi
                      </Typography>
                    </Box>
                  )}
                  
                  {!form.image && !selectedProduct && (
                    <Typography variant="caption" color="error" display="block">
                      Yeni ürün için ana görsel zorunludur
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={handleFormChange}
                      name="isActive"
                    />
                  }
                  label="Aktif"
                />
              </Grid>
            </Grid>
          )}

          {dialogTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ürün Resimleri
              </Typography>
              
              {/* Upload Multiple Images */}
              <Box sx={{ mb: 3 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="multi-image-upload"
                  type="file"
                  multiple
                  onChange={handleMultiImageUpload}
                />
                <label htmlFor="multi-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    disabled={loading}
                  >
                    Resimler Yükle
                  </Button>
                </label>
              </Box>

              {/* Image List */}
              {form.images.length > 0 && (
                <List>
                  {form.images.map((image, index) => (
                    <ListItem key={index} divider>
                      <img
                        src={image.url}
                        alt={`Ürün resmi ${index + 1}`}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4,
                          marginRight: 16
                        }}
                      />
                      <ListItemText
                        primary={`Resim ${index + 1}`}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {image.isPrimary && (
                              <Chip
                                icon={<StarIcon />}
                                label="Ana Resim"
                                size="small"
                                color="primary"
                              />
                            )}
                            <Chip
                              label={`Sıra: ${image.order}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveImage(index, 'up')}
                            disabled={index === 0}
                          >
                            ⬆️
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveImage(index, 'down')}
                            disabled={index === form.images.length - 1}
                          >
                            ⬇️
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSetPrimaryImage(index)}
                            color={image.isPrimary ? 'primary' : 'default'}
                          >
                            <StarIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

              {form.images.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Henüz resim eklenmedi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ürün için resimler yükleyin
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            İptal
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (selectedProduct ? 'Güncelle' : 'Ekle')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Ürünü Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={bulkImportOpen} onClose={() => setBulkImportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Toplu Ürün İçe Aktarma</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Bu özellik 100 adet örnek ürün oluşturup veritabanına ekler.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Ürünler gerçekçi verilerle (isim, açıklama, kategori, fiyat vs.) otomatik oluşturulacak.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            • 10 farklı kategoride ürünler<br/>
            • Türkiye markalarıyla<br/>
            • Gerçekçi resimlerle<br/>
            • Detaylı açıklamalarla
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkImportOpen(false)}>İptal</Button>
          <Button 
            onClick={handleGenerateAndImport} 
            variant="contained" 
            disabled={importLoading}
            startIcon={importLoading ? <CircularProgress size={20} /> : <ImportIcon />}
          >
            {importLoading ? 'İçe Aktarılıyor...' : '100 Ürün Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog open={statsDialogOpen} onClose={() => setStatsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ürün İstatistikleri</DialogTitle>
        <DialogContent>
          {productStats ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">{productStats.total}</Typography>
                  <Typography variant="body2">Toplam Ürün</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">{productStats.active}</Typography>
                  <Typography variant="body2">Aktif Ürün</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">{productStats.lowStock}</Typography>
                  <Typography variant="body2">Düşük Stok</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">{productStats.outOfStock}</Typography>
                  <Typography variant="body2">Stokta Yok</Typography>
                </Paper>
              </Grid>
              
              {productStats.categories && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Kategorilere Göre Dağılım</Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Kategori</TableCell>
                          <TableCell align="right">Ürün Sayısı</TableCell>
                          <TableCell align="right">Ortalama Fiyat</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productStats.categories.map((cat) => (
                          <TableRow key={cat._id}>
                            <TableCell>{cat._id}</TableCell>
                            <TableCell align="right">{cat.count}</TableCell>
                            <TableCell align="right">₺{cat.avgPrice?.toFixed(2) || '0.00'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>İstatistikler yükleniyor...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProducts; 