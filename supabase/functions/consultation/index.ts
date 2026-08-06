// Supabase Edge Function: receives the consultation form submission and
// forwards it to Telegram. Keeps TELEGRAM_BOT_TOKEN server-side (Supabase
// secret) — the static site never sees it.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Need = "implementation" | "training" | "consultation" | "other";

interface ConsultationPayload {
  name: string;
  contact: string;
  company?: string;
  need: Need;
  budget: string;
  message: string;
  locale: "ru" | "uz";
}

const NEED_LABELS: Record<Need, string> = {
  implementation: "Внедрение ИИ в компании",
  training: "Обучение команды",
  consultation: "Общая консультация",
  other: "Другое",
};

const NEED_VALUES = new Set<Need>(["implementation", "training", "consultation", "other"]);

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function validate(data: Record<string, unknown>): { ok: true; value: ConsultationPayload } | { ok: false; errors: { field: string; message: string }[] } {
  const errors: { field: string; message: string }[] = [];

  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (name.length < 2) errors.push({ field: "name", message: "nameRequired" });

  const contact = typeof data.contact === "string" ? data.contact.trim() : "";
  if (contact.length < 3) errors.push({ field: "contact", message: "contactRequired" });

  const company = typeof data.company === "string" ? data.company.trim() : undefined;

  const need = typeof data.need === "string" ? data.need : "";
  if (!NEED_VALUES.has(need as Need)) errors.push({ field: "need", message: "needRequired" });

  const budget = typeof data.budget === "string" ? data.budget.trim() : "";
  if (budget.length < 1) errors.push({ field: "budget", message: "budgetRequired" });

  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (message.length < 10) errors.push({ field: "message", message: "messageRequired" });

  const locale = data.locale === "uz" ? "uz" : "ru";

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { name, contact, company, need: need as Need, budget, message, locale },
  };
}

function formatMessage(data: ConsultationPayload) {
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

async function sendTelegramMessage(text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    throw new Error("Telegram env vars missing: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error: ${res.status} ${body}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const result = validate(body);
  if (!result.ok) {
    return json({ ok: false, errors: result.errors }, 400);
  }

  try {
    await sendTelegramMessage(formatMessage(result.value));
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return json({ ok: false, error: "telegram_failed" }, 502);
  }
});
