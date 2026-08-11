// Supabase Edge Function: receives the consultation form submission and
// forwards it to Telegram. Keeps TELEGRAM_BOT_TOKEN server-side (Supabase
// secret) — the static site never sees it.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Role = "owner" | "executive" | "manager" | "operations" | "technical" | "sales" | "marketing" | "finance" | "other";
type CompanySize = "solo" | "2-10" | "11-50" | "51-200" | "200-plus";
type AnnualRevenue = "under-100k" | "100k-500k" | "500k-1m" | "1m-2m" | "over-2m";
type ProjectBudget = "under-5k" | "5k-10k" | "10k-50k" | "over-50k";
type Interest = "leads_sales" | "customer_support" | "internal_ops" | "data_reporting" | "content_marketing" | "not_sure";

interface ConsultationPayload {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyWebsite?: string;
  role: Role;
  companySize: CompanySize;
  annualRevenue: AnnualRevenue;
  projectBudget: ProjectBudget;
  howCanWeHelp: string;
  interests: Interest[];
  additionalInfo?: string;
  locale: "ru" | "uz";
}

const ROLE_VALUES = new Set<Role>([
  "owner", "executive", "manager", "operations", "technical", "sales", "marketing", "finance", "other",
]);
const COMPANY_SIZE_VALUES = new Set<CompanySize>(["solo", "2-10", "11-50", "51-200", "200-plus"]);
const REVENUE_VALUES = new Set<AnnualRevenue>(["under-100k", "100k-500k", "500k-1m", "1m-2m", "over-2m"]);
const BUDGET_VALUES = new Set<ProjectBudget>(["under-5k", "5k-10k", "10k-50k", "over-50k"]);
const INTEREST_VALUES = new Set<Interest>([
  "leads_sales", "customer_support", "internal_ops", "data_reporting", "content_marketing", "not_sure",
]);

const ROLE_LABELS: Record<Role, string> = {
  owner: "Владелец", executive: "Руководитель", manager: "Менеджер", operations: "Операции",
  technical: "Технический специалист", sales: "Продажи", marketing: "Маркетинг", finance: "Финансы", other: "Другое",
};
const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  solo: "Только я / фрилансер", "2-10": "2–10 сотрудников", "11-50": "11–50 сотрудников",
  "51-200": "51–200 сотрудников", "200-plus": "200+ сотрудников",
};
const REVENUE_LABELS: Record<AnnualRevenue, string> = {
  "under-100k": "Менее $100 000", "100k-500k": "$100 000–500 000", "500k-1m": "$500 000–1 000 000",
  "1m-2m": "$1–2 млн", "over-2m": "Более $2 млн",
};
const BUDGET_LABELS: Record<ProjectBudget, string> = {
  "under-5k": "Менее $5 000", "5k-10k": "$5 000–10 000", "10k-50k": "$10 000–50 000", "over-50k": "Более $50 000",
};
const INTEREST_LABELS: Record<Interest, string> = {
  leads_sales: "Привлечение клиентов и продажи", customer_support: "Поддержка клиентов",
  internal_ops: "Внутренние процессы", data_reporting: "Обработка данных и отчётность",
  content_marketing: "Контент и маркетинг", not_sure: "Пока не знаю",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function validate(
  data: Record<string, unknown>
): { ok: true; value: ConsultationPayload } | { ok: false; errors: { field: string; message: string }[] } {
  const errors: { field: string; message: string }[] = [];

  const firstName = typeof data.firstName === "string" ? data.firstName.trim() : "";
  if (firstName.length < 2) errors.push({ field: "firstName", message: "firstNameRequired" });

  const lastName = typeof data.lastName === "string" ? data.lastName.trim() : "";
  if (lastName.length < 2) errors.push({ field: "lastName", message: "lastNameRequired" });

  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ field: "email", message: "emailInvalid" });

  const companyName = typeof data.companyName === "string" ? data.companyName.trim() : "";
  if (companyName.length < 2) errors.push({ field: "companyName", message: "companyNameRequired" });

  const companyWebsiteRaw = typeof data.companyWebsite === "string" ? data.companyWebsite.trim() : "";
  const companyWebsite = companyWebsiteRaw || undefined;

  const role = typeof data.role === "string" ? (data.role as Role) : ("" as Role);
  if (!ROLE_VALUES.has(role)) errors.push({ field: "role", message: "roleRequired" });

  const companySize = typeof data.companySize === "string" ? (data.companySize as CompanySize) : ("" as CompanySize);
  if (!COMPANY_SIZE_VALUES.has(companySize)) errors.push({ field: "companySize", message: "companySizeRequired" });

  const annualRevenue =
    typeof data.annualRevenue === "string" ? (data.annualRevenue as AnnualRevenue) : ("" as AnnualRevenue);
  if (!REVENUE_VALUES.has(annualRevenue)) errors.push({ field: "annualRevenue", message: "annualRevenueRequired" });

  const projectBudget =
    typeof data.projectBudget === "string" ? (data.projectBudget as ProjectBudget) : ("" as ProjectBudget);
  if (!BUDGET_VALUES.has(projectBudget)) errors.push({ field: "projectBudget", message: "projectBudgetRequired" });

  const howCanWeHelp = typeof data.howCanWeHelp === "string" ? data.howCanWeHelp.trim() : "";
  if (howCanWeHelp.length < 10) errors.push({ field: "howCanWeHelp", message: "howCanWeHelpRequired" });

  const interestsRaw = Array.isArray(data.interests) ? data.interests : [];
  const interests = interestsRaw.filter(
    (v): v is Interest => typeof v === "string" && INTEREST_VALUES.has(v as Interest)
  );
  if (interests.length < 1) errors.push({ field: "interests", message: "interestsRequired" });

  const additionalInfo = typeof data.additionalInfo === "string" ? data.additionalInfo.trim() || undefined : undefined;

  const locale = data.locale === "uz" ? "uz" : "ru";

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      firstName, lastName, email, companyName, companyWebsite, role, companySize,
      annualRevenue, projectBudget, howCanWeHelp, interests, additionalInfo, locale,
    },
  };
}

function formatMessage(data: ConsultationPayload) {
  // Every field from the form is always listed, in the same order as the
  // form itself, so nothing is ever silently skipped. Empty optional
  // fields show "—" instead of being omitted.
  const lines = [
    "🆕 *Новая заявка на консультацию ($100)*",
    "",
    `👤 *Имя:* ${data.firstName} ${data.lastName}`,
    `📧 *Email:* ${data.email}`,
    `🏢 *Компания:* ${data.companyName}`,
    `🌐 *Сайт компании:* ${data.companyWebsite || "—"}`,
    `👔 *Роль:* ${ROLE_LABELS[data.role]}`,
    `👥 *Размер компании:* ${COMPANY_SIZE_LABELS[data.companySize]}`,
    `💵 *Выручка:* ${REVENUE_LABELS[data.annualRevenue]}`,
    `💰 *Бюджет проекта:* ${BUDGET_LABELS[data.projectBudget]}`,
    `💬 *Чем помочь:* ${data.howCanWeHelp}`,
    `🎯 *Интересует:* ${data.interests.length ? data.interests.map((i) => INTEREST_LABELS[i]).join(", ") : "—"}`,
    `ℹ️ *Доп. информация:* ${data.additionalInfo || "—"}`,
    "",
    `🌐 *Язык формы:* ${data.locale.toUpperCase()}`,
  ];

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
