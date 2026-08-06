import { NextResponse } from "next/server";
import { consultationSchema } from "@/lib/validation/consultationSchema";
import { formatConsultationMessage, sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = consultationSchema.safeParse(body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "form"),
      message: issue.message,
    }));
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    const message = formatConsultationMessage(parsed.data);
    await sendTelegramMessage(message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return NextResponse.json({ ok: false, error: "telegram_failed" }, { status: 502 });
  }
}
