import type { ConsultationSchema } from "@/lib/validation/consultationSchema";

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram env vars missing: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });

  if (!res.ok) {
    throw new Error(`Telegram API error: ${res.status}`);
  }

  return res.json();
}

const NEED_LABELS: Record<ConsultationSchema["need"], string> = {
  implementation: "Внедрение ИИ в компании",
  training: "Обучение команды",
  consultation: "Общая консультация",
  other: "Другое",
};

export function formatConsultationMessage(data: ConsultationSchema) {
  const lines = [
    "🆕 *Новая заявка на консультацию ($100)*",
    "",
    `👤 *Имя:* ${data.name}`,
    `📞 *Контакт:* ${data.contact}`,
  ];

  if (data.company) {
    lines.push(`🏢 *Компания:* ${data.company}`);
  }

  lines.push(
    `🎯 *Запрос:* ${NEED_LABELS[data.need]}`,
    `💰 *Бюджет:* ${data.budget}`,
    `💬 *Сообщение:* ${data.message}`,
    "",
    `🌐 *Язык формы:* ${data.locale.toUpperCase()}`
  );

  return lines.join("\n");
}
