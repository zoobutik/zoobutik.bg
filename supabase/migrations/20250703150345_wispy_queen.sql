/*
  # Поправка на RLS политиките за newsletter функционалност

  1. Промени
    - Поправка на RLS политиките за discount_codes таблицата
    - Добавяне на функция за автоматично създаване на профил при регистрация
    - Поправка на newsletter trigger функцията

  2. Сигурност
    - Позволяване на публичен достъп за четене на активни кодове за отстъпка
    - Подобряване на newsletter subscription процеса
*/

-- Поправка на RLS политиките за discount_codes
DROP POLICY IF EXISTS "Admins can manage discount codes" ON discount_codes;

-- Нова политика за четене на активни кодове за отстъпка
CREATE POLICY "Anyone can read active discount codes"
  ON discount_codes
  FOR SELECT
  TO public
  USING (is_active = true);

-- Политика за администраторско управление
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

-- Политика за системно създаване на кодове (за newsletter trigger)
CREATE POLICY "System can create discount codes"
  ON discount_codes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Поправка на newsletter trigger функцията
CREATE OR REPLACE FUNCTION create_newsletter_discount()
RETURNS TRIGGER AS $$
DECLARE
  new_code text;
  user_profile_exists boolean;
BEGIN
  -- Генериране на уникален код
  LOOP
    new_code := 'NEWSLETTER' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM discount_codes WHERE code = new_code);
  END LOOP;
  
  -- Създаване на кода за отстъпка
  INSERT INTO discount_codes (code, discount_percent, expires_at)
  VALUES (new_code, 10, NOW() + INTERVAL '30 days');
  
  -- Обновяване на записа с кода
  NEW.discount_code := new_code;
  
  -- Проверка дали съществува потребителски профил за този имейл
  SELECT EXISTS(
    SELECT 1 FROM auth.users 
    WHERE email = NEW.email
  ) INTO user_profile_exists;
  
  -- Ако потребителят съществува, обновяваме неговия профил с кода за отстъпка
  IF user_profile_exists THEN
    UPDATE user_profiles 
    SET discount_code = new_code 
    WHERE id = (
      SELECT id FROM auth.users WHERE email = NEW.email LIMIT 1
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция за автоматично създаване на потребителски профил
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, newsletter_subscribed)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Тригер за автоматично създаване на профил при регистрация
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();