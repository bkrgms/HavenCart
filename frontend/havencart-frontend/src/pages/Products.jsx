import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const initialFormState = {
  name: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  stock: '',
  image: '',
  images: [],
  features: '', // virgülle ayrılmış string
};

const categories = [
  'Ev Dekorasyon', 'Mutfak', 'Aydınlatma', 'Mobilya', 'Aksesuar', 'Diğer'
];

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(product);
    if (product) {
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
      });
    } else {
      setForm(initialFormState);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setForm(initialFormState);
    setFormErrors({});
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = 'Ürün adı zorunlu';
    if (!form.category) errors.category = 'Kategori zorunlu';
    if (!form.price) errors.price = 'Fiyat zorunlu';
    if (!form.stock) errors.stock = 'Stok zorunlu';
    if (!form.image) errors.image = 'Ana görsel zorunlu';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      alert('Resim yüklenirken hata oluştu!');
    }
    setUploading(false);
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) return;
    const product = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      image: form.image,
      images: form.images,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    };
    let newProduct;
    if (selectedProduct && selectedProduct._id) {
      // Güncelleme
      const res = await fetch(`http://localhost:5001/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      newProduct = await res.json();
      setProducts(products.map(p => p._id === newProduct._id ? newProduct : p));
    } else {
      // Ekleme
      const res = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      newProduct = await res.json();
      setProducts([...products, newProduct]);
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ürünler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 2 }}
        >
          Yeni Ürün Ekle
        </Button>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => handleOpenDialog(product)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {product.price} TL
                    </Typography>
                    <Chip label={product.category} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Marka: {product.brand || '-'} | Stok: {product.stock}
                  </Typography>
                  {product.features && product.features.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">Özellikler: {product.features.join(', ')}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Ürün Ekle/Düzenle Dialogu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ürün Adı"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kategori"
                name="category"
                value={form.category}
                onChange={handleFormChange}
                select
                error={!!formErrors.category}
                helperText={formErrors.category}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fiyat"
                name="price"
                value={form.price}
                onChange={handleFormChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marka"
                name="brand"
                value={form.brand}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stok"
                name="stock"
                value={form.stock}
                onChange={handleFormChange}
                error={!!formErrors.stock}
                helperText={formErrors.stock}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={20} /> : 'Ana Görsel Yükle'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {form.image && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={form.image} alt="Ürün görseli" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
                </Box>
              )}
              {formErrors.image && <Typography color="error">{formErrors.image}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Özellikler"
                name="features"
                value={form.features}
                onChange={handleFormChange}
                multiline
                rows={2}
                helperText="Özellikleri virgülle ayırın (ör: Renk: Beyaz, Boyut: 30x40cm)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button variant="contained" onClick={handleSaveProduct} disabled={uploading}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products; 