import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Move, ChevronDown, ChevronRight, Upload, X } from 'lucide-react';
import { useCategories } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';

const NavigationManagement = () => {
  const { categories, loading, refetch } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState({ from: '#3b82f6', to: '#8b5cf6' });
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    color: 'from-blue-400 to-purple-500',
    description: '',
    parent_id: '',
    sort_order: 0,
    is_visible: true,
    navigation_type: 'category',
    external_url: '',
    icon: ''
  });

  const navigationTypes = [
    { value: 'category', label: 'Категория' },
    { value: 'link', label: 'Външна връзка' },
    { value: 'dropdown', label: 'Падащо меню' }
  ];

  const gradientOptions = [
    { value: 'from-blue-400 to-purple-500', label: 'Син към лилав', preview: 'bg-gradient-to-r from-blue-400 to-purple-500' },
    { value: 'from-orange-400 to-red-500', label: 'Оранжев към червен', preview: 'bg-gradient-to-r from-orange-400 to-red-500' },
    { value: 'from-green-400 to-blue-500', label: 'Зелен към син', preview: 'bg-gradient-to-r from-green-400 to-blue-500' },
    { value: 'from-yellow-400 to-orange-500', label: 'Жълт към оранжев', preview: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { value: 'from-purple-400 to-pink-500', label: 'Лилав към розов', preview: 'bg-gradient-to-r from-purple-400 to-pink-500' },
    { value: 'from-teal-400 to-cyan-500', label: 'Тийл към циан', preview: 'bg-gradient-to-r from-teal-400 to-cyan-500' },
    { value: 'from-indigo-400 to-purple-500', label: 'Индиго към лилав', preview: 'bg-gradient-to-r from-indigo-400 to-purple-500' },
    { value: 'from-pink-400 to-red-500', label: 'Розов към червен', preview: 'bg-gradient-to-r from-pink-400 to-red-500' },
    { value: 'custom', label: 'Персонализиран', preview: 'bg-gradient-to-r from-gray-400 to-gray-600' }
  ];

  // Организиране на категориите в йерархична структура
  const organizeCategories = () => {
    const mainCategories = categories.filter(cat => !cat.parent_id && cat.is_visible)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    return mainCategories.map(mainCat => ({
      ...mainCat,
      children: categories.filter(cat => cat.parent_id === mainCat.id && cat.is_visible)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }));
  };

  const hierarchicalCategories = organizeCategories();
  const mainCategories = categories.filter(cat => !cat.parent_id);

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const openModal = (category?: any, parentId?: number) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        image: category.image || '',
        color: category.color,
        description: category.description || '',
        parent_id: category.parent_id?.toString() || '',
        sort_order: category.sort_order || 0,
        is_visible: category.is_visible ?? true,
        navigation_type: category.navigation_type || 'category',
        external_url: category.external_url || '',
        icon: category.icon || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        image: '',
        color: 'from-blue-400 to-purple-500',
        description: '',
        parent_id: parentId?.toString() || '',
        sort_order: 0,
        is_visible: true,
        navigation_type: 'category',
        external_url: '',
        icon: ''
      });
    }
    setShowModal(true);
  };

  const generateSlug = (name: string) => {
    // Карта за конвертиране на кирилски букви в латински
    const cyrillicToLatin: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A',
      'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return name
      .split('')
      .map(char => cyrillicToLatin[char] || char) // Конвертиране на кирилица
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Премахване на специални символи
      .replace(/\s+/g, '-') // Заместване на интервали с тирета
      .replace(/-+/g, '-') // Премахване на множествени тирета
      .replace(/^-+|-+$/g, '') // Премахване на тирета в началото и края
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleColorChange = (colorValue: string) => {
    if (colorValue === 'custom') {
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
    }
    setFormData(prev => ({ ...prev, color: colorValue }));
  };

  const generateCustomGradient = () => {
    const fromColor = customColor.from.replace('#', '');
    const toColor = customColor.to.replace('#', '');
    return `from-[#${fromColor}] to-[#${toColor}]`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // В реален проект тук би се качил файлът към Supabase Storage
      // За демо целите ще използваме URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      
      // Показваме съобщение за демо
      alert('Забележка: В демо версията изображението се съхранява временно. В продукционна версия файлът ще се качи в Supabase Storage.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalColor = formData.color;
      if (formData.color === 'custom') {
        finalColor = generateCustomGradient();
      }

      const dataToSave = {
        ...formData,
        color: finalColor,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        sort_order: formData.sort_order || 0,
        image: formData.image || '' // Use empty string instead of null
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(dataToSave)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([dataToSave]);
        
        if (error) throw error;
      }
      
      refetch();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Грешка при запазване на категорията');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      refetch();
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Грешка при изтриване на категорията');
    }
  };

  const updateSortOrder = async (id: number, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ sort_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  const toggleVisibility = async (id: number, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Зареждане на навигацията...</p>
        </div>
      </div>
    );
  }

  const renderCategoryRow = (category: any, level = 0) => (
    <div key={category.id} className="bg-white border border-gray-200 rounded-lg mb-2">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3" style={{ paddingLeft: `${level * 20}px` }}>
          {category.children?.length > 0 && (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              {expandedCategories.has(category.id) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          )}
          
          <div className="flex items-center space-x-3">
            {category.icon && <span className="text-lg">{category.icon}</span>}
            <div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500">
                {category.slug} • {category.navigation_type}
                {category.parent_id && ' • Подкатегория'}
              </p>
              {category.description && (
                <p className="text-xs text-gray-400 mt-1 max-w-md truncate">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleVisibility(category.id, category.is_visible)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              category.is_visible 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {category.is_visible ? 'Видима' : 'Скрита'}
          </button>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <button
              onClick={() => updateSortOrder(category.id, (category.sort_order || 0) - 1)}
              className="p-1 hover:text-gray-600"
              title="Премести нагоре"
            >
              ↑
            </button>
            <span className="text-xs px-2">{category.sort_order || 0}</span>
            <button
              onClick={() => updateSortOrder(category.id, (category.sort_order || 0) + 1)}
              className="p-1 hover:text-gray-600"
              title="Премести надолу"
            >
              ↓
            </button>
          </div>

          <button
            onClick={() => openModal(null, category.id)}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Добави подкатегория"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => window.open(`/category/${category.slug}`, '_blank')}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="Преглед"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => openModal(category)}
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
            title="Редактиране"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowDeleteModal(category.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Изтриване"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Подкатегории */}
      {expandedCategories.has(category.id) && category.children?.map((child: any) => 
        renderCategoryRow(child, level + 1)
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Управление на навигацията</h1>
              <p className="text-gray-600 mt-1">Създавайте и управлявайте менютата на сайта</p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Добави елемент</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tree */}
        <div className="space-y-2">
          {hierarchicalCategories.map(category => renderCategoryRow(category))}
        </div>

        {hierarchicalCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Няма създадени навигационни елементи</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              Създайте първия елемент
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Редактиране на навигационен елемент' : 'Добавяне на навигационен елемент'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="Храна за котки"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Slug-ът ще се генерира автоматично от името
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип навигация *
                  </label>
                  <select
                    value={formData.navigation_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, navigation_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {navigationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required={formData.navigation_type === 'category'}
                    placeholder="hrana-za-kotki"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Родителска категория
                  </label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Главна категория</option>
                    {mainCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ред на показване
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Икона (emoji или текст)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🐕 или 🐱"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Този текст ще се показва под заглавието на категорията"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Този текст ще се показва под заглавието на категорията
                </p>
              </div>

              {formData.navigation_type === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Външна връзка *
                  </label>
                  <input
                    type="url"
                    value={formData.external_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                    required
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {formData.navigation_type === 'category' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Изображение
                    </label>
                    <div className="space-y-3">
                      {/* File upload */}
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                          <Upload className="w-4 h-4 mr-2" />
                          Качи файл
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-sm text-gray-500">или</span>
                      </div>
                      
                      {/* URL input */}
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {/* Image preview */}
                      {formData.image && (
                        <div className="relative inline-block">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Изображението не е задължително. Можете да качите файл или да въведете URL.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цветова схема
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {gradientOptions.map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="color"
                            value={option.value}
                            checked={formData.color === option.value}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full mr-2 ${option.preview} ${
                            formData.color === option.value ? 'ring-2 ring-blue-500' : ''
                          }`}></div>
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {/* Custom color picker */}
                    {showColorPicker && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Персонализиран градиент</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">От цвят</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={customColor.from}
                                onChange={(e) => setCustomColor(prev => ({ ...prev, from: e.target.value }))}
                                className="w-8 h-8 rounded border border-gray-300"
                              />
                              <input
                                type="text"
                                value={customColor.from}
                                onChange={(e) => setCustomColor(prev => ({ ...prev, from: e.target.value }))}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">До цвят</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={customColor.to}
                                onChange={(e) => setCustomColor(prev => ({ ...prev, to: e.target.value }))}
                                className="w-8 h-8 rounded border border-gray-300"
                              />
                              <input
                                type="text"
                                value={customColor.to}
                                onChange={(e) => setCustomColor(prev => ({ ...prev, to: e.target.value }))}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        </div>
                        {/* Preview */}
                        <div className="mt-3">
                          <div 
                            className="w-full h-8 rounded"
                            style={{
                              background: `linear-gradient(to right, ${customColor.from}, ${customColor.to})`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">
                  Видим в навигацията
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingCategory ? 'Обнови' : 'Създай'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Потвърдете изтриването
            </h3>
            <p className="text-gray-600 mb-6">
              Сигурни ли сте, че искате да изтриете този навигационен елемент? Всички подкатегории също ще бъдат изтрити.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Отказ
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationManagement;