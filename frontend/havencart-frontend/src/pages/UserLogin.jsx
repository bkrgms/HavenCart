import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Person as UserIcon,
  ArrowBack as BackIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', 'user');
        
        navigate('/home');
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt başarısız');
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', 'user');

      setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            p: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <UserIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Kullanıcı Paneli
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Alışverişe başlamak için giriş yapın veya kayıt olun
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab
              icon={<LoginIcon />}
              label="Giriş Yap"
              iconPosition="start"
              sx={{ textTransform: 'none', fontSize: '1rem' }}
            />
            <Tab
              icon={<RegisterIcon />}
              label="Kayıt Ol"
              iconPosition="start"
              sx={{ textTransform: 'none', fontSize: '1rem' }}
            />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {activeTab === 0 && (
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email Adresi"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                sx={{ mb: 3 }}
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="Şifre"
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                sx={{ mb: 4 }}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #3d8b3d 100%)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </Box>
          )}

          {activeTab === 1 && (
            <Box component="form" onSubmit={handleRegister}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ad Soyad"
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Adresi"
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Şifre"
                    name="password"
                    type="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                    helperText="En az 6 karakter"
                    disabled={loading}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #3d8b3d 100%)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Kayıt Ol'
                )}
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/')}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
              }}
            >
              Ana sayfaya dön
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserLogin; 