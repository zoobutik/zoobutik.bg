
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">ЗООБУТИК ИВ</span>
              <p className="text-xs text-gray-400">Всичко за вашия любимец</p>
            </div>
          </Link>

          {/* Navigation - само продукти и контакти, подравнени вляво */}
          <div className="flex flex-1 items-center justify-start w-full max-w-xl mx-4">
            <div className="flex items-center space-x-8">
              <Link to="/products" className="hover:text-blue-400 transition-colors">Продукти</Link>
              <Link to="/contact" className="hover:text-blue-400 transition-colors">Контакти</Link>
            </div>
          </div>

          {/* Copyright */}
          <span className="text-gray-400 text-sm">© 2025 ЗООБУТИК ИВ</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;