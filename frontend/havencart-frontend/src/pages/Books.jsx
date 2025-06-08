import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
  Badge,
  Rating,
  Pagination,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  MenuBook as BookIcon,
  Filter as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Kitap kategorileri
const bookCategories = [
  'Tümü',
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

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState('newest');
  const [userFavorites, setUserFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 16;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    loadBooks();
    if (isLoggedIn) {
      loadUserFavorites();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

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
          inStock: true,
          featured: true,
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
          inStock: true,
          featured: false,
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
          inStock: true,
          featured: true,
        },
        {
          _id: '4',
          title: 'Pastane Sanatı',
          author: 'Pastry Chef Elena',
          description: 'Profesyonel pastane teknikleri ve sırları. Adım adım fotoğraflarla.',
          image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=400',
          price: 95.90,
          originalPrice: 110.00,
          rating: 4.7,
          reviewCount: 124,
          category: 'Pastane & Tatlı',
          isbn: '978-1234567893',
          pages: 320,
          publisher: 'Pastry Yayınları',
          publishDate: '2023-02-20',
          inStock: true,
          featured: false,
        },
        {
          _id: '5',
          title: 'Çocuklar İçin Eğlenceli Yemekler',
          author: 'Aylin Anne',
          description: 'Çocukların sevebileceği sağlıklı ve renkli yemek tarifleri.',
          image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400',
          price: 55.90,
          originalPrice: 70.00,
          rating: 4.6,
          reviewCount: 67,
          category: 'Çocuk Yemekleri',
          isbn: '978-1234567894',
          pages: 180,
          publisher: 'Çocuk Yayınları',
          publishDate: '2023-04-15',
          inStock: true,
          featured: false,
        },
        {
          _id: '6',
          title: 'Vejeteryan Lezzetler',
          author: 'Green Chef Sarah',
          description: 'Et kullanmadan hazırladığınız nefis ve doyurucu yemekler.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
          price: 75.90,
          originalPrice: 90.00,
          rating: 4.4,
          reviewCount: 98,
          category: 'Vejeteryan',
          isbn: '978-1234567895',
          pages: 250,
          publisher: 'Yeşil Yayınları',
          publishDate: '2023-01-30',
          inStock: true,
          featured: true,
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

  const loadUserFavorites = async () => {
    try {
      const userId = user.id || user._id;
      if (!userId) return;

      const response = await fetch(`http://localhost:5001/api/user/book-favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        setUserFavorites(favorites.map(fav => fav._id));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleToggleFavorite = async (bookId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Favorilere eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = user.id || user._id;
    if (!userId) {
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
      return;
    }

    const isFavorite = userFavorites.includes(bookId);

    try {
      if (isFavorite) {
        const response = await fetch(`http://localhost:5001/api/user/book-favorites/${userId}/${bookId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setUserFavorites(prev => prev.filter(id => id !== bookId));
          setSnackbar({ open: true, message: 'Kitap favorilerden çıkarıldı', severity: 'info' });
        }
      } else {
        const response = await fetch('http://localhost:5001/api/user/book-favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, bookId })
        });
        if (response.ok) {
          setUserFavorites(prev => [...prev, bookId]);
          setSnackbar({ open: true, message: 'Kitap favorilere eklendi', severity: 'success' });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Sepete eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = user.id || user._id;
    if (!userId) {
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId, 
          productId: bookId, 
          quantity: 1,
          type: 'book'
        })
      });
      
      if (response.ok) {
        const book = books.find(b => b._id === bookId);
        setSnackbar({ 
          open: true, 
          message: `"${book?.title || 'Kitap'}" sepete eklendi`, 
          severity: 'success' 
        });
        
        // Refresh cart count in navbar
        if (window.refreshCartCount) {
          window.refreshCartCount();
        }
      } else {
        throw new Error('Failed to add to cart');
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: 'Sepete eklenirken hata oluştu', severity: 'error' });
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'Tümü' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishDate) - new Date(a.publishDate);
      case 'oldest':
        return new Date(a.publishDate) - new Date(b.publishDate);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <BookIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Yemek Kitapları
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Mutfağınızı geliştirmek için uzman şeflerden ve beslenme uzmanlarından özenle seçilmiş kitaplar
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Kitap veya yazar ara..."
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategory}
                label="Kategori"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {bookCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sırala</InputLabel>
              <Select
                value={sortBy}
                label="Sırala"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">En Yeni</MenuItem>
                <MenuItem value="oldest">En Eski</MenuItem>
                <MenuItem value="price-low">Fiyat (Düşük)</MenuItem>
                <MenuItem value="price-high">Fiyat (Yüksek)</MenuItem>
                <MenuItem value="rating">En Çok Beğenilen</MenuItem>
                <MenuItem value="title">Alfabetik</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {sortedBooks.length} kitap bulundu
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {selectedCategory !== 'Tümü' && (
            <Chip
              label={selectedCategory}
              onDelete={() => setSelectedCategory('Tümü')}
              color="primary"
              variant="outlined"
            />
          )}
          {searchTerm && (
            <Chip
              label={`"${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Books Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Kitaplar yükleniyor...</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedBooks.map((book) => (
              <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {book.featured && (
                    <Chip
                      label="Öne Çıkan"
                      color="secondary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={book.image}
                      alt={book.title}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/book/${book._id}`)}
                    />
                    <IconButton
                      onClick={() => handleToggleFavorite(book._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      {userFavorites.includes(book._id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={() => navigate(`/book/${book._id}`)}
                    >
                      {book.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {book.author}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={book.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({book.reviewCount})
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {book.description.length > 100 ? 
                        `${book.description.substring(0, 100)}...` : 
                        book.description
                      }
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
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
                        </Box>
                        <Chip label={book.category} size="small" variant="outlined" />
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(book._id)}
                          disabled={!book.inStock}
                          fullWidth
                        >
                          {book.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                        </Button>
                        <IconButton
                          onClick={() => navigate(`/book/${book._id}`)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

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

export default Books; 