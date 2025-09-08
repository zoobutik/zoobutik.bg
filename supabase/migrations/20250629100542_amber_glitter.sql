/*
  # Добавяне на йерархична навигационна система

  1. Промени в categories таблицата
    - Добавяне на parent_id за подкатегории
    - Добавяне на sort_order за подреждане
    - Добавяне на is_visible за скриване/показване
    - Добавяне на navigation_type за различни типове навигация

  2. Нова таблица navigation_items
    - За по-гъвкава навигационна структура
    - Поддържа външни връзки и специални менюта
*/

-- Добавяне на нови колони към categories таблицата
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN parent_id bigint REFERENCES categories(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'is_visible'
  ) THEN
    ALTER TABLE categories ADD COLUMN is_visible boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'navigation_type'
  ) THEN
    ALTER TABLE categories ADD COLUMN navigation_type text DEFAULT 'category' CHECK (navigation_type IN ('category', 'link', 'dropdown'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'external_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN external_url text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'icon'
  ) THEN
    ALTER TABLE categories ADD COLUMN icon text;
  END IF;
END $$;

-- Обновяване на съществуващите категории с sort_order
UPDATE categories SET sort_order = id WHERE sort_order = 0;