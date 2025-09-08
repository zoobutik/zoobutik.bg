/*
  # Добавяне на функционалности за потребители и бюлетин

  1. Нови таблици
    - `user_profiles` - Профили на потребители
    - `newsletter_subscribers` - Абонати за бюлетин
    - `discount_codes` - Кодове за отстъпка

  2. Промени в products таблицата
    - Добавяне на stock_quantity за наличност

  3. Сигурност
    - RLS политики за всички нови таблици
*/

-- Създаване на потребителски профили
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  newsletter_subscribed boolean DEFAULT false,
  discount_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Създаване на абонати за бюлетин
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id bigserial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  discount_code text,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Създаване на кодове за отстъпка
CREATE TABLE IF NOT EXISTS discount_codes (
  id bigserial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_percent integer NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Добавяне на колона за наличност в products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;
END $$;

-- Включване на RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Политики за потребителски профили
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Политики за бюлетин
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage newsletter subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Политики за кодове за отстъпка
CREATE POLICY "Admins can manage discount codes"
  ON discount_codes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Функция за генериране на код за отстъпка
CREATE OR REPLACE FUNCTION generate_discount_code()
RETURNS text AS $$
BEGIN
  RETURN 'NEWSLETTER' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Функция за автоматично създаване на код при абониране
CREATE OR REPLACE FUNCTION create_newsletter_discount()
RETURNS TRIGGER AS $$
DECLARE
  new_code text;
BEGIN
  -- Генериране на уникален код
  LOOP
    new_code := generate_discount_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM discount_codes WHERE code = new_code);
  END LOOP;
  
  -- Създаване на кода за отстъпка
  INSERT INTO discount_codes (code, discount_percent, expires_at)
  VALUES (new_code, 10, NOW() + INTERVAL '30 days');
  
  -- Обновяване на записа с кода
  NEW.discount_code := new_code;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Тригер за автоматично създаване на код при абониране
CREATE TRIGGER newsletter_discount_trigger
  BEFORE INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION create_newsletter_discount();

-- Тригер за обновяване на updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Обновяване на съществуващите продукти с наличност
UPDATE products SET stock_quantity = CASE 
  WHEN in_stock = true THEN 50 
  ELSE 0 
END WHERE stock_quantity = 0;