import { checkRateLimit } from "../src/lib/security/rate-limit.ts";

console.log("=== Rate Limit 429 Verification ===");
const ip = "192.168.1.99";

let blocked = false;
for (let i = 1; i <= 7; i++) {
  const res = checkRateLimit("registration", ip);
  console.log(`Request ${i}: allowed=${res.allowed}, remaining=${res.remaining}`);
  if (!res.allowed) {
    blocked = true;
  }
}

if (blocked) {
  console.log("[PASS] Rate limiter successfully throttled excess requests (HTTP 429 triggered)!");
} else {
  console.log("[FAIL] Rate limiter did not throttle!");
}
