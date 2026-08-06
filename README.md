# Asad Nazarov — AI-консультант, лендинг

Личный лендинг: позиционирование, кейсы, отзывы и форма-заявка на платную консультацию ($100) с уведомлением в Telegram. RU/UZ.

## Стек

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + react-hook-form + zod. Без базы данных — заявки уходят напрямую в Telegram.

## Запуск локально

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Настройка Telegram-бота (обязательно для уведомлений о заявках)

1. В Telegram откройте **@BotFather**, отправьте `/newbot`, задайте имя и username бота.
2. Скопируйте выданный API-токен.
3. Напишите новому боту `/start` с личного аккаунта, который должен получать заявки.
4. Откройте в браузере `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id": ...}` — это ваш chat ID. Если ответ пустой — напишите `@userinfobot`, он пришлёт ваш numeric ID.
5. Заполните `.env.local`:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

Без этих переменных API-роут `/api/consultation` будет возвращать `502` при отправке формы (UI в этом случае показывает fallback-ссылку на Telegram).

## Деплой

1. Запушить репозиторий на GitHub.
2. Импортировать в [Vercel](https://vercel.com/new) — фреймворк определится автоматически.
3. В Project Settings → Environment Variables добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (для Production, Preview и Development).
4. Задеплоить, проверить форму на продакшен-URL — сообщение должно прийти в Telegram.
5. Когда домен куплен: Project Settings → Domains → добавить домен → прописать DNS у регистратора по инструкции Vercel. SSL выпустится автоматически.

## Структура

```
app/                  Next.js App Router: страницы, layout, API-роут
components/
  layout/             Header, Footer
  sections/           Hero, About, CaseStudies, Testimonials, Consultation
  forms/               ConsultationForm + поля
  ui/                  Button, Card, SectionHeading, LanguageSwitcher
  motion/              FadeIn / StaggerGroup обёртки для Framer Motion
lib/
  i18n/                Словари ru/uz, LanguageContext
  validation/          Zod-схема формы (общая для клиента и API)
  telegram.ts          Отправка уведомлений через Bot API
  constants.ts
types/                 Общие TypeScript-типы
```

Контент (био, кейсы, отзывы) — плейсхолдеры, отредактируйте под себя в `lib/i18n/dictionaries/ru.ts` и `uz.ts`.
