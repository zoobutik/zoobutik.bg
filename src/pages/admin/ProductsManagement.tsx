import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { useProducts, useCategories } from '../../hooks/useSupabase';
import { useCurrency } from '../../context/CurrencyContext';
import DualPrice from '../../components/DualPrice';
import { supabase } from '../../lib/supabase';

const ProductsManagement = () => {
  const { products, loading, refetch } = useProducts();
  const { categories } = useCategories();
  const { currencySymbol } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      refetch();
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Грешка при изтриване на продукта');
    }
  };

  const toggleStock = async (id: number, currentStock: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStock })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const updateStockQuantity = async (id: number, quantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: quantity })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error updating stock quantity:', error);
    }
  };

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return { text: 'Изчерпан', color: 'bg-red-100 text-red-800' };
    } else if (stockQuantity <= 5) {
      return { text: 'Ограничена наличност', color: 'bg-orange-100 text-orange-800' };
    } else {
      return { text: 'В наличност', color: 'bg-green-100 text-green-800' };
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Управление на продукти</h1>
              <p className="text-gray-600 mt-1">Добавяйте, редактирайте и управлявайте продуктите в магазина</p>
            </div>
            <Link
              to="/admin/products/new"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Добави продукт</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Търсете продукти..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Всички категории</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Продукти ({filteredProducts.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Продукт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наличност
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const category = categories.find(c => c.id === product.category_id);
                  const stockStatus = getStockStatus(product.stock_quantity || 0);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category?.name || 'Неизвестна'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <DualPrice amount={product.price} />
                        </div>
                        {product.original_price && (
                          <div className="text-sm text-gray-500 line-through">
                            <DualPrice amount={product.original_price} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStock(product.id, product.in_stock)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.in_stock 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors cursor-pointer`}
                        >
                          {product.in_stock ? 'Активен' : 'Неактивен'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={product.stock_quantity || 0}
                            onChange={(e) => updateStockQuantity(product.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Преглед"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Редактиране"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(product.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Изтриване"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Няма намерени продукти</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Потвърдете изтриването
            </h3>
            <p className="text-gray-600 mb-6">
              Сигурни ли сте, че искате да изтриете този продукт? Това действие не може да бъде отменено.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Отказ
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;