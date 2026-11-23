import fs from "fs";
import path from "path";

const enPath = path.resolve("messages/en.json");
const arPath = path.resolve("messages/ar.json");

if (!fs.existsSync(enPath) || !fs.existsSync(arPath)) {
  console.error("Missing translation files!");
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));

function flattenKeys(obj, prefix = "") {
  let keys = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(keys, flattenKeys(v, fullKey));
    } else {
      keys[fullKey] = v;
    }
  }
  return keys;
}

const enFlat = flattenKeys(en);
const arFlat = flattenKeys(ar);

const missingInAr = [];
const missingInEn = [];
const emptyInAr = [];
const emptyInEn = [];

for (const [k, v] of Object.entries(enFlat)) {
  if (!(k in arFlat)) {
    missingInAr.push(k);
  } else if (arFlat[k] === "" || arFlat[k] === null || arFlat[k] === undefined) {
    emptyInAr.push(k);
  }
}

for (const [k, v] of Object.entries(arFlat)) {
  if (!(k in enFlat)) {
    missingInEn.push(k);
  } else if (enFlat[k] === "" || enFlat[k] === null || enFlat[k] === undefined) {
    emptyInEn.push(k);
  }
}

console.log("=== i18n Translation Keys Parity Audit ===");
console.log(`Total Keys in EN: ${Object.keys(enFlat).length}`);
console.log(`Total Keys in AR: ${Object.keys(arFlat).length}`);

let hasErrors = false;

if (missingInAr.length > 0) {
  console.log(`\n❌ Keys present in EN but missing in AR (${missingInAr.length}):`);
  missingInAr.forEach((k) => console.log(`  - ${k}`));
  hasErrors = true;
} else {
  console.log("\n✅ No missing keys in AR (100% covered from EN)");
}

if (missingInEn.length > 0) {
  console.log(`\n❌ Keys present in AR but missing in EN (${missingInEn.length}):`);
  missingInEn.forEach((k) => console.log(`  - ${k}`));
  hasErrors = true;
} else {
  console.log("✅ No missing keys in EN (100% covered from AR)");
}

if (emptyInAr.length > 0) {
  console.log(`\n⚠️  Empty keys in AR (${emptyInAr.length}):`);
  emptyInAr.forEach((k) => console.log(`  - ${k}`));
}

if (emptyInEn.length > 0) {
  console.log(`\n⚠️  Empty keys in EN (${emptyInEn.length}):`);
  emptyInEn.forEach((k) => console.log(`  - ${k}`));
}

if (!hasErrors && emptyInAr.length === 0 && emptyInEn.length === 0) {
  console.log("\n🎉 PERFECT PARITY: All keys match 100% between en.json and ar.json!");
}
