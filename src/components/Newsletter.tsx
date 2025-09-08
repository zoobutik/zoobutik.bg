import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Newsletter = () => {
  const { user } = useAuth();
  const { currencySymbol } = useCurrency();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Моля, влезте в профила си, за да се абонирате за бюлетина.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Проверка дали потребителят вече е абониран
      const { data: existingSubscription } = await supabase
        .from('newsletter_subscribers')
        .select('id, discount_code')
        .eq('email', user.email)
        .maybeSingle();

      if (existingSubscription) {
        setError('Този имейл вече е абониран за нашия бюлетин.');
        return;
      }

      // Абониране за бюлетин
      const { data, error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: user.email }])
        .select('discount_code')
        .single();

      if (insertError) {
        console.error('Newsletter subscription error:', insertError);
        throw new Error('Грешка при абонирането за бюлетин');
      }

      // Обновяване на потребителския профил
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ 
          newsletter_subscribed: true,
          discount_code: data.discount_code 
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Не спираме процеса, защото абонирането е успешно
      }

      // Изпращане на имейл с кода за отстъпка
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-newsletter-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            discountCode: data.discount_code
          })
        });

        if (!response.ok) {
          console.error('Failed to send newsletter email');
        }
      } catch (emailError) {
        console.error('Error sending newsletter email:', emailError);
        // Не спираме процеса, защото абонирането е успешно
      }

      setSuccess(true);
      setDiscountCode(data.discount_code || 'NEWSLETTER10');
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Възникна грешка при абонирането. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <p className="text-xl font-bold text-gray-800">129.99 {currencySymbol}</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Благодарим ви за абонирането!
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Вашият код за 10% отстъпка е готов! Използвайте го при следващата си поръчка.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-6 max-w-md mx-auto mb-8">
            <p className="text-green-100 mb-2">Вашият код за отстъпка:</p>
            <div className="bg-white text-green-700 text-2xl font-bold py-3 px-6 rounded-lg">
              {discountCode}
            </div>
            <p className="text-green-100 text-sm mt-2">
              Валиден 30 дни от днес
            </p>
          </div>
          <p className="text-green-100 text-sm mb-6">
            Изпратихме ви имейл с кода за отстъпка и допълнителна информация.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Затвори
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Получете 10% отстъпка
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Абонирайте се за нашия бюлетин и получете ексклузивни оферти, 
            съвети за грижа за домашни любимци и първи достъп до нови продукти
          </p>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-300 text-white px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              {error}
            </div>
          )}

          {!user ? (
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-300 text-white px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              <p className="mb-4">Моля, влезте в профила си, за да се абонирате за бюлетина.</p>
              <p className="text-sm">Само регистрирани потребители могат да получават кодове за отстъпка.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <p className="text-blue-100 mb-2">Абониране с имейл: {user.email}</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Абониране...' : 'Абонирай се за бюлетина'}
              </button>
            </form>
          )}

          <p className="text-blue-100 text-sm mt-4">
            * Можете да се отпишете по всяко време. Не споделяме вашите данни.
          </p>

          <div className="flex justify-center items-center space-x-8 mt-12 text-blue-100">
            <div className="text-center">
              <div className="text-2xl font-bold">15,000+</div>
              <div className="text-sm">Абонати</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Доволни клиенти</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5★</div>
              <div className="text-sm">Средна оценка</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;