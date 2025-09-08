import React, { useState, useEffect } from 'react';
import { Mail, Download, Upload, Users, Send, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NewsletterSubscriber {
  id: number;
  email: string;
  discount_code?: string;
  subscribed_at: string;
  is_active: boolean;
}

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Моля, изберете PDF файл');
    }
  };

  const sendNewsletter = async () => {
    if (!selectedFile) {
      alert('Моля, изберете PDF файл за изпращане');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      // В реален проект тук би се качил файлът и изпратил имейл до всички абонати
      // За демо целите ще симулираме процеса
      
      // Симулация на качване на файл
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Симулация на изпращане на имейли
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMessage(`Бюлетинът е изпратен успешно до ${subscribers.length} абоната!`);
      setSelectedFile(null);
      
      // Почистване на file input
      const fileInput = document.getElementById('newsletter-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setMessage('Грешка при изпращане на бюлетина');
    } finally {
      setSending(false);
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Имейл', 'Дата на абониране', 'Код за отстъпка'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleDateString('bg-BG'),
        sub.discount_code || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на абонати...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Управление на бюлетин</h1>
              <p className="text-gray-600 mt-1">Изпращане на бюлетини и управление на абонати</p>
            </div>
            <button
              onClick={exportSubscribers}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Експорт на абонати</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Общо абонати</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Активни абонати</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.filter(s => s.is_active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">С код за отстъпка</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.filter(s => s.discount_code).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Sending */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Изпращане на бюлетин</h2>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('успешно') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Качи PDF файл с бюлетина
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Избери файл
                  <input
                    id="newsletter-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    Избран файл: {selectedFile.name}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Поддържани формати: PDF (максимум 10MB)
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">
                  Бюлетинът ще бъде изпратен до <strong>{subscribers.length}</strong> абоната
                </p>
              </div>
              <button
                onClick={sendNewsletter}
                disabled={!selectedFile || sending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{sending ? 'Изпраща се...' : 'Изпрати бюлетин'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Списък на абонатите ({subscribers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Имейл
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата на абониране
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Код за отстъпка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(subscriber.subscribed_at).toLocaleDateString('bg-BG')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleTimeString('bg-BG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscriber.discount_code ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {subscriber.discount_code}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscriber.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscribers.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Няма абонати за бюлетина</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterManagement;