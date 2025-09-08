import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart, User, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useSupabase';
import { useCurrency } from '../context/CurrencyContext';
import SearchBar from './SearchBar';

const Header = () => {
  const { currencySymbol } = useCurrency();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { state } = useCart();
  const { state: wishlistState } = useWishlist();
  const { user, signOut, signIn, signUp } = useAuth();
  const location = useLocation();
  const { categories } = useCategories();

  const isActive = (path: string) => location.pathname === path;

  // Организиране на категориите в йерархична структура
  const organizeCategories = () => {
    const mainCategories = categories.filter(cat => !cat.parent_id && cat.is_visible)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    return mainCategories.map(mainCat => ({
      ...mainCat,
      children: categories.filter(cat => cat.parent_id === mainCat.id && cat.is_visible)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }));
  };

  const navigationStructure = organizeCategories();

  const handleMouseEnter = (categoryId: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay to allow moving to dropdown
    setHoverTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowAuthModal(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-gray-600 border-b">
          <div className="hidden md:block">
            Безплатна доставка при поръчки над 100 лв. (51.13 €)
          </div>
          <div className="flex items-center space-x-4">
            <span>📞 0888 839 366</span>
            <span>✉️ info@zoobutik-iv.bg</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ЗООБУТИК ИВ</h1>
              <p className="text-xs text-gray-500">Всичко за вашия любимец</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                  <User className="w-5 h-5" />
                  <span>{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Моят профил
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Моите поръчки
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Изход
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Вход</span>
              </button>
            )}
            
            <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
              {wishlistState.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistState.itemCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-500 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar className="w-full" />
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block pb-4`}>
          <ul className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            {/* Dynamic navigation from database */}
            {navigationStructure.map((category) => (
              <li key={category.id} className="relative">
                {category.children.length > 0 ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={`/category/${category.slug}`}
                      className={`flex items-center py-2 px-3 font-medium transition-colors rounded-lg ${
                        isActive(`/category/${category.slug}`) ? 'text-blue-500 bg-blue-50' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50'
                      }`}
                    >
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name}
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                        activeDropdown === category.id ? 'rotate-180' : ''
                      }`} />
                    </Link>
                    
                    {/* Dropdown menu */}
                    {activeDropdown === category.id && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        {category.children.map((subCategory) => (
                          <Link
                            key={subCategory.id}
                            to={`/category/${subCategory.slug}`}
                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {subCategory.icon && <span className="mr-2">{subCategory.icon}</span>}
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    to={category.external_url || `/category/${category.slug}`}
                    className={`flex items-center py-2 px-3 font-medium transition-colors rounded-lg ${
                      isActive(`/category/${category.slug}`) ? 'text-blue-500 bg-blue-50' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50'
                    }`}
                    {...(category.external_url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    {category.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
          signIn={signIn}
          signUp={signUp}
        />
      )}
    </header>
  );
};

// Auth Modal Component
const AuthModal = ({ 
  mode, 
  onClose, 
  onSwitchMode,
  signIn,
  signUp
}: { 
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError('Невалиден имейл или парола');
        } else {
          onClose();
        }
      } else {
        const userData = {
          first_name: firstName,
          last_name: lastName,
          phone,
          address,
          city,
          postal_code: postalCode
        };
        
        const { error } = await signUp(email, password, userData);
        if (error) {
          setError('Грешка при регистрацията');
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('Възникна грешка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {mode === 'login' ? 'Вход в профила' : 'Създаване на профил'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Влезте в профила си за по-бързо пазаруване' 
              : 'Създайте профил за персонализирано изживяване'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Град
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пощенски код
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имейл адрес *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Парола *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Моля изчакайте...' : (mode === 'login' ? 'Влез' : 'Регистрирай се')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-500 hover:text-blue-600"
          >
            {mode === 'login' 
              ? 'Нямате профил? Регистрирайте се' 
              : 'Имате профил? Влезте'
            }
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;