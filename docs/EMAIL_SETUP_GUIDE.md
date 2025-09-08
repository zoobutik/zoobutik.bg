# Ръководство за настройка на изпращане на имейли

## Преглед

Вашият сайт има готови функции за изпращане на имейли при:
1. **Регистрация на нов потребител** - приветствен имейл
2. **Абониране за бюлетин** - имейл с код за отстъпка

## Къде са имейл функциите

Имейл функциите са в папката `supabase/functions/`:
- `send-welcome-email/index.ts` - за приветствени имейли
- `send-newsletter-email/index.ts` - за бюлетин имейли

## Как да настроите изпращането на имейли

### Опция 1: SendGrid (Препоръчително)

1. **Създайте SendGrid акаунт**
   - Отидете на https://sendgrid.com
   - Регистрирайте се за безплатен акаунт (100 имейла/ден)

2. **Получете API ключ**
   - В SendGrid Dashboard → Settings → API Keys
   - Създайте нов API ключ с "Full Access"
   - Запазете ключа (ще ви трябва)

3. **Настройте домейна си**
   - В SendGrid → Settings → Sender Authentication
   - Добавете вашия домейн (например petstore.bg)
   - Следвайте инструкциите за DNS записи

4. **Обновете кода**

В `supabase/functions/send-welcome-email/index.ts`, заменете коментираната част:

```typescript
// Заменете това:
// Example with SendGrid:
// const response = await fetch('https://api.sendgrid.com/v3/mail/send', {

// С това:
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email }] }],
    from: { email: 'noreply@petstore.bg', name: 'Bat Petko Store' },
    subject: emailContent.subject,
    content: [{ type: 'text/html', value: emailContent.html }]
  })
})

if (!response.ok) {
  throw new Error('Failed to send email');
}
```

5. **Добавете environment variables**

В Supabase Dashboard → Project Settings → Edge Functions → Environment Variables:
- `SENDGRID_API_KEY` = вашият SendGrid API ключ

### Опция 2: Mailgun

1. **Създайте Mailgun акаунт**
   - https://mailgun.com
   - Безплатен план: 5000 имейла/месец

2. **Получете API данни**
   - API Key от Settings → API Keys
   - Domain от Domains

3. **Обновете кода**

```typescript
const response = await fetch(`https://api.mailgun.net/v3/${Deno.env.get('MAILGUN_DOMAIN')}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${Deno.env.get('MAILGUN_API_KEY')}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    from: 'Bat Petko Store <noreply@petstore.bg>',
    to: email,
    subject: emailContent.subject,
    html: emailContent.html
  })
})
```

4. **Environment variables**
   - `MAILGUN_API_KEY` = вашият Mailgun API ключ
   - `MAILGUN_DOMAIN` = вашият Mailgun домейн

### Опция 3: Resend (Модерен избор)

1. **Създайте Resend акаунт**
   - https://resend.com
   - Безплатен план: 3000 имейла/месец

2. **Получете API ключ**
   - Dashboard → API Keys → Create API Key

3. **Обновете кода**

```typescript
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Bat Petko Store <noreply@petstore.bg>',
    to: [email],
    subject: emailContent.subject,
    html: emailContent.html
  })
})
```

## Настройка на имейл адреса

### 1. Променете "from" адреса

Във всички имейл функции, заменете:
```typescript
from: { email: 'noreply@petstore.bg', name: 'Bat Petko Store' }
```

С вашия домейн:
```typescript
from: { email: 'noreply@yourdomain.com', name: 'Your Store Name' }
```

### 2. Обновете контактните данни

В имейл шаблоните, заменете:
- `info@petstore.bg` с вашия имейл
- `0888 123 456` с вашия телефон
- Адреса и други данни

### 3. Персонализирайте съдържанието

Редактирайте HTML шаблоните в:
- `emailContent.html` в двете функции
- Добавете вашето лого
- Променете цветовете и стила
- Обновете текстовете

## Тестване

1. **Локално тестване**
   ```bash
   # В терминала
   supabase functions serve send-welcome-email --env-file .env
   ```

2. **Тест заявка**
   ```bash
   curl -X POST 'http://localhost:54321/functions/v1/send-welcome-email' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"email":"test@example.com","firstName":"Test"}'
   ```

## Важни бележки

### Сигурност
- Никога не споделяйте API ключовете публично
- Използвайте environment variables
- Настройте SPF/DKIM записи за по-добра доставимост

### Доставимост
- Използвайте верифициран домейн
- Избягвайте spam думи в subject/content
- Добавете unsubscribe линк
- Мониторирайте bounce rate

### Законови изисквания
- Добавете GDPR съгласие
- Включете unsubscribe опция
- Добавете физически адрес в footer-а

## Поддръжка

Ако имате проблеми:
1. Проверете Supabase logs в Dashboard → Edge Functions
2. Проверете API ключовете и environment variables
3. Тествайте с различни имейл адреси
4. Проверете spam папката

## Алтернативи

Ако не искате да настройвате имейл сервиз веднага:
1. Функциите ще логват имейлите в конзолата
2. Можете да видите съдържанието в Supabase logs
3. Сайтът ще работи нормално без изпращане на имейли