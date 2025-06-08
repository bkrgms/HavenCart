import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  ContactMail as ContactMailIcon,
  ShoppingBag as ShoppingBagIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Inventory as ProductsIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Check if user is logged in and get user data
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!token;

  // Better user ID handling
  const getUserId = () => {
    if (!userData) return null;
    return userData.id || userData._id || null;
  };

  useEffect(() => {
    if (isLoggedIn && getUserId()) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn, location.pathname]); // Add location.pathname to refresh cart count on page changes

  const loadCartCount = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found. User object:', userData);
        setCartCount(0);
        return;
      }
      
      console.log('Loading cart count for user ID:', userId);
      const response = await fetch(`http://localhost:5001/api/user/cart/${userId}`);
      if (response.ok) {
        const cartItems = await response.json();
        const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalCount);
      } else {
        console.error('Failed to load cart. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  // Function to refresh cart count (can be called after adding items to cart)
  const refreshCartCount = () => {
    if (isLoggedIn && getUserId()) {
      loadCartCount();
    }
  };

  // Expose refreshCartCount globally for other components to use
  useEffect(() => {
    window.refreshCartCount = refreshCartCount;
    return () => {
      delete window.refreshCartCount;
    };
  }, [isLoggedIn]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setCartCount(0); // Reset cart count on logout
    handleClose();
    navigate('/');
  };

  const navItems = [
    {
      title: 'Ana Sayfa',
      icon: <HomeIcon />,
      path: '/home',
    },
    {
      title: 'Ürünler',
      icon: <ProductsIcon />,
      path: '/products',
    },
    {
      title: 'İletişim',
      icon: <ContactMailIcon />,
      path: '/contact',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            cursor: 'pointer',
            background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          onClick={() => navigate('/')}
        >
          HavenCart
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'white',
                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Cart Icon */}
          <IconButton
            sx={{ color: 'white' }}
            onClick={() => navigate('/cart')}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Favorites Icon (only for logged in users) */}
          {isLoggedIn && (
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => navigate('/favorites')}
            >
              <FavoriteIcon />
            </IconButton>
          )}

          {/* User Profile or Login */}
          {isLoggedIn ? (
            <>
              <IconButton
                onClick={handleMenu}
                sx={{ color: 'white' }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1rem',
                  }}
                >
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <AccountIcon sx={{ mr: 2 }} />
                  Profilim
                </MenuItem>
                <MenuItem onClick={() => { navigate('/orders'); handleClose(); }}>
                  <ShoppingBagIcon sx={{ mr: 2 }} />
                  Siparişlerim
                </MenuItem>
                <MenuItem onClick={() => { navigate('/favorites'); handleClose(); }}>
                  <FavoriteIcon sx={{ mr: 2 }} />
                  Favorilerim
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                  <SettingsIcon sx={{ mr: 2 }} />
                  Ayarlar
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  Çıkış Yap
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/user/login')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Giriş
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                Kayıt
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 