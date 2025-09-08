import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import DualPrice from '../components/DualPrice';

const CartPage = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Количката е празна</h2>
          <p className="text-gray-600 mb-8">Добавете продукти, за да започнете пазаруването</p>
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
          <h1 className="text-4xl font-bold text-gray-800">Количка</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Изчисти количката
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">{item.product.brand}</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      <DualPrice amount={item.product.price} />
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Обобщение на поръчката</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Междинна сума:</span>
                  <span className="font-medium"><DualPrice amount={state.total} /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка:</span>
                  <span className="font-medium">
                    {state.total >= 50 ? 'Безплатна' : <DualPrice amount={5.99} />}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Общо:</span>
                    <span><DualPrice amount={state.total + (state.total >= 50 ? 0 : 5.99)} /></span>
                  </div>
                </div>
              </div>

              {state.total < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Добавете още <DualPrice amount={50 - state.total} /> за безплатна доставка!
                  </p>
                </div>
              )}

              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                Продължи към плащане
              </Link>

              <Link
                to="/products"
                className="w-full mt-4 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Продължи пазаруването
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;