import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  ContactMail as ContactIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  ShoppingCart as CartIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const adminData = JSON.parse(localStorage.getItem('user') || '{}');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      title: 'Ürünler',
      icon: <ProductsIcon />,
      path: '/admin/products',
    },
    {
      title: 'Kitaplar',
      icon: <BookIcon />,
      path: '/admin/books',
    },
    {
      title: 'Kullanıcılar',
      icon: <UsersIcon />,
      path: '/admin/users',
    },
    {
      title: 'Analitik',
      icon: <AnalyticsIcon />,
      path: '/admin/analytics',
    },
    {
      title: 'İletişim',
      icon: <ContactIcon />,
      path: '/admin/contacts',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: 3,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CartIcon sx={{ fontSize: 32, mr: 1 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            HavenCart Admin
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        {/* Right Side - Notifications, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <IconButton sx={{ color: 'white' }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
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
              {adminData.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
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
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {adminData.name || 'Admin'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {adminData.email || 'admin@havencart.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/admin/profile'); handleMenuClose(); }}>
              <AccountIcon sx={{ mr: 2 }} />
              Profil
            </MenuItem>
            <MenuItem onClick={() => { navigate('/admin/settings'); handleMenuClose(); }}>
              <SettingsIcon sx={{ mr: 2 }} />
              Ayarlar
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 2 }} />
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar; 