import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  Pagination,
  InputAdornment,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MenuBook as BookIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const bookCategories = [
  'Yemek Tarifleri',
  'Mutfak Sanatı',
  'Beslenme',
  'Diyet & Sağlık',
  'Dünya Mutfakları',
  'Pastane & Tatlı',
  'Vejeteryan',
  'Çocuk Yemekleri',
  'Profesyonel Aşçılık'
];

const AdminBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    isbn: '',
    pages: '',
    publisher: '',
    publishDate: '',
    language: 'Türkçe',
    dimensions: '',
    weight: '',
    stockCount: '',
    featured: false,
    inStock: true,
    tags: '',
    tableOfContents: '',
    image: '',
  });

  const booksPerPage = 10;

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      // Örnek kitap verileri - gerçek API'den gelecek
      const sampleBooks = [
        {
          _id: '1',
          title: 'Türk Mutfağının İncileri',
          author: 'Ayşe Teyze',
          description: 'Geleneksel Türk yemeklerinin sırrını öğrenin. 200 özgün tarif ile.',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
          price: 89.90,
          originalPrice: 120.00,
          rating: 4.8,
          reviewCount: 156,
          category: 'Yemek Tarifleri',
          isbn: '978-1234567890',
          pages: 350,
          publisher: 'Yemek Yayınları',
          publishDate: '2023-01-15',
          language: 'Türkçe',
          dimensions: '20 x 25 cm',
          weight: '850g',
          stockCount: 45,
          inStock: true,
          featured: true,
          tags: ['Türk Mutfağı', 'Geleneksel', 'Tarif', 'Anadolu', 'Yemek'],
          tableOfContents: [
            'Giriş - Türk Mutfağının Tarihi',
            'Bölüm 1: Çorbalar',
            'Bölüm 2: Et Yemekleri', 
            'Bölüm 3: Sebze Yemekleri',
            'Bölüm 4: Pilavlar ve Makarnalar',
            'Bölüm 5: Tatlılar',
            'Bölüm 6: İçecekler',
            'Ekler: Malzeme Sözlüğü'
          ]
        },
        {
          _id: '2',
          title: 'Sağlıklı Beslenme Rehberi',
          author: 'Dr. Mehmet Öz',
          description: 'Bilimsel yaklaşımla sağlıklı beslenmenin temel prensipleri.',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
          price: 65.90,
          originalPrice: 85.00,
          rating: 4.5,
          reviewCount: 89,
          category: 'Beslenme',
          isbn: '978-1234567891',
          pages: 280,
          publisher: 'Sağlık Yayınları',
          publishDate: '2023-03-10',
          language: 'Türkçe',
          dimensions: '16 x 24 cm',
          weight: '650g',
          stockCount: 32,
          inStock: true,
          featured: false,
          tags: ['Beslenme', 'Sağlık', 'Diyet'],
          tableOfContents: [
            'Beslenmenin Temelleri',
            'Makro Besinler',
            'Mikro Besinler',
            'Diyet Planları'
          ]
        },
        {
          _id: '3',
          title: 'Dünya Mutfakları Atlası',
          author: 'Chef Marco',
          description: 'Dünyanın dört bir yanından lezzetli tarifler ve kültürel hikayeler.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          price: 129.90,
          originalPrice: 150.00,
          rating: 4.9,
          reviewCount: 203,
          category: 'Dünya Mutfakları',
          isbn: '978-1234567892',
          pages: 450,
          publisher: 'Global Yayınları',
          publishDate: '2022-12-05',
          language: 'Türkçe',
          dimensions: '25 x 30 cm',
          weight: '1200g',
          stockCount: 18,
          inStock: true,
          featured: true,
          tags: ['Dünya Mutfağı', 'Kültür', 'Tarif'],
          tableOfContents: [
            'Avrupa Mutfakları',
            'Asya Mutfakları',
            'Amerika Mutfakları',
            'Afrika Mutfakları'
          ]
        }
      ];
      setBooks(sampleBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      setSnackbar({ open: true, message: 'Kitaplar yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        price: book.price.toString(),
        originalPrice: book.originalPrice.toString(),
        isbn: book.isbn,
        pages: book.pages.toString(),
        publisher: book.publisher,
        publishDate: book.publishDate,
        language: book.language,
        dimensions: book.dimensions,
        weight: book.weight,
        stockCount: book.stockCount.toString(),
        featured: book.featured,
        inStock: book.inStock,
        tags: book.tags.join(', '),
        tableOfContents: book.tableOfContents.join('\n'),
        image: book.image,
      });
      setSelectedBook(book);
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        category: '',
        price: '',
        originalPrice: '',
        isbn: '',
        pages: '',
        publisher: '',
        publishDate: '',
        language: 'Türkçe',
        dimensions: '',
        weight: '',
        stockCount: '',
        featured: false,
        inStock: true,
        tags: '',
        tableOfContents: '',
        image: '',
      });
      setSelectedBook(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.author || !formData.category || !formData.price) {
        setSnackbar({ open: true, message: 'Lütfen zorunlu alanları doldurun', severity: 'warning' });
        return;
      }

      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        pages: parseInt(formData.pages),
        stockCount: parseInt(formData.stockCount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        tableOfContents: formData.tableOfContents.split('\n').map(line => line.trim()).filter(line => line),
        _id: selectedBook ? selectedBook._id : Date.now().toString(),
        rating: selectedBook ? selectedBook.rating : 0,
        reviewCount: selectedBook ? selectedBook.reviewCount : 0,
      };

      if (selectedBook) {
        // Güncelleme
        setBooks(prev => prev.map(book => 
          book._id === selectedBook._id ? bookData : book
        ));
        setSnackbar({ open: true, message: 'Kitap başarıyla güncellendi', severity: 'success' });
      } else {
        // Yeni ekleme
        setBooks(prev => [bookData, ...prev]);
        setSnackbar({ open: true, message: 'Kitap başarıyla eklendi', severity: 'success' });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving book:', error);
      setSnackbar({ open: true, message: 'Kitap kaydedilirken hata oluştu', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      setBooks(prev => prev.filter(book => book._id !== selectedBook._id));
      setSnackbar({ open: true, message: 'Kitap başarıyla silindi', severity: 'success' });
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      setSnackbar({ open: true, message: 'Kitap silinirken hata oluştu', severity: 'error' });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Kitap Yönetimi
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Yemek kitaplarını yönetin ve düzenleyin
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Kitap Ekle
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {books.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Kitap
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {books.filter(book => book.featured).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Öne Çıkan
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: 'success.main', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    ₺
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {books.reduce((sum, book) => sum + (book.price * book.stockCount), 0).toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Değer
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: 'info.main', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    #
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {books.reduce((sum, book) => sum + book.stockCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Stok
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Kitap adı, yazar veya ISBN ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategory}
                label="Kategori"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Tümü</MenuItem>
                {bookCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              {filteredBooks.length} kitap bulundu
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Books Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kitap</TableCell>
              <TableCell>Yazar</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={book.image}
                      variant="rounded"
                      sx={{ width: 60, height: 80, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ISBN: {book.isbn}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.pages} sayfa
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{book.author}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.publisher}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={book.category} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ₺{book.price.toFixed(2)}
                  </Typography>
                  {book.originalPrice > book.price && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      ₺{book.originalPrice.toFixed(2)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {book.stockCount} adet
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                      label={book.inStock ? 'Stokta' : 'Stok Yok'}
                      color={book.inStock ? 'success' : 'error'}
                      size="small"
                    />
                    {book.featured && (
                      <Chip
                        label="Öne Çıkan"
                        color="secondary"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/book/${book._id}`)}
                      color="info"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(book)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedBook(book);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kitap Adı"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yazar"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Kategori"
                  onChange={handleInputChange}
                >
                  {bookCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resim URL"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Fiyat (₺)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Orijinal Fiyat (₺)"
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stok Adedi"
                name="stockCount"
                type="number"
                value={formData.stockCount}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sayfa Sayısı"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yayınevi"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yayın Tarihi"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Dil</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  label="Dil"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Türkçe">Türkçe</MenuItem>
                  <MenuItem value="İngilizce">İngilizce</MenuItem>
                  <MenuItem value="Almanca">Almanca</MenuItem>
                  <MenuItem value="Fransızca">Fransızca</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Boyutlar"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="20 x 25 cm"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ağırlık"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="850g"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Etiketler (virgülle ayırın)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Türk Mutfağı, Geleneksel, Tarif"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="İçindekiler (her satırda bir bölüm)"
                name="tableOfContents"
                value={formData.tableOfContents}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Giriş - Türk Mutfağının Tarihi&#10;Bölüm 1: Çorbalar&#10;Bölüm 2: Et Yemekleri"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={handleInputChange}
                      name="featured"
                    />
                  }
                  label="Öne Çıkan"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      name="inStock"
                    />
                  }
                  label="Stokta"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            İptal
          </Button>
          <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
            {selectedBook ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Kitap Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedBook?.title}" adlı kitabı silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminBooks; 