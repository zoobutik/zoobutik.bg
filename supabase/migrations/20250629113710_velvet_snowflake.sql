/*
  # Добавяне на описание към категориите

  1. Промени
    - Добавя колона `description` към таблицата `categories`
    - Позволява на администраторите да добавят описателен текст за всяка категория
    - Текстът ще се показва под заглавието на категорията
*/

-- Добавяне на колона за описание
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'description'
  ) THEN
    ALTER TABLE categories ADD COLUMN description text;
  END IF;
END $$;