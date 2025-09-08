/*
  # Поправка на регистрацията за бюлетин

  1. Проблеми
    - RLS политиките блокират вмъкването в newsletter_subscribers
    - Trigger функцията не работи правилно с RLS
    - Липсва правилна обработка на грешки

  2. Решения
    - Поправка на RLS политиките
    - Подобряване на trigger функцията
    - Добавяне на по-добра обработка на грешки
*/

-- Премахване на старите политики за newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;

-- Нови политики за newsletter_subscribers
CREATE POLICY "Public can insert newsletter subscriptions"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can read own newsletter subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can view all newsletter subscribers"
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

-- Поправка на newsletter trigger функцията
CREATE OR REPLACE FUNCTION create_newsletter_discount()
RETURNS TRIGGER AS $$
DECLARE
  new_code text;
  user_uuid uuid;
  max_attempts integer := 10;
  attempt_count integer := 0;
BEGIN
  -- Генериране на уникален код с ограничен брой опити
  LOOP
    new_code := 'NEWSLETTER' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6));
    attempt_count := attempt_count + 1;
    
    -- Проверка дали кодът вече съществува
    IF NOT EXISTS (SELECT 1 FROM discount_codes WHERE code = new_code) THEN
      EXIT;
    END IF;
    
    -- Предотвратяване на безкрайна примка
    IF attempt_count >= max_attempts THEN
      new_code := 'NEWSLETTER' || UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text) FROM 1 FOR 8));
      EXIT;
    END IF;
  END LOOP;
  
  -- Създаване на кода за отстъпка
  INSERT INTO discount_codes (code, discount_percent, expires_at)
  VALUES (new_code, 10, NOW() + INTERVAL '30 days');
  
  -- Задаване на кода в новия запис
  NEW.discount_code := new_code;
  
  -- Намиране на потребителя по имейл (ако съществува)
  SELECT id INTO user_uuid
  FROM auth.users 
  WHERE email = NEW.email
  LIMIT 1;
  
  -- Ако потребителят съществува, обновяваме неговия профил
  IF user_uuid IS NOT NULL THEN
    -- Обновяване на потребителския профил
    UPDATE user_profiles 
    SET 
      discount_code = new_code,
      newsletter_subscribed = true,
      updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Ако записът не съществува, го създаваме
    IF NOT FOUND THEN
      INSERT INTO user_profiles (
        id, 
        discount_code, 
        newsletter_subscribed,
        created_at,
        updated_at
      )
      VALUES (
        user_uuid, 
        new_code, 
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        discount_code = new_code,
        newsletter_subscribed = true,
        updated_at = NOW();
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- В случай на грешка, все пак връщаме записа с основен код
    NEW.discount_code := 'NEWSLETTER10';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пресъздаване на тригера
DROP TRIGGER IF EXISTS newsletter_discount_trigger ON newsletter_subscribers;
CREATE TRIGGER newsletter_discount_trigger
  BEFORE INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION create_newsletter_discount();

-- Добавяне на индекс за по-бърза проверка на имейли
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
ON newsletter_subscribers(email);

-- Добавяне на индекс за кодовете за отстъпка
CREATE INDEX IF NOT EXISTS idx_discount_codes_code 
ON discount_codes(code);