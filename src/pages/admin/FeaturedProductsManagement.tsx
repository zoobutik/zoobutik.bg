import React, { useState, useEffect } from 'react';
import DualPrice from '../../components/DualPrice';
import { Star, Plus, X, Search } from 'lucide-react';
import { useProducts } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';

const FeaturedProductsManagement = () => {
  const { products, loading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      // Load featured products from localStorage for now
      // In a real app, this would be stored in the database
      const saved = localStorage.getItem('featuredProducts');
      if (saved) {
        setFeaturedProducts(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  const saveFeaturedProducts = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Save to localStorage for now
      // In a real app, this would be saved to the database
      localStorage.setItem('featuredProducts', JSON.stringify(featuredProducts));
      setMessage('Препоръчаните продукти са запазени успешно!');
    } catch (error) {
      console.error('Error saving featured products:', error);
      setMessage('Грешка при запазване на препоръчаните продукти');
    } finally {
      setSaving(false);
    }
  };

  const addToFeatured = (productId: number) => {
    if (featuredProducts.length < 8 && !featuredProducts.includes(productId)) {
      setFeaturedProducts([...featuredProducts, productId]);
    }
  };

  const removeFromFeatured = (productId: number) => {
    setFeaturedProducts(featuredProducts.filter(id => id !== productId));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredProductsData = products.filter(product => 
    featuredProducts.includes(product.id)
  );

  const availableProducts = filteredProducts.filter(product => 
    !featuredProducts.includes(product.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на продукти...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Препоръчани продукти</h1>
              <p className="text-gray-600 mt-1">Изберете до 8 продукта за показване на началната страница</p>
            </div>
            <button
              onClick={saveFeaturedProducts}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>{saving ? 'Запазване...' : 'Запази промените'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('успешно') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Products */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Препоръчани продукти ({featuredProducts.length}/8)
                </h2>
                <div className="text-sm text-gray-500">
                  Влачете за пренареждане
                </div>
              </div>

              {featuredProductsData.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Няма избрани препоръчани продукти</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Изберете продукти от списъка вдясно
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {featuredProductsData.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-sm text-gray-500 w-6">
                        {index + 1}
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <p className="text-sm font-medium text-gray-900">
                          <DualPrice amount={product.price} />
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromFeatured(product.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                        title="Премахни от препоръчани"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Products */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Всички продукти</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Търсене..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600">{product.brand}</p>
                      <p className="text-sm font-medium text-gray-900">
                        <DualPrice amount={product.price} />
                      </p>
                    </div>
                    <button
                      onClick={() => addToFeatured(product.id)}
                      disabled={featuredProducts.length >= 8}
                      className={`p-2 rounded-lg transition-colors ${
                        featuredProducts.length >= 8
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                      title={featuredProducts.length >= 8 ? 'Максимум 8 продукта' : 'Добави към препоръчани'}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {availableProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Няма намерени продукти</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Инструкции</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Можете да изберете до 8 продукта за показване като препоръчани на началната страница</li>
            <li>• Използвайте търсачката за да намерите конкретни продукти</li>
            <li>• Редът на продуктите в списъка "Препоръчани продукти" определя реда на показване</li>
            <li>• Не забравяйте да запазите промените след редактиране</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsManagement;