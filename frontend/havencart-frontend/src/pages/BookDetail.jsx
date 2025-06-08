import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardMedia,
  Chip,
  Divider,
  Rating,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Star as StarIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Report as ReportIcon,
  MenuBook as BookIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  Business as PublisherIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
  });
  const [reviewDialog, setReviewDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    loadBookDetail();
    loadReviews();
    if (isLoggedIn) {
      checkIfFavorite();
    }
  }, [id, isLoggedIn]);

  const loadBookDetail = async () => {
    try {
      // Örnek kitap detayı - gerçek API'den gelecek
      const sampleBook = {
        _id: id,
        title: 'Türk Mutfağının İncileri',
        author: 'Ayşe Teyze',
        description: `Bu kitap, Türk mutfağının zengin mirasını modern mutfağa taşıyan kapsamlı bir rehberdir. 
        Geleneksel Türk yemeklerinin sırlarını öğrenmek isteyenler için hazırlanmış olan bu eser, 
        200 özgün tarif ile mutfağınızı Anadolu lezzetleriyle buluşturacak.

        Kitapta yer alan her tarif, adım adım fotoğraflarla desteklenmiş ve kolay anlaşılır şekilde yazılmıştır. 
        Başlangıç seviyesindeki aşçılardan profesyonellere kadar herkesin faydalanabileceği bu kapsamlı rehber, 
        Türk mutfağının vazgeçilmez lezzetlerini evinizde yapmanızı sağlayacak.

        ÖNE ÇIKAN ÖZELLİKLER:
        • 200 geleneksel Türk yemeği tarifi
        • Adım adım fotoğraflı anlatım
        • Bölgesel mutfak kültürleri hakkında bilgiler
        • Malzeme alternatifleri ve püf noktaları
        • Beslenme değerleri ve kalori bilgileri`,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
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
        inStock: true,
        stockCount: 45,
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
      };
      setBook(sampleBook);
    } catch (error) {
      console.error('Error loading book:', error);
      setSnackbar({ open: true, message: 'Kitap yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      // Gerçek API'den yorumları yükle
      const response = await fetch(`http://localhost:5001/api/reviews/book/${id}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      } else {
        // Veri yoksa boş array
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Hata durumunda boş array
      setReviews([]);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const userId = user.id || user._id;
      if (!userId) return;

      const response = await fetch(`http://localhost:5001/api/user/book-favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        setIsFavorite(favorites.some(fav => fav._id === id));
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Favorilere eklemek için giriş yapın', severity: 'warning' });
      return;
    }

    const userId = user.id || user._id;
    if (!userId) {
      setSnackbar({ open: true, message: 'Kullanıcı bilgisi bulunamadı', severity: 'error' });
      return;
    }

    try {
      if (isFavorite) {
        const response = await fetch(`http://localhost:5001/api/user/book-favorites/${userId}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setIsFavorite(false);
          setSnackbar({ open: true, message: 'Kitap favorilerden çıkarıldı', severity: 'info' });
        }
      } else {
        const response = await fetch('http://localhost:5001/api/user/book-favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, bookId: id })
        });
        if (response.ok) {
          setIsFavorite(true);
          setSnackbar({ open: true, message: 'Kitap favorilere eklendi', severity: 'success' });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbar({ open: true, message: 'Bir hata oluştu', severity: 'error' });
    }
  };

  const handleAddToCart = async () => {
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
      if (!book) {
        setSnackbar({ open: true, message: 'Kitap bilgisi bulunamadı', severity: 'error' });
        return;
      }

      // Local storage'dan mevcut sepeti al
      const cartKey = `cart_${userId}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      
      // Aynı kitap zaten sepette var mı kontrol et
      const existingItemIndex = existingCart.findIndex(item => 
        item.productId === id && item.type === 'book'
      );

      if (existingItemIndex > -1) {
        // Varsa adeti artır
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Yoksa yeni item ekle
        existingCart.push({
          productId: id,
          quantity: quantity,
          type: 'book',
          title: book.title,
          price: book.price,
          image: book.image,
          author: book.author,
          addedAt: new Date().toISOString()
        });
      }

      // Sepeti local storage'a kaydet
      localStorage.setItem(cartKey, JSON.stringify(existingCart));
      
      // Sepet sayısını güncelle
      if (window.refreshCartCount) {
        window.refreshCartCount();
      }

      setSnackbar({ 
        open: true, 
        message: `"${book.title}" sepete eklendi`, 
        severity: 'success' 
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: 'Sepete eklenirken hata oluştu', severity: 'error' });
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      setSnackbar({ open: true, message: 'Yorum yazmak için giriş yapın', severity: 'warning' });
      return;
    }

    if (reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      setSnackbar({ open: true, message: 'Lütfen puanınızı ve yorumunuzu yazın', severity: 'warning' });
      return;
    }

    try {
      const reviewData = {
        itemId: id,
        itemType: 'book',
        userId: user.id || user._id,
        userName: user.name || 'Anonim Kullanıcı',
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      };

      // Önce local state'e ekle (immediate feedback için)
      const newReview = {
        _id: Date.now().toString(),
        ...reviewData,
        userAvatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: false,
      };

      setReviews(prev => [newReview, ...prev]);

      // API'ye gönder (gerçek proje için)
      try {
        const response = await fetch('http://localhost:5001/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        
        if (!response.ok) {
          console.warn('Review API kaydetme başarısız, sadece local state güncellendi');
        }
      } catch (apiError) {
        console.warn('Review API bağlantı hatası, sadece local state güncellendi:', apiError);
      }

      setReviewDialog(false);
      setReviewForm({ rating: 0, title: '', comment: '' });
      setSnackbar({ open: true, message: 'Yorumunuz eklendi', severity: 'success' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ open: true, message: 'Yorum eklenirken hata oluştu', severity: 'error' });
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Kitap yükleniyor...</Typography>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Kitap bulunamadı</Alert>
      </Container>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sol Taraf - Kitap Resmi ve Temel Bilgiler */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              image={book.image}
              alt={book.title}
              sx={{ height: 500, objectFit: 'cover' }}
            />
          </Card>

          {/* Kitap Bilgileri */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Kitap Bilgileri</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">ISBN:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{book.isbn}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Sayfa Sayısı:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{book.pages}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Yayınevi:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{book.publisher}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Dil:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{book.language}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Boyutlar:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{book.dimensions}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Ağırlık:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{book.weight}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Sağ Taraf - Kitap Detayları */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {book.author}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={parseFloat(getAverageRating())} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {getAverageRating()} ({reviews.length} yorum)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip label={book.category} color="primary" />
              {book.featured && <Chip label="Öne Çıkan" color="secondary" />}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ₺{book.price.toFixed(2)}
              </Typography>
              {book.originalPrice > book.price && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ₺{book.originalPrice.toFixed(2)}
                </Typography>
              )}
              {book.originalPrice > book.price && (
                <Chip
                  label={`%${Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)} İndirim`}
                  color="error"
                  size="small"
                />
              )}
            </Box>

            {/* Satın Alma Alanı */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                  type="number"
                  label="Adet"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: book.stockCount }}
                  sx={{ width: 100 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Stokta {book.stockCount} adet
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  fullWidth
                >
                  Sepete Ekle
                </Button>
                <IconButton
                  onClick={handleToggleFavorite}
                  color={isFavorite ? 'error' : 'default'}
                  size="large"
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Stack>

              {!book.inStock && (
                <Alert severity="warning">Bu kitap şu anda stokta bulunmamaktadır.</Alert>
              )}
            </Paper>

            {/* Etiketler */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Etiketler:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {book.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Açıklama" />
              <Tab label="İçindekiler" />
              <Tab label={`Yorumlar (${reviews.length})`} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                {book.description}
              </Typography>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>İçindekiler</Typography>
              <List>
                {book.tableOfContents.map((chapter, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={chapter}
                      secondary={`Sayfa ${(index + 1) * 42}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              {/* Yorum İstatistikleri */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {getAverageRating()}
                      </Typography>
                      <Rating value={parseFloat(getAverageRating())} precision={0.1} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {reviews.length} değerlendirme
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Paper sx={{ p: 3 }}>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ minWidth: 20 }}>
                            {rating}
                          </Typography>
                          <StarIcon sx={{ color: 'gold', fontSize: 20, mx: 1 }} />
                          <LinearProgress
                            variant="determinate"
                            value={reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}
                            sx={{ flexGrow: 1, mx: 1 }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 30 }}>
                            {ratingDistribution[rating]}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Yorum Yazma Butonu */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setReviewDialog(true)}
                  disabled={!isLoggedIn}
                >
                  {isLoggedIn ? 'Yorum Yaz' : 'Yorum yazmak için giriş yapın'}
                </Button>
              </Box>

              {/* Yorumlar Listesi */}
              <Stack spacing={3}>
                {reviews.map((review) => (
                  <Paper key={review._id} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar src={review.userAvatar} sx={{ mr: 2 }}>
                        {review.userName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {review.userName}
                          </Typography>
                          {review.verified && (
                            <Chip label="Doğrulanmış Alıcı" size="small" color="success" />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {review.date}
                          </Typography>
                        </Box>
                        {review.title && (
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {review.title}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {review.comment}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small">
                            <ThumbUpIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">
                            {review.helpful}
                          </Typography>
                          <IconButton size="small">
                            <ReportIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Yorum Yazma Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Kitap Hakkında Yorum Yaz</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography component="legend">Puanınız</Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(event, newValue) => {
                  setReviewForm({ ...reviewForm, rating: newValue });
                }}
                size="large"
              />
            </Box>
            <TextField
              label="Başlık (Opsiyonel)"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Yorumunuz"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>İptal</Button>
          <Button onClick={handleSubmitReview} variant="contained">Yorum Gönder</Button>
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

export default BookDetail; 