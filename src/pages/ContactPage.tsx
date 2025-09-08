import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Свържете се с нас</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Имате въпроси? Нуждаете се от съвет? Нашият екип е тук, за да ви помогне!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Как да ни намерите</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Ние сме тук, за да отговорим на всички ваши въпроси относно продуктите ни, 
                доставката или грижата за домашни любимци. Свържете се с нас по удобния за вас начин.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Адрес</h3>
                  <p className="text-gray-600">
                    ул. "Поп Грую" 74А<br />
                    Бургас, България
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Телефон</h3>
                  <p className="text-gray-600">0888 839 366</p>
                  <p className="text-sm text-gray-500">Всеки ден: 10:00 - 20:00</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Имейл</h3>
                  <p className="text-gray-600">info@zoobutik-iv.bg</p>
                  <p className="text-sm text-gray-500">Отговаряме в рамките на 24 часа</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Работно време</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Всеки ден: 10:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-gray-200 rounded-2xl h-64 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2922.964964295387!2d27.47510107666119!3d42.5047128711707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a6949255daa3df%3A0x581dc1a69466f179!2z0JfQsNC80L7QvNCw0YDQvtCzINCY0L7QvNCw0YDQvtCzINCY0L7QvNCw0YDQvtCzIElW!5e0!3m2!1sbg!2sbg!4v1694188800000!5m2!1sbg!2sbg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ЗООБУТИК ИВ Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Изпратете ни съобщение</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Име *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Вашето име"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имейл *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тема
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Изберете тема</option>
                  <option value="product">Въпрос за продукт</option>
                  <option value="order">Въпрос за поръчка</option>
                  <option value="delivery">Доставка</option>
                  <option value="return">Връщане/Рекламация</option>
                  <option value="advice">Съвет за домашен любимец</option>
                  <option value="other">Друго</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Съобщение *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Опишете вашия въпрос или проблем..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Изпрати съобщение</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Често задавани въпроси</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Как мога да проследя поръчката си?</h3>
              <p className="text-gray-600">
                След потвърждаване на поръчката ще получите имейл с номер за проследяване. 
                Можете да проследите статуса в секция "Моите поръчки" в профила си.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Какви са условията за връщане?</h3>
              <p className="text-gray-600">
                Можете да върнете продукти в рамките на 14 дни от получаването им, 
                при условие че са в оригиналната си опаковка и не са използвани.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Предлагате ли консултации?</h3>
              <p className="text-gray-600">
                Да! Нашият екип от специалисти може да ви консултира относно избора на храна, 
                аксесоари и грижа за вашия домашен любимец.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Има ли отстъпки за постоянни клиенти?</h3>
              <p className="text-gray-600">
                Да! Имаме програма за лоялност с ексклузивни отстъпки и ранен достъп до промоции.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;