import React, { useState, useEffect } from 'react';
import DualPrice from '../components/DualPrice';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useProducts, useCategories } from '../hooks/useSupabase';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { currencySymbol } = useCurrency();
  const product = products.find(p => p.id === parseInt(id || '0'));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const { dispatch } = useCart();
  const { state: wishlistState, dispatch: wishlistDispatch } = useWishlist();

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;
      
      const allImages = [product.image, ...(product.images || [])].filter(Boolean);
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImage((prev) => (prev + 1) % allImages.length);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (showImageModal) {
          setShowImageModal(false);
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, showImageModal]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Продуктът не е намерен</h2>
          <Link to="/products" className="text-blue-500 hover:underline">
            Върни се към продуктите
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.original_price,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images: product.images,
      badge: product.badge,
      badgeColor: product.badge_color,
      category: product.category_id.toString(),
      description: product.description,
      features: product.features,
      inStock: product.in_stock,
      stockQuantity: product.stock_quantity
    };

    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_ITEM', payload: cartProduct });
    }
  };

  const toggleWishlist = () => {
    const isInWishlist = wishlistState.items.some(item => item.id === product.id);
    
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
    } else {
      const wishlistProduct = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.original_price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images: product.images,
        badge: product.badge,
        badgeColor: product.badge_color,
        category: product.category_id.toString(),
        description: product.description,
        features: product.features,
        inStock: product.in_stock,
        stockQuantity: product.stock_quantity
      };
      wishlistDispatch({ type: 'ADD_ITEM', payload: wishlistProduct });
    }
  };

  const isInWishlist = wishlistState.items.some(item => item.id === product.id);

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return { text: 'Изчерпан', color: 'text-red-600' };
    } else if (stockQuantity <= 5) {
      return { text: 'Ограничена наличност', color: 'text-orange-600' };
    } else {
      return { text: 'В наличност', color: 'text-green-600' };
    }
  };

  const stockStatus = getStockStatus(product.stock_quantity || 0);

  const relatedProducts = products.filter(p => 
    p.category_id === product.category_id && p.id !== product.id
  ).slice(0, 4);

  const category = categories.find(c => c.id === product.category_id);

  // Създаваме масив от всички изображения (основно + допълнителни)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openImageModal = (index: number) => {
    setSelectedImage(index);
    setShowImageModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-blue-500">Начало</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-blue-500">Продукти</Link></li>
            {category && (
              <>
                <li>/</li>
                <li><Link to={`/category/${category.slug}`} className="hover:text-blue-500">{category.name}</Link></li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with Navigation */}
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => openImageModal(selectedImage)}
              />
              
              {/* Navigation Arrows - Enhanced visibility */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-sm border-2 border-white border-opacity-20"
                    title="Предишна снимка (←)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-sm border-2 border-white border-opacity-20"
                    title="Следваща снимка (→)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <div className={`absolute top-4 left-4 ${product.badge_color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {product.badge}
                </div>
              )}

              {/* Keyboard navigation hint */}
              {allImages.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  ← → ESC
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="mb-4">
                <span className={`text-lg font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-800">
                <DualPrice amount={product.price} />
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-500 line-through">
                <DualPrice amount={product.original_price} />
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Характеристики:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {product.stock_quantity > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Количество:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity || 1, quantity + 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    (макс. {product.stock_quantity})
                  </span>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.stock_quantity === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {product.stock_quantity === 0 ? 'Изчерпан' : 'Добави в количката'}
                  </span>
                </button>
                <button 
                  onClick={toggleWishlist}
                  className={`w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center transition-colors ${
                    isInWishlist 
                      ? 'bg-red-50 border-red-300 text-red-500' 
                      : 'hover:bg-red-50 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Безплатна доставка при поръчки над 50 лв</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Гаранция за качество</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-orange-500" />
                <span className="text-gray-600">14 дни за връщане</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Свързани продукти</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedProduct.badge && (
                      <div className={`absolute top-3 left-3 ${relatedProduct.badge_color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                        <DualPrice amount={relatedProduct.price} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{relatedProduct.brand}</div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-xl font-bold text-gray-800">
                      <DualPrice amount={relatedProduct.price} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white z-10 backdrop-blur-sm border-2 border-white border-opacity-20"
              title="Затвори (ESC)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white z-10 backdrop-blur-sm border-2 border-white border-opacity-20"
                  title="Предишна снимка (←)"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white z-10 backdrop-blur-sm border-2 border-white border-opacity-20"
                  title="Следваща снимка (→)"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={allImages[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter and Keyboard Hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              {allImages.length > 1 && (
                <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}
              <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                ← → ESC
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;