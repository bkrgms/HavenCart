import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Card,
  CardMedia,
  TextField,
  Avatar,
  Rating,
  Tooltip,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Restaurant as RestaurantIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Send as SendIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/recipes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        // Fallback to sample data if API fails
        setRecipe(generateSampleRecipe(id));
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      setRecipe(generateSampleRecipe(id));
    } finally {
      setLoading(false);
    }
  };

  const generateSampleRecipe = (recipeId) => {
    return {
      _id: recipeId,
      name: 'Mercimek Çorbası',
      description: 'Geleneksel Türk mutfağının vazgeçilmez çorbası. Besleyici ve lezzetli mercimek çorbası tarifi.',
      category: 'Çorbalar',
      difficulty: 'Kolay',
      cookTime: '30 dk',
      prepTime: '15 dk',
      servings: 4,
      rating: 4.5,
      reviewCount: 127,
      image: 'https://source.unsplash.com/800x600/?mercimek,çorba,soup',
      ingredients: [
        { name: 'Kırmızı mercimek', amount: '1', unit: 'su bardağı' },
        { name: 'Soğan', amount: '1', unit: 'adet' },
        { name: 'Havuç', amount: '1', unit: 'adet' },
        { name: 'Patates', amount: '1', unit: 'adet' },
        { name: 'Domates salçası', amount: '1', unit: 'yemek kaşığı' },
        { name: 'Tereyağı', amount: '2', unit: 'yemek kaşığı' },
        { name: 'Su', amount: '5', unit: 'su bardağı' },
        { name: 'Tuz', amount: '1', unit: 'tatlı kaşığı' },
        { name: 'Karabiber', amount: '1', unit: 'çimdik' },
        { name: 'Limon', amount: '1/2', unit: 'adet' }
      ],
      instructions: [
        'Soğanı küçük küçük doğrayın ve tereyağında kavurun.',
        'Havuç ve patatesi küçük küpler halinde doğrayın.',
        'Soğanlar pembe renk aldığında havuç ve patatesi ekleyin.',
        'Domates salçasını ekleyip 2-3 dakika kavurun.',
        'Yıkanmış mercimekleri ekleyin ve karıştırın.',
        'Sıcak suyu ekleyip kaynamaya bırakın.',
        'Sebzeler yumuşayıncaya kadar 20-25 dakika pişirin.',
        'Blender ile çorbanın kıvamını ayarlayın.',
        'Tuz ve baharatları ekleyip 5 dakika daha pişirin.',
        'Servis ederken limon sıkın.'
      ],
      tips: [
        'Çorbanın kıvamını su miktarıyla ayarlayabilirsiniz.',
        'Üzerine tereyağı ve pul biber serpiştirerek servis edebilirsiniz.',
        'Çorbayı blenderde çekerken dikkatli olun, sıcak olabilir.',
        'Limon suyu çorbanın tadını daha da lezzetli yapar.'
      ]
    };
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">Yükleniyor...</Typography>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Tarif bulunamadı
          </Typography>
          <Typography variant="body1">
            Aradığınız tarif mevcut değil veya silinmiş olabilir.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = recipe.name;
    const text = recipe.description;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Tarif linki kopyalandı!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddComment = () => {
    if (newComment.trim() && rating > 0) {
      const comment = {
        id: Date.now(),
        user: {
          name: 'Mevcut Kullanıcı', // TODO: Gerçek kullanıcı bilgisi
          avatar: 'https://source.unsplash.com/random/100x100/?portrait',
        },
        rating,
        comment: newComment,
        date: new Date().toISOString().split('T')[0],
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setRating(0);
    }
  };

  const handlePrint = () => {
    const printContent = `
      <div style="padding: 20px;">
        <h1>${recipe.name}</h1>
        <p>${recipe.description}</p>
        
        <div style="margin: 20px 0;">
          <p><strong>Hazırlık Süresi:</strong> ${recipe.prepTime}</p>
          <p><strong>Pişirme Süresi:</strong> ${recipe.cookTime}</p>
          <p><strong>Porsiyon:</strong> ${recipe.servings} kişilik</p>
          <p><strong>Zorluk:</strong> ${recipe.difficulty}</p>
        </div>

        <h2>Malzemeler</h2>
        <ul>
          ${recipe.ingredients.map(ing => 
            `<li>${ing.name}: ${ing.amount} ${ing.unit}</li>`
          ).join('')}
        </ul>

        <h2>Hazırlanışı</h2>
        <ol>
          ${recipe.instructions.map(inst => 
            `<li>${inst}</li>`
          ).join('')}
        </ol>

        <h2>Püf Noktaları</h2>
        <ul>
          ${recipe.tips.map(tip => 
            `<li>${tip}</li>`
          ).join('')}
        </ul>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${recipe.name} - Tarif</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #1976d2; }
            h2 { color: #1976d2; margin-top: 20px; }
            ul, ol { padding-left: 20px; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportPdf = async () => {
    const element = document.getElementById('recipe-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${recipe.name.toLowerCase().replace(/\s+/g, '-')}-tarifi.pdf`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Başlık ve Paylaşım */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {recipe.name}
          </Typography>
          <Box>
            <Tooltip title="PDF olarak kaydet">
              <IconButton onClick={handleExportPdf} color="primary">
                <PdfIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Yazdır">
              <IconButton onClick={handlePrint} color="primary">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => handleShare('facebook')} color="primary">
              <FacebookIcon />
            </IconButton>
            <IconButton onClick={() => handleShare('twitter')} color="info">
              <TwitterIcon />
            </IconButton>
            <IconButton onClick={() => handleShare('whatsapp')} color="success">
              <WhatsAppIcon />
            </IconButton>
            <IconButton onClick={() => handleShare('copy')}>
              <ShareIcon />
            </IconButton>
            <IconButton onClick={toggleFavorite}>
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Görsel */}
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={recipe.image}
            alt={recipe.name}
          />
        </Card>

        {/* Açıklama */}
        <Typography variant="body1" paragraph>
          {recipe.description}
        </Typography>

        {/* Bilgi Kartları */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="subtitle2">Hazırlık</Typography>
              <Typography variant="body2">{recipe.prepTime}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="subtitle2">Pişirme</Typography>
              <Typography variant="body2">{recipe.cookTime}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <RestaurantIcon color="primary" />
              <Typography variant="subtitle2">Porsiyon</Typography>
              <Typography variant="body2">{recipe.servings} kişilik</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Zorluk</Typography>
              <Typography variant="body2">{recipe.difficulty}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Malzemeler */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Malzemeler
            </Typography>
            <List>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={ingredient.name}
                    secondary={`${ingredient.amount} ${ingredient.unit}`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Hazırlanışı */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Hazırlanışı
            </Typography>
            <List>
              {recipe.instructions.map((instruction, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1}. ${instruction}`}
                    />
                  </ListItem>
                  {index < recipe.instructions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            {/* Püf Noktaları */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Püf Noktaları
              </Typography>
              <List>
                {recipe.tips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>

        {/* Yorumlar Bölümü */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Yorumlar
          </Typography>

          {/* Yorum Ekleme Formu */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Puanınız:
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Tarif hakkında ne düşünüyorsunuz?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={!newComment.trim() || rating === 0}
            >
              Yorum Yap
            </Button>
          </Paper>

          {/* Yorum Listesi */}
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          sx={{ mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {comment.user.name}
                          </Typography>
                          <Rating value={comment.rating} readOnly size="small" />
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 'auto' }}
                        >
                          {comment.date}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mt: 1 }}
                      >
                        {comment.comment}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecipeDetail; 