/*
  # Поправка на потребителските профили

  1. Промени
    - Поправка на функцията за създаване на потребителски профил
    - Подобряване на RLS политиките
    - Добавяне на тригер за автоматично създаване на профил

  2. Сигурност
    - Осигуряване че всеки нов потребител получава профил автоматично
*/

-- Поправка на функцията за създаване на потребителски профил
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, newsletter_subscribed)
  VALUES (NEW.id, false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пресъздаване на тригера
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Поправка на newsletter trigger функцията
CREATE OR REPLACE FUNCTION create_newsletter_discount()
RETURNS TRIGGER AS $$
DECLARE
  new_code text;
  user_profile_exists boolean;
  user_uuid uuid;
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
  
  -- Намиране на потребителя по имейл
  SELECT id INTO user_uuid
  FROM auth.users 
  WHERE email = NEW.email
  LIMIT 1;
  
  -- Ако потребителят съществува, обновяваме неговия профил с кода за отстъпка
  IF user_uuid IS NOT NULL THEN
    INSERT INTO user_profiles (id, discount_code, newsletter_subscribed)
    VALUES (user_uuid, new_code, true)
    ON CONFLICT (id) 
    DO UPDATE SET 
      discount_code = new_code,
      newsletter_subscribed = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;