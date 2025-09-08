import React from 'react';
import DualPrice from './DualPrice';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useProducts } from '../hooks/useSupabase';

const FeaturedProducts = () => {
  const { dispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();
  const { currencySymbol } = useCurrency();
  const { products, loading } = useProducts();

  // Load featured product IDs from localStorage
  const getFeaturedProductIds = () => {
    try {
      const saved = localStorage.getItem('featuredProducts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const featuredProductIds = getFeaturedProductIds();
  const featuredProducts = products.filter(product => 
    featuredProductIds.includes(product.id)
  ).slice(0, 4); // Show max 4 on homepage

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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Препоръчани продукти
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Най-качествените и популярни продукти, избрани специално за вас
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't show the section if no featured products are selected
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Препоръчани продукти
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Най-качествените и популярни продукти, избрани специално за вас
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock_quantity || 0);
            const isInWishlist = wishlistState.items.some(item => item.id === product.id);
            
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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

                <div className="p-6">
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
                      <DualPrice amount={product.price} />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-800">
                        <DualPrice amount={product.price} />
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.original_price.toFixed(2)} {currencySymbol}
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

        <div className="text-center mt-12">
          <Link 
            to="/products"
            className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Виж всички продукти
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;