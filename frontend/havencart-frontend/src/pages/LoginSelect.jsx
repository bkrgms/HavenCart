import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginSelect = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            p: 6,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CartIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                HavenCart
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 300 }}
            >
              Alışverişin yeni adresi burada başlıyor!
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                    border: '2px solid #2196F3',
                  },
                }}
                onClick={() => navigate('/admin/login')}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                  }}
                >
                  <AdminIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Yönetici Girişi
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                    Sistem yönetimi ve ürün kontrolü
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={5}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                    border: '2px solid #4CAF50',
                  },
                }}
                onClick={() => navigate('/user/login')}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    borderRadius: 3,
                  }}
                >
                  <UserIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Kullanıcı Girişi
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                    Alışverişe başla ve keşfet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginSelect; 