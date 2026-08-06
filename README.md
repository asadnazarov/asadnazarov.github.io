# Asad Nazarov — AI-консультант, лендинг

Личный лендинг: позиционирование, кейсы, отзывы и форма-заявка на платную консультацию ($100) с уведомлением в Telegram. RU/UZ.

## Стек

Next.js (static export) + TypeScript + Tailwind CSS v4 + Framer Motion + react-hook-form + zod. Сайт полностью статический — хостится на **GitHub Pages**. Уведомления в Telegram шлёт **Supabase Edge Function** (Deno), которая прячет токен бота на сервере — сайт его никогда не видит.

## Запуск локально

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

`npm run build` собирает статику в `out/` (то, что публикуется на GitHub Pages).

## Настройка Telegram-бота

1. В Telegram откройте **@BotFather**, отправьте `/newbot`, задайте имя и username бота.
2. Скопируйте выданный API-токен.
3. Напишите новому боту `/start` с личного аккаунта, который должен получать заявки.
4. Откройте в браузере `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id": ...}` — это ваш chat ID. Если ответ пустой — напишите `@userinfobot`, он пришлёт ваш numeric ID.
5. Задайте секреты в Supabase (не в этом репозитории — токен туда не попадает):

```bash
npx supabase secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... --project-ref cukgjtedqppxjnoxnhtu
```

Без этих секретов Edge Function будет возвращать `502` при отправке формы (UI в этом случае показывает fallback-ссылку на Telegram).

## Как это работает

```
Браузер (GitHub Pages, статика)
   │  POST /functions/v1/consultation  (Authorization: anon key — публичный, это нормально)
   ▼
Supabase Edge Function "consultation"
   │  валидирует данные, читает TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID из секретов
   ▼
Telegram Bot API → сообщение в личный чат
```

Redeploy функции при изменении кода:

```bash
npx supabase functions deploy consultation --project-ref cukgjtedqppxjnoxnhtu
```

## Деплой сайта

Пуш в `main` автоматически собирает и публикует сайт на GitHub Pages через `.github/workflows/deploy.yml` — ничего вручную запускать не нужно.

Репозиторий назван `asadnazarov.github.io` — это специальное имя GitHub, при котором сайт раздаётся с корня `https://asadnazarov.github.io/`, без под-пути. Когда купите домен: Settings → Pages → Custom domain → впишите домен → пропишите DNS у регистратора (A-записи на IP GitHub Pages или CNAME на `asadnazarov.github.io`) — SSL выпустится автоматически.

## Структура

```
app/                  Next.js App Router: страницы, layout, статический экспорт
components/
  layout/             Header, Footer
  sections/           Hero, About, CaseStudies, Testimonials, Consultation
  forms/               ConsultationForm + поля
  ui/                  Button, Card, SectionHeading, LanguageSwitcher
  motion/              FadeIn / StaggerGroup обёртки для Framer Motion
lib/
  i18n/                Словари ru/uz, LanguageContext
  validation/          Zod-схема формы (используется на клиенте и в Edge Function)
  constants.ts         Supabase URL/anon key (публичные, не секреты)
supabase/
  functions/consultation/  Edge Function — отправка в Telegram
types/                 Общие TypeScript-типы
.github/workflows/     Автодеплой на GitHub Pages
```

Контент (био, кейсы, отзывы) — плейсхолдеры, отредактируйте под себя в `lib/i18n/dictionaries/ru.ts` и `uz.ts`.
