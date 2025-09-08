import DualPrice from './DualPrice';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProducts } from '../hooks/useSupabase';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Търсете продукти...' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const { products } = useProducts();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Филтриране на продуктите при промяна на търсенето
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 6); // Показваме максимум 6 резултата
      
      setFilteredProducts(filtered);
      setIsOpen(true);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
  }, [searchTerm, products]);

  // Затваряне на dropdown при клик извън него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleProductClick = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // При ESC - затваряме dropdown и изчистваме търсенето
      setSearchTerm('');
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      // При Enter - отиваме към страницата с резултати
      e.preventDefault();
      if (searchTerm.trim()) {
        handleSearch();
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative flex">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 pr-24 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {/* Clear button - moved further left to avoid overlap */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 z-10"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Search button */}
        <button 
          onClick={handleSearchButtonClick}
          type="button"
          className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">
              Намерени {filteredProducts.length} резултата
            </div>
            
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={handleProductClick}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg mr-3 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                  <div className="flex flex-col items-start mt-1">
                    <span className="text-lg font-bold text-gray-900">
                      <DualPrice amount={product.price} />
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-gray-500 line-through mt-1">
                        <DualPrice amount={product.original_price} />
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Stock status */}
                <div className="flex-shrink-0 ml-2">
                  {product.stock_quantity > 0 ? (
                    <span className="text-xs text-green-600 font-medium">В наличност</span>
                  ) : (
                    <span className="text-xs text-red-600 font-medium">Изчерпан</span>
                  )}
                </div>
              </Link>
            ))}
            
            {/* View all results link */}
            <div className="border-t mt-2 pt-2">
              <Link
                to={`/products?search=${encodeURIComponent(searchTerm)}`}
                onClick={handleProductClick}
                className="block w-full text-center py-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Виж всички резултати за "{searchTerm}"
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && searchTerm.length >= 2 && filteredProducts.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Няма намерени продукти за "{searchTerm}"</p>
            <p className="text-sm mt-1">Опитайте с други ключови думи</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;