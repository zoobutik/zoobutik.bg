import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useSupabase';

const Categories = () => {
  const { categories, loading } = useCategories();

  // Показваме само главните категории (без parent_id) които са видими
  const mainCategories = categories.filter(cat => !cat.parent_id && cat.is_visible)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .slice(0, 6); // Показваме максимум 6 категории

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Категории продукти
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Разгледайте нашата богата селекция от продукти за всички видове домашни любимци
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Категории продукти
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Разгледайте нашата богата селекция от продукти за всички видове домашни любимци
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-sm opacity-90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {category.count}
                </p>
                <div className="mt-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-200">
                  <span className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                    Разгледай →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;