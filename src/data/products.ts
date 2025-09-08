import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Храна за кучета',
    slug: 'dog-food',
    image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: '250+ продукта',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 2,
    name: 'Храна за котки',
    slug: 'cat-food',
    image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: '180+ продукта',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 3,
    name: 'Играчки',
    slug: 'toys',
    image: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: '120+ продукта',
    color: 'from-green-400 to-blue-500'
  },
  {
    id: 4,
    name: 'Аксесоари',
    slug: 'accessories',
    image: 'https://images.pexels.com/photos/1390784/pexels-photo-1390784.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: '90+ продукта',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 5,
    name: 'Грижа и хигиена',
    slug: 'care-hygiene',
    image: 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: '75+ продукта',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    id: 6,
    name: 'Легла и къщички',
    slug: 'beds-houses',
    image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: '60+ продукта',
    color: 'from-indigo-400 to-purple-500'
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Premium суха храна за кучета',
    brand: 'Royal Canin',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    badge: 'Промоция',
    badgeColor: 'bg-red-500',
    category: 'dog-food',
    description: 'Висококачествена суха храна за възрастни кучета от всички породи. Съдържа всички необходими витамини и минерали за здравословен живот.',
    features: [
      'Богата на протеини',
      'Без изкуствени оцветители',
      'Подкрепя имунната система',
      'За кучета над 1 година'
    ],
    inStock: true
  },
  {
    id: 2,
    name: 'Интерактивна играчка за котки',
    brand: 'PetSafe',
    price: 45.99,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    badge: 'Най-продавано',
    badgeColor: 'bg-green-500',
    category: 'toys',
    description: 'Интерактивна играчка, която стимулира естествените ловни инстинкти на котката. Автоматично движение привлича вниманието.',
    features: [
      'Автоматично движение',
      'Батерии в комплекта',
      'Безопасни материали',
      'Стимулира активността'
    ],
    inStock: true
  },
  {
    id: 3,
    name: 'Ортопедично легло за кучета',
    brand: 'ComfortPet',
    price: 129.99,
    rating: 4.7,
    reviews: 67,
    image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    badge: 'Ново',
    badgeColor: 'bg-blue-500',
    category: 'beds-houses',
    description: 'Ортопедично легло с мемори пяна, което осигурява максимален комфорт за кучета с проблеми със ставите.',
    features: [
      'Мемори пяна',
      'Сваляща се калъфка',
      'Водоустойчиво дъно',
      'Различни размери'
    ],
    inStock: true
  },
  {
    id: 4,
    name: 'Натурални лакомства за котки',
    brand: 'NaturalTreats',
    price: 24.99,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    badge: 'Органично',
    badgeColor: 'bg-green-600',
    category: 'cat-food',
    description: '100% натурални лакомства за котки, направени от пресна риба. Без консерванти и изкуствени добавки.',
    features: [
      '100% натурални',
      'Богати на протеини',
      'Без консерванти',
      'Различни вкусове'
    ],
    inStock: true
  },
  {
    id: 5,
    name: 'Автоматична поилка за домашни любимци',
    brand: 'AquaPet',
    price: 67.99,
    rating: 4.5,
    reviews: 92,
    image: 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'accessories',
    description: 'Автоматична поилка с филтър, която осигурява постоянно прясна вода за вашия домашен любимец.',
    features: [
      'Филтър за вода',
      'Тих мотор',
      'Лесно почистване',
      'Капацитет 2.5л'
    ],
    inStock: true
  },
  {
    id: 6,
    name: 'Шампоан за кучета с чувствителна кожа',
    brand: 'GentleCare',
    price: 32.99,
    rating: 4.4,
    reviews: 78,
    image: 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'care-hygiene',
    description: 'Деликатен шампоан за кучета с чувствителна кожа. Съдържа натурални екстракти от лайка и алое вера.',
    features: [
      'За чувствителна кожа',
      'Натурални екстракти',
      'Хипоалергенен',
      'pH балансиран'
    ],
    inStock: true
  },
  {
    id: 7,
    name: 'Интерактивна топка за кучета',
    brand: 'PlayTime',
    price: 28.99,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'toys',
    description: 'Интерактивна топка, която се движи сама и издава звуци. Перфектна за активни кучета.',
    features: [
      'Автоматично движение',
      'Звукови ефекти',
      'Устойчива на захапване',
      'Различни режими'
    ],
    inStock: true
  },
  {
    id: 8,
    name: 'Премиум храна за котки с пиле',
    brand: 'FelineChoice',
    price: 54.99,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'cat-food',
    description: 'Висококачествена суха храна за котки с истинско пилешко месо като първа съставка.',
    features: [
      'Истинско пилешко месо',
      'Без зърнени култури',
      'Богата на протеини',
      'За всички възрасти'
    ],
    inStock: true
  }
];