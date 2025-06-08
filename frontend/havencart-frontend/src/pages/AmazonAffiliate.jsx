import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Rating,
  Chip,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Örnek ürün verileri
const sampleProducts = [
  {
    id: 1,
    name: 'Profesyonel Mutfak Robotu',
    description: 'Güçlü motor ve çoklu aksesuarlarla profesyonel mutfak işlemleri',
    image: 'https://via.placeholder.com/300x200',
    price: '2.499,99 TL',
    rating: 4.5,
    reviews: 128,
    category: 'Mutfak Aletleri',
    isPrime: true,
    discount: 15,
  },
  {
    id: 2,
    name: 'Paslanmaz Çelik Tencere Seti',
    description: '6 parçalı profesyonel tencere seti',
    image: 'https://via.placeholder.com/300x200',
    price: '1.899,99 TL',
    rating: 4.8,
    reviews: 256,
    category: 'Mutfak Gereçleri',
    isPrime: true,
    discount: 20,
  },
  {
    id: 3,
    name: 'Dijital Mutfak Terazisi',
    description: 'Hassas ölçüm için profesyonel terazi',
    image: 'https://via.placeholder.com/300x200',
    price: '299,99 TL',
    rating: 4.2,
    reviews: 89,
    category: 'Mutfak Aletleri',
    isPrime: false,
    discount: 0,
  },
  // Daha fazla ürün eklenebilir
];

const categories = [
  'Tümü',
  'Mutfak Aletleri',
  'Mutfak Gereçleri',
  'Pişirme Ekipmanları',
  'Saklama Kapları',
  'Mutfak Aksesuarları',
];

const AmazonAffiliate = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Amazon Ürün Önerileri
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Mutfağınızı geliştirmek için özenle seçilmiş ürünler. Bu ürünlere tıklayarak Amazon'da inceleyebilir ve satın alabilirsiniz.
        </Typography>

        {/* Arama ve Filtreler */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {categories.map((category) => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
        </Box>

        {/* Ürün Listesi */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {product.name}
                    </Typography>
                    <Button
                      onClick={() => toggleFavorite(product.id)}
                      color="primary"
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      {favorites.includes(product.id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </Button>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      value={product.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                      icon={<StarIcon fontSize="inherit" />}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.reviews})
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {product.isPrime && (
                      <Chip
                        label="Prime"
                        size="small"
                        color="secondary"
                      />
                    )}
                    {product.discount > 0 && (
                      <Chip
                        label={`%${product.discount} İndirim`}
                        size="small"
                        color="error"
                      />
                    )}
                  </Stack>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      href={`https://www.amazon.com.tr/s?k=${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      İncele
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Arama kriterlerinize uygun ürün bulunamadı.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AmazonAffiliate; 