import "dotenv/config";
import { sihClient } from "@/lib/sih/client";
import { env } from "@/lib/env";

// Register (or clear) the SIH order-status webhook.
//
//   npm run sih:webhook            -> set to <APP_URL>/api/webhooks/sih?secret=…
//   npm run sih:webhook -- <url>   -> set to an explicit URL
//   npm run sih:webhook -- clear   -> remove the webhook
//
// The URL embeds SIH_WEBHOOK_SECRET as a query param so our handler can
// authorize inbound pings. Paste the printed URL into the SIH admin panel too if
// you prefer configuring it there.

async function main() {
  const arg = process.argv[2];

  if (arg === "clear") {
    const project = await sihClient.setWebhook();
    console.log("[sih:webhook] cleared. project.webhook =", project.webhook ?? "(empty)");
    return;
  }

  const base = (env.APP_URL || "").replace(/\/$/, "");
  const url =
    arg ||
    `${base}/api/webhooks/sih?secret=${encodeURIComponent(env.SIH_WEBHOOK_SECRET)}`;

  if (!/^https?:\/\//.test(url)) {
    throw new Error(`Refusing to set a non-absolute webhook URL: ${url}`);
  }

  const project = await sihClient.setWebhook(url);
  console.log("[sih:webhook] set to:\n  " + url);
  console.log("[sih:webhook] project.webhook now =", project.webhook ?? "(empty)");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[sih:webhook] failed:", err);
    process.exit(1);
  });
