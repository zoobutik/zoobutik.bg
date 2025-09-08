import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              Всичко за вашия
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                {' '}любимец
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Открийте най-качествените продукти за домашни любимци. 
              От храна до играчки - всичко на едно място с бърза доставка.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">   
              <Link to="/products">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg         transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Разгледай продуктите</span>
                <ArrowRight className="w-5 h-5" />
              </button>
                </Link>
              <Link to="/contact">
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-500 transition-colors">
                Свържи се с нас
              </button>
              </Link>  
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Щастливо куче с играчка"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl -z-10"></div>
            
         </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;