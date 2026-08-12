import "dotenv/config";
import { sihClient } from "@/lib/sih/client";
import { env } from "@/lib/env";

// Read-only smoke test against the live SIH API. Confirms our credentials,
// base URL and response parsing all work end to end WITHOUT spending money —
// it never calls create-order. Run: `npm run sih:smoke`.
//
//   1. /project      -> auth + balance
//   2. /get-items    -> catalog reachable, non-empty
//   3. /get-min-item -> live price lookup for one real item

async function main() {
  console.log(`[sih:smoke] base=${env.SIH_API_BASE} appId=${env.SIH_APP_ID}`);

  // 1) Project / balance — proves the apikey is accepted.
  const project = await sihClient.getProject();
  console.log(
    `[sih:smoke] project ok. balance=${project.balance} webhook=${project.webhook ?? "(none)"}`,
  );

  // 2) Catalog — proves items are reachable and parseable.
  const items = await sihClient.getItems();
  const names = Object.keys(items.items);
  console.log(`[sih:smoke] get-items ok. count=${names.length}`);
  if (names.length === 0) {
    throw new Error("get-items returned an empty catalog — unexpected");
  }

  // 3) Live min-price for a single real item — proves the pre-purchase price
  //    re-confirm path works.
  const sample = names[0];
  const min = await sihClient.getMinItem(sample);
  console.log(
    `[sih:smoke] get-min-item ok. item="${sample}" found=${min.found} ` +
      `price=${min.price} count=${min.count}`,
  );

  console.log("[sih:smoke] PASS — SIH API reachable and parsing correctly.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[sih:smoke] FAIL:", err);
    process.exit(1);
  });
