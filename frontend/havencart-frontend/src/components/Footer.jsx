import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import SocialMedia from './SocialMedia';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              HavenCart
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Online alışverişin en güvenilir adresi. Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Hızlı Bağlantılar
            </Typography>
            <Link href="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              Ürünler
            </Link>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              Hakkımızda
            </Link>
            <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              İletişim
            </Link>
            <Link href="/faq" color="inherit" display="block" sx={{ mb: 1 }}>
              Sıkça Sorulan Sorular
            </Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              İletişim
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Adres: Örnek Mahallesi, Örnek Sokak No:123
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              İstanbul, Türkiye
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Telefon: +90 (212) 123 45 67
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              E-posta: info@havencart.com
            </Typography>
          </Grid>
        </Grid>

        <SocialMedia />

        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Copyright */}
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} HavenCart. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 