import { cleanText, cleanPhone, redact } from "../utils/sanitize.js";

test("cleanText removes < > and cuts long text", () => {
  expect(cleanText("  <b>Asha</b>  ")).toBe("bAsha/b");
  expect(cleanText("a".repeat(200), 10)).toHaveLength(10);
});

test("cleanPhone keeps digits only", () => {
  expect(cleanPhone("98-76 54x3210")).toBe("9876543210");
});

test("redact hides personal fields before logging", () => {
  expect(redact({ name: "Asha", email: "a@b.com", days: 3 })).toEqual({
    name: "[hidden]",
    email: "[hidden]",
    days: 3,
  });
});
