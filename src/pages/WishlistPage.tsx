import React from 'react';
import DualPrice from '../components/DualPrice';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const WishlistPage = () => {
  const { state, dispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const { currencySymbol } = useCurrency();

  const removeFromWishlist = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const addToCart = (product: any) => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
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

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Списъкът с желания е празен</h2>
          <p className="text-gray-600 mb-8">Добавете продукти, които харесвате, за да ги запазите за по-късно</p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Разгледай продуктите
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Списък с желания</h1>
          <button
            onClick={() => dispatch({ type: 'CLEAR_WISHLIST' })}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Изчисти списъка
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.items.map((product) => {
            const stockStatus = getStockStatus(product.stockQuantity || 0);
            
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
                    <div className={`absolute top-3 left-3 ${product.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                      {product.badge}
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-800">
                        <DualPrice amount={product.price} />
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)} {currencySymbol}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                        product.stockQuantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {product.stockQuantity === 0 ? 'Изчерпан' : 'Добави в количката'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-full py-2 text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Премахни от списъка
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;