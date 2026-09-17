import { sanitizeRedirectUrl } from "../src/lib/auth/redirect.ts";

// Test sanitization directly
const testCases = [
  { input: "https://evil.com", expected: "/" },
  { input: "http://evil.com", expected: "/" },
  { input: "//evil.com", expected: "/" },
  { input: "/\\evil.com", expected: "/" },
  { input: "javascript:alert(1)", expected: "/" },
  { input: "/register/hacknitr", expected: "/register/hacknitr" },
  { input: "/dashboard?tab=events", expected: "/dashboard?tab=events" },
  { input: "/profile", expected: "/profile" },
  { input: "", expected: "/" },
  { input: null, expected: "/" },
];

console.log("=== Open Redirect Sanitizer Tests ===\n");
let passed = 0;

for (const t of testCases) {
  const result = sanitizeRedirectUrl(t.input);
  if (result === t.expected) {
    console.log(`[PASS] Input: "${t.input}" => "${result}"`);
    passed++;
  } else {
    console.log(`[FAIL] Input: "${t.input}" => Expected: "${t.expected}", Got: "${result}"`);
  }
}

console.log(`\nResults: ${passed} / ${testCases.length} tests passed.`);
