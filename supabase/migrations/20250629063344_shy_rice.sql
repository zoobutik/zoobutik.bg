/*
  # Вмъкване на примерни данни

  1. Категории
    - Храна за кучета
    - Храна за котки
    - Играчки
    - Аксесоари
    - Грижа и хигиена
    - Легла и къщички

  2. Продукти
    - По няколко продукта за всяка категория

  3. Администратор
    - Примерен администраторски потребител
*/

-- Вмъкване на категории
INSERT INTO categories (name, slug, image, count, color) VALUES
('Храна за кучета', 'dog-food', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400', '250+ продукта', 'from-orange-400 to-red-500'),
('Храна за котки', 'cat-food', 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400', '180+ продукта', 'from-purple-400 to-pink-500'),
('Играчки', 'toys', 'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400', '120+ продукта', 'from-green-400 to-blue-500'),
('Аксесоари', 'accessories', 'https://images.pexels.com/photos/1390784/pexels-photo-1390784.jpeg?auto=compress&cs=tinysrgb&w=400', '90+ продукта', 'from-yellow-400 to-orange-500'),
('Грижа и хигиена', 'care-hygiene', 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400', '75+ продукта', 'from-teal-400 to-cyan-500'),
('Легла и къщички', 'beds-houses', 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400', '60+ продукта', 'from-indigo-400 to-purple-500');

-- Вмъкване на продукти
INSERT INTO products (name, brand, price, original_price, rating, reviews, image, images, badge, badge_color, category_id, description, features, in_stock) VALUES
(
  'Premium суха храна за кучета',
  'Royal Canin',
  89.99,
  109.99,
  4.8,
  124,
  'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'],
  'Промоция',
  'bg-red-500',
  1,
  'Висококачествена суха храна за възрастни кучета от всички породи. Съдържа всички необходими витамини и минерали за здравословен живот.',
  ARRAY['Богата на протеини', 'Без изкуствени оцветители', 'Подкрепя имунната система', 'За кучета над 1 година'],
  true
),
(
  'Интерактивна играчка за котки',
  'PetSafe',
  45.99,
  NULL,
  4.9,
  89,
  'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=600'],
  'Най-продавано',
  'bg-green-500',
  3,
  'Интерактивна играчка, която стимулира естествените ловни инстинкти на котката. Автоматично движение привлича вниманието.',
  ARRAY['Автоматично движение', 'Батерии в комплекта', 'Безопасни материали', 'Стимулира активността'],
  true
),
(
  'Ортопедично легло за кучета',
  'ComfortPet',
  129.99,
  NULL,
  4.7,
  67,
  'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=600'],
  'Ново',
  'bg-blue-500',
  6,
  'Ортопедично легло с мемори пяна, което осигурява максимален комфорт за кучета с проблеми със ставите.',
  ARRAY['Мемори пяна', 'Сваляща се калъфка', 'Водоустойчиво дъно', 'Различни размери'],
  true
),
(
  'Натурални лакомства за котки',
  'NaturalTreats',
  24.99,
  NULL,
  4.6,
  156,
  'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600'],
  'Органично',
  'bg-green-600',
  2,
  '100% натурални лакомства за котки, направени от пресна риба. Без консерванти и изкуствени добавки.',
  ARRAY['100% натурални', 'Богати на протеини', 'Без консерванти', 'Различни вкусове'],
  true
),
(
  'Автоматична поилка за домашни любимци',
  'AquaPet',
  67.99,
  NULL,
  4.5,
  92,
  'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=600'],
  NULL,
  NULL,
  4,
  'Автоматична поилка с филтър, която осигурява постоянно прясна вода за вашия домашен любимец.',
  ARRAY['Филтър за вода', 'Тих мотор', 'Лесно почистване', 'Капацитет 2.5л'],
  true
),
(
  'Шампоан за кучета с чувствителна кожа',
  'GentleCare',
  32.99,
  NULL,
  4.4,
  78,
  'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=600'],
  NULL,
  NULL,
  5,
  'Деликатен шампоан за кучета с чувствителна кожа. Съдържа натурални екстракти от лайка и алое вера.',
  ARRAY['За чувствителна кожа', 'Натурални екстракти', 'Хипоалергенен', 'pH балансиран'],
  true
);