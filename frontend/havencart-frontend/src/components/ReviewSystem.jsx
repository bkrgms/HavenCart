import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Rating,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Report as ReportIcon,
  Send as SendIcon,
  FilterList as FilterIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';

const ReviewSystem = ({ 
  itemId, 
  itemType = 'product', // 'product' or 'book'
  averageRating = 0,
  totalReviews = 0 
}) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [reviewDialog, setReviewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: '',
  });

  const reviewsPerPage = 10;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token');

  useEffect(() => {
    loadReviews();
  }, [itemId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reviews, sortBy, filterRating]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Gerçek API'den yorumları yükle
      const response = await fetch(`http://localhost:5001/api/reviews/${itemType}/${itemId}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
        
        // İstatistikleri hesapla
        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsData.forEach(review => {
          stats[review.rating]++;
        });
        setReviewStats(stats);
      } else {
        // API'den veri gelmezse boş veri
        setReviews([]);
        setReviewStats({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      }
      
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Hata durumunda boş veri
      setReviews([]);
      setReviewStats({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      setSnackbar({ open: true, message: 'Yorumlar yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...reviews];

    // Rating filtresi
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
    setCurrentPage(1);
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
        itemId,
        itemType,
        userId: user.id || user._id,
        userName: user.name || 'Anonim Kullanıcı',
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        pros: reviewForm.pros,
        cons: reviewForm.cons
      };

      // Önce local state'e ekle (anında geri bildirim için)
      const newReview = {
        _id: Date.now().toString(),
        ...reviewData,
        userAvatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        notHelpful: 0,
        verified: false,
        images: [],
      };

      setReviews(prev => [newReview, ...prev]);
      
      // İstatistikleri güncelle
      setReviewStats(prev => ({
        ...prev,
        [reviewForm.rating]: prev[reviewForm.rating] + 1
      }));

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
      setReviewForm({ rating: 0, title: '', comment: '', pros: '', cons: '' });
      setSnackbar({ open: true, message: 'Yorumunuz eklendi', severity: 'success' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ open: true, message: 'Yorum eklenirken hata oluştu', severity: 'error' });
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    try {
      setReviews(prev => prev.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful,
          };
        }
        return review;
      }));
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>Yorumlar yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Review Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {getAverageRating()}
              </Typography>
              <Rating value={parseFloat(getAverageRating())} precision={0.1} readOnly size="large" />
              <Typography variant="body2" color="text.secondary">
                {reviews.length} değerlendirme
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Puan Dağılımı</Typography>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 20 }}>
                    {rating}
                  </Typography>
                  <StarIcon sx={{ color: 'gold', fontSize: 20, mx: 1 }} />
                  <LinearProgress
                    variant="determinate"
                    value={reviews.length > 0 ? (reviewStats[rating] / reviews.length) * 100 : 0}
                    sx={{ flexGrow: 1, mx: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {reviewStats[rating]}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Add Review */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sırala</InputLabel>
            <Select
              value={sortBy}
              label="Sırala"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">En Yeni</MenuItem>
              <MenuItem value="oldest">En Eski</MenuItem>
              <MenuItem value="rating-high">Yüksek Puan</MenuItem>
              <MenuItem value="rating-low">Düşük Puan</MenuItem>
              <MenuItem value="helpful">En Faydalı</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filtrele</InputLabel>
            <Select
              value={filterRating}
              label="Filtrele"
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <MenuItem value="all">Tüm Puanlar</MenuItem>
              <MenuItem value="5">5 Yıldız</MenuItem>
              <MenuItem value="4">4 Yıldız</MenuItem>
              <MenuItem value="3">3 Yıldız</MenuItem>
              <MenuItem value="2">2 Yıldız</MenuItem>
              <MenuItem value="1">1 Yıldız</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={() => setReviewDialog(true)}
          disabled={!isLoggedIn}
        >
          {isLoggedIn ? 'Yorum Yaz' : 'Yorum yazmak için giriş yapın'}
        </Button>
      </Box>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Alert severity="info">
          Henüz yorum yapılmamış. İlk yorumu siz yazın!
        </Alert>
      ) : (
        <Stack spacing={3}>
          {paginatedReviews.map((review) => (
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
                      <Chip 
                        icon={<VerifiedIcon />}
                        label="Doğrulanmış Alıcı" 
                        size="small" 
                        color="success" 
                      />
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

                  {(review.pros || review.cons) && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {review.pros && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            Artıları:
                          </Typography>
                          <Typography variant="body2">
                            {review.pros}
                          </Typography>
                        </Grid>
                      )}
                      {review.cons && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                            Eksileri:
                          </Typography>
                          <Typography variant="body2">
                            {review.cons}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleHelpful(review._id, true)}>
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {review.helpful}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleHelpful(review._id, false)}>
                        <ThumbDownIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {review.notHelpful}
                      </Typography>
                    </Box>
                    <IconButton size="small" color="error">
                      <ReportIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {itemType === 'book' ? 'Kitap Hakkında Yorum Yaz' : 'Ürün Hakkında Yorum Yaz'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography component="legend">Puanınız *</Typography>
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
              placeholder="Yorumunuzu özetleyen bir başlık yazın"
            />
            
            <TextField
              label="Yorumunuz *"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
              placeholder="Deneyiminizi detaylı olarak paylaşın..."
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Artıları (Opsiyonel)"
                  value={reviewForm.pros}
                  onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Beğendiğiniz özellikler..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Eksileri (Opsiyonel)"
                  value={reviewForm.cons}
                  onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="İyileştirilebilecek yönler..."
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>İptal</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Yorum Gönder
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
    </Box>
  );
};

export default ReviewSystem; 