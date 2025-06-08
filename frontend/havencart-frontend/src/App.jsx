import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MenuProvider } from './pages/Menu';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import RecipeDetail from './pages/RecipeDetail';
import AmazonAffiliate from './pages/AmazonAffiliate';

// User Pages
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';

// Auth Pages
import LoginSelect from './pages/LoginSelect';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminRevenue from './pages/AdminRevenue';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminContacts from './pages/AdminContacts';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';

// Layout
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Auth Routes - No Navbar/Footer for clean login experience */}
          <Route path="/" element={<LoginSelect />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          
          {/* Admin Routes - With AdminNavbar */}
          <Route path="/admin/dashboard" element={
            <>
              <AdminNavbar />
              <AdminDashboard />
            </>
          } />
          <Route path="/admin/products" element={
            <>
              <AdminNavbar />
              <AdminProducts />
            </>
          } />
          <Route path="/admin/users" element={
            <>
              <AdminNavbar />
              <AdminUsers />
            </>
          } />
          <Route path="/admin/orders" element={
            <>
              <AdminNavbar />
              <AdminOrders />
            </>
          } />
          <Route path="/admin/revenue" element={
            <>
              <AdminNavbar />
              <AdminRevenue />
            </>
          } />
          <Route path="/admin/analytics" element={
            <>
              <AdminNavbar />
              <AdminAnalytics />
            </>
          } />
          <Route path="/admin/contacts" element={
            <>
              <AdminNavbar />
              <AdminContacts />
            </>
          } />
          <Route path="/admin/profile" element={
            <>
              <AdminNavbar />
              <AdminProfile />
            </>
          } />
          <Route path="/admin/settings" element={
            <>
              <AdminNavbar />
              <AdminSettings />
            </>
          } />
          
          {/* Main User App Routes - With Navbar/Footer */}
          <Route path="/home" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/products" element={
            <>
              <Navbar />
              <MenuProvider>
                <Menu />
              </MenuProvider>
              <Footer />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <ProductDetail />
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
          } />
          <Route path="/orders" element={
            <>
              <Navbar />
              <Orders />
              <Footer />
            </>
          } />
          <Route path="/settings" element={
            <>
              <Navbar />
              <Settings />
              <Footer />
            </>
          } />
          <Route path="/favorites" element={
            <>
              <Navbar />
              <Favorites />
              <Footer />
            </>
          } />
          
          {/* Legacy Routes for compatibility */}
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          } />
          <Route path="/register" element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          } />
          <Route path="/menu" element={
            <>
              <Navbar />
              <MenuProvider>
                <Menu />
              </MenuProvider>
              <Footer />
            </>
          } />
          <Route path="/recipe/:id" element={
            <>
              <Navbar />
              <MenuProvider>
                <RecipeDetail />
              </MenuProvider>
              <Footer />
            </>
          } />
          <Route path="/amazon" element={
            <>
              <Navbar />
              <AmazonAffiliate />
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 