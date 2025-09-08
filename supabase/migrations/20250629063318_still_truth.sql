/*
  # Създаване на начална схема за PetStore CMS

  1. Нови таблици
    - `categories` - Категории продукти
      - `id` (bigint, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `image` (text)
      - `count` (text)
      - `color` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `products` - Продукти
      - `id` (bigint, primary key)
      - `name` (text)
      - `brand` (text)
      - `price` (decimal)
      - `original_price` (decimal, nullable)
      - `rating` (decimal)
      - `reviews` (integer)
      - `image` (text)
      - `images` (text array, nullable)
      - `badge` (text, nullable)
      - `badge_color` (text, nullable)
      - `category_id` (bigint, foreign key)
      - `description` (text)
      - `features` (text array)
      - `in_stock` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders` - Поръчки
      - `id` (bigint, primary key)
      - `user_id` (uuid, nullable, foreign key to auth.users)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `shipping_address` (jsonb)
      - `items` (jsonb)
      - `total` (decimal)
      - `status` (text)
      - `payment_method` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `admin_users` - Администратори
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)

  2. Сигурност
    - Включване на RLS за всички таблици
    - Политики за четене на публични данни
    - Политики за администраторски достъп
*/

-- Създаване на категории
CREATE TABLE IF NOT EXISTS categories (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  count text NOT NULL DEFAULT '0 продукта',
  color text NOT NULL DEFAULT 'from-blue-400 to-purple-500',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Създаване на продукти
CREATE TABLE IF NOT EXISTS products (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  rating decimal(2,1) NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  image text NOT NULL,
  images text[],
  badge text,
  badge_color text,
  category_id bigint REFERENCES categories(id) ON DELETE CASCADE,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Създаване на поръчки
CREATE TABLE IF NOT EXISTS orders (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address jsonb NOT NULL,
  items jsonb NOT NULL,
  total decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Създаване на администратори
CREATE TABLE IF NOT EXISTS admin_users (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Включване на RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Политики за категории (публично четене)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are editable by admins"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Политики за продукти (публично четене)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products are editable by admins"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Политики за поръчки
CREATE POLICY "Orders are viewable by admins"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Orders can be created by anyone"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Orders are editable by admins"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Политики за администратори
CREATE POLICY "Admin users are viewable by admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Функция за автоматично обновяване на updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригери за автоматично обновяване на updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();