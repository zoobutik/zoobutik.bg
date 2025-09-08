import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';

const OrderSuccessPage = () => {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Поръчката е успешна!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Благодарим ви за поръчката! Ще получите имейл с потвърждение скоро.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Номер на поръчката:</p>
          <p className="text-xl font-bold text-gray-800">#{orderNumber}</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-left">
            <Package className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Обработка на поръчката</p>
              <p className="text-sm text-gray-600">1-2 работни дни</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Доставка</p>
              <p className="text-sm text-gray-600">2-3 работни дни</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/products"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 block"
          >
            Продължи пазаруването
          </Link>
          
          <Link
            to="/"
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors block"
          >
            Към началната страница
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;