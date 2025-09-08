import React, { useState, useMemo, useEffect } from 'react';
import DualPrice from '../components/DualPrice';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useProducts, useCategories } from '../hooks/useSupabase';

const ProductsPage = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { currencySymbol } = useCurrency();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { dispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

  // Set search term from URL parameter
  useEffect(() => {
    if (searchQuery) {
      // Scroll to top when coming from search
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchQuery]);

  // Get unique brands
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(product => product.brand))];
    return uniqueBrands.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter first if there's a search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(product => product.category_id === categoryId);
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, priceRange]);

  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_ITEM', payload: {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.original_price,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images: product.images,
      badge: product.badge,
      badgeColor: product.badge_color,
      category: product.category_id.toString(),
      description: product.description,
      features: product.features,
      inStock: product.in_stock,
      stockQuantity: product.stock_quantity
    }});
  };

  const toggleWishlist = (product: any) => {
    const isInWishlist = wishlistState.items.some(item => item.id === product.id);
    
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
    } else {
      const wishlistProduct = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.original_price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images: product.images,
        badge: product.badge,
        badgeColor: product.badge_color,
        category: product.category_id.toString(),
        description: product.description,
        features: product.features,
        inStock: product.in_stock,
        stockQuantity: product.stock_quantity
      };
      wishlistDispatch({ type: 'ADD_ITEM', payload: wishlistProduct });
    }
  };

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return { text: 'Изчерпан', color: 'text-red-600' };
    } else if (stockQuantity <= 5) {
      return { text: 'Ограничена наличност', color: 'text-orange-600' };
    } else {
      return { text: 'В наличност', color: 'text-green-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {searchQuery ? `Резултати за "${searchQuery}"` : 'Всички продукти'}
          </h1>
          <p className="text-gray-600">
            {searchQuery 
              ? `Намерени ${filteredProducts.length} продукта за "${searchQuery}"`
              : 'Открийте най-качествените продукти за вашия домашен любимец'
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-semibold">Филтри</h3>
              </div>

              {/* Search Query Display */}
              {searchQuery && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Търсене за: <strong>"{searchQuery}"</strong>
                  </p>
                  <Link 
                    to="/products" 
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Изчисти търсенето
                  </Link>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Категория</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    Всички
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id.toString()}
                        checked={selectedCategory === category.id.toString()}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Марка</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Всички марки</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Ценови диапазон</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]} лв</span>
                    <span>{priceRange[1]} лв</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Показани {filteredProducts.length} продукта
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Сортирай по име</option>
                    <option value="price-low">Цена: ниска към висока</option>
                    <option value="price-high">Цена: висока към ниска</option>
                  </select>
                  
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock_quantity || 0);
                const isInWishlist = wishlistState.items.some(item => item.id === product.id);
                
                return (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                          }`}
                        />
                      </Link>
                      {product.badge && (
                        <div className={`absolute top-3 left-3 ${product.badge_color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                          {product.badge}
                        </div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                          isInWishlist 
                            ? 'bg-red-500 text-white opacity-100' 
                            : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="mb-3">
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col items-start">
                          <span className="text-2xl font-bold text-gray-800">
                            <DualPrice amount={product.price} />
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-gray-500 line-through mt-1">
                              <DualPrice amount={product.original_price} />
                            </span>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                          product.stock_quantity === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {product.stock_quantity === 0 ? 'Изчерпан' : 'Добави в количката'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery 
                    ? `Няма намерени продукти за "${searchQuery}".`
                    : 'Няма намерени продукти с тези филтри.'
                  }
                </p>
                {searchQuery && (
                  <Link 
                    to="/products" 
                    className="text-blue-500 hover:text-blue-600 underline mt-2 inline-block"
                  >
                    Виж всички продукти
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;