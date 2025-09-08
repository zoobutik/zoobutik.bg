import React from 'react';
import { Euro, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const CurrencyManagement = () => {
  const { currencySymbol, setCurrencySymbol } = useCurrency();

  const toggleCurrency = () => {
    const newSymbol = currencySymbol === 'лв' ? '€' : 'лв';
    setCurrencySymbol(newSymbol);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Управление на валута</h1>
              <p className="text-gray-600 mt-1">Превключване между лева и евро символи</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">Текуща валута: {currencySymbol}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Currency Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Избор на валута</h2>
            
            <div className="flex items-center justify-center space-x-8 mb-8">
              {/* BGN Option */}
              <div className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
                currencySymbol === 'лв' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <span className="text-4xl font-bold mb-2">лв</span>
                <span className="text-lg font-medium text-gray-700">Български лев</span>
                <span className="text-sm text-gray-500 mt-1">BGN</span>
              </div>

              {/* Toggle Button */}
              <button
                onClick={toggleCurrency}
                className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                {currencySymbol === 'лв' ? (
                  <ToggleRight className="w-8 h-8 mb-2" />
                ) : (
                  <ToggleLeft className="w-8 h-8 mb-2" />
                )}
                <span className="text-sm font-medium">Превключи</span>
              </button>

              {/* EUR Option */}
              <div className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
                currencySymbol === '€' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <span className="text-4xl font-bold mb-2">€</span>
                <span className="text-lg font-medium text-gray-700">Евро</span>
                <span className="text-sm text-gray-500 mt-1">EUR</span>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Текущо състояние</h3>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gray-600">Всички цени се показват с:</span>
                <span className="text-2xl font-bold text-blue-600">{currencySymbol}</span>
              </div>
            </div>

            {/* Example Prices */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Примерни цени</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Храна за кучета</p>
                  <p className="text-xl font-bold text-gray-800">89.99 {currencySymbol}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Играчка за котки</p>
                  <p className="text-xl font-bold text-gray-800">45.99 {currencySymbol}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Легло за кучета</p>
                  <p className="text-xl font-bold text-gray-800">129.99 {currencySymbol}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Инструкции</h3>
          <ul className="text-yellow-700 space-y-2 text-sm">
            <li>• Това променя само символа на валутата, който се показва на сайта</li>
            <li>• Цените остават същите - трябва да ги коригирате ръчно в секция "Продукти"</li>
            <li>• Промяната се прилага веднага за всички посетители</li>
            <li>• Настройката се запазва автоматично</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrencyManagement;