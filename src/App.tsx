import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  
                  {/* Public Routes */}
                  <Route path="/*" element={
                    <>
                      <Header />
                      <main>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/product/:id" element={<ProductDetailPage />} />
                          <Route path="/category/:slug" element={<CategoryPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/order-success" element={<OrderSuccessPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/orders" element={<OrdersPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  } />
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;