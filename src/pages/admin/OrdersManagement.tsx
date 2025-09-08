import React, { useState } from 'react';
import DualPrice from '../../components/DualPrice';
import { Eye, Search, Filter, Calendar, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useOrders } from '../../hooks/useSupabase';
import { useCurrency } from '../../context/CurrencyContext';
import { supabase } from '../../lib/supabase';

const OrdersManagement = () => {
  const { orders, loading, refetch } = useOrders();
  const { currencySymbol } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
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

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на поръчки...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Управление на поръчки</h1>
              <p className="text-gray-600 mt-1">Преглед и управление на всички поръчки</p>
            </div>
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
                  placeholder="Търсете по име, имейл или номер на поръчка..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Всички статуси</option>
                <option value="pending">Чакащи</option>
                <option value="processing">Обработват се</option>
                <option value="shipped">Изпратени</option>
                <option value="delivered">Доставени</option>
                <option value="cancelled">Отказани</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Поръчки ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Поръчка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сума
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} продукта
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('bg-BG')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString('bg-BG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.total.toFixed(2)} {currencySymbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.payment_method === 'card' ? 'Карта' :
                         order.payment_method === 'cash' ? 'Наложен платеж' :
                         order.payment_method === 'bank' ? 'Банков превод' : order.payment_method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-sm font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Чакаща</option>
                          <option value="processing">Обработва се</option>
                          <option value="shipped">Изпратена</option>
                          <option value="delivered">Доставена</option>
                          <option value="cancelled">Отказана</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Преглед"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Няма намерени поръчки</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Поръчка #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Информация за поръчката</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата:</span>
                    <span>{new Date(selectedOrder.created_at).toLocaleString('bg-BG')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Плащане:</span>
                    <span>
                      {selectedOrder.payment_method === 'card' ? 'Карта' :
                       selectedOrder.payment_method === 'cash' ? 'Наложен платеж' :
                       selectedOrder.payment_method === 'bank' ? 'Банков превод' : selectedOrder.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-600">Общо:</span>
                    <span>{selectedOrder.total.toFixed(2)} {currencySymbol}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4 mt-6">Клиент</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Име:</span>
                    <span>{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Имейл:</span>
                    <span>{selectedOrder.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Телефон:</span>
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4 mt-6">Адрес за доставка</h4>
                <div className="text-sm text-gray-600">
                  <p>{selectedOrder.shipping_address.address}</p>
                  <p>{selectedOrder.shipping_address.city} {selectedOrder.shipping_address.postalCode}</p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Продукти</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity}x <DualPrice amount={item.price} />
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{(item.quantity * item.price).toFixed(2)} {currencySymbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;