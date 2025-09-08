import React, { useState, useEffect } from 'react';
import DualPrice from '../components/DualPrice';
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { supabase } from '../lib/supabase';

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const { currencySymbol } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Чакаща';
      case 'processing':
        return 'Обработва се';
      case 'shipped':
        return 'Изпратена';
      case 'delivered':
        return 'Доставена';
      case 'cancelled':
        return 'Отказана';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Моля, влезте в профила си</h2>
          <p className="text-gray-600">За да видите поръчките си, трябва да сте влезли в профила си.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на поръчките...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Моите поръчки</h1>
            <p className="text-gray-600">Преглед на всички ваши поръчки и тяхното състояние</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Няма поръчки</h2>
              <p className="text-gray-600 mb-8">Все още не сте направили нито една поръчка.</p>
              <a
                href="/products"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Започнете пазаруването
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Поръчка #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('bg-BG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {order.total.toFixed(2)} {currencySymbol}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} продукта
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Products */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Продукти</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity}x <DualPrice amount={item.price} />
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Truck className="w-4 h-4 mr-2" />
                            Адрес за доставка
                          </h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city} {order.shipping_address.postalCode}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Начин на плащане
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.payment_method === 'card' ? 'Кредитна/дебитна карта' :
                             order.payment_method === 'cash' ? 'Наложен платеж' :
                             order.payment_method === 'bank' ? 'Банков превод' : order.payment_method}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Контакт
                          </h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.customer_name}</p>
                            <p>{order.customer_phone}</p>
                            <p>{order.customer_email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;