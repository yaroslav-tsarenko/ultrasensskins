import { env } from "@/lib/env";

// Fire-and-forget operational alerts to a Telegram chat. Never throws — an alert
// failure must not break the money flow. When the bot token / chat id are not
// configured, it degrades to a console warning so nothing is silently lost.

export type AlertLevel = "info" | "warn" | "critical";

const ICON: Record<AlertLevel, string> = {
  info: "ℹ️",
  warn: "⚠️",
  critical: "🚨",
};

export async function sendAlert(
  message: string,
  level: AlertLevel = "warn",
): Promise<void> {
  const token = env.ALERT_TELEGRAM_BOT_TOKEN;
  const chatId = env.ALERT_TELEGRAM_CHAT_ID;
  const text = `${ICON[level]} ${message}`;

  if (!token || !chatId) {
    console.warn(`[alert:${level}] ${message}`);
    return;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8_000);
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));
  } catch (err) {
    console.error(`[alert] failed to deliver Telegram alert: ${String(err)}`);
    console.warn(`[alert:${level}] ${message}`);
  }
}
