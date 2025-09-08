import React from 'react';
import { Truck, Shield, Headphones, Award, Clock, Heart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: 'Безплатна доставка',
      description: 'При поръчки над 50 лв/€ в цялата страна',
      color: 'text-blue-500'
    },
    {
      icon: Shield,
      title: 'Гаранция за качество',
      description: '100% оригинални продукти от проверени марки',
      color: 'text-green-500'
    },
    {
      icon: Headphones,
      title: '24/7 Поддръжка',
      description: 'Винаги сме тук да ви помогнем',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      title: 'Най-добри цени',
      description: 'Конкурентни цени и редовни промоции',
      color: 'text-orange-500'
    },
    {
      icon: Clock,
      title: 'Бърза доставка',
      description: 'До 48 часа в София, до 72 часа в страната',
      color: 'text-red-500'
    },
    {
      icon: Heart,
      title: 'Грижа за любимците',
      description: 'Експертни съвети за здравето на животните',
      color: 'text-pink-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Защо да изберете нас?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ние се грижим за вашите домашни любимци като за наши собствени
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                При поръчки над 50 лв/€ в цялата страна
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;