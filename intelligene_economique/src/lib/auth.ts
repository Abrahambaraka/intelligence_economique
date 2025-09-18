import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

type AdminSecret = {
  salt: string;
  hash: string;
  updatedAt: number;
};

function readAdmin(): AdminSecret | null {
  try {
    const raw = fs.readFileSync(ADMIN_FILE, "utf8");
    const parsed = JSON.parse(raw) as AdminSecret;
    if (parsed && typeof parsed.salt === "string" && typeof parsed.hash === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

function scryptHex(code: string, salt: string) {
  const buf = crypto.scryptSync(code, salt, 64);
  return buf.toString("hex");
}

export function hasStoredAdminCode() {
  return !!readAdmin();
}

export function verifyAdminCode(code: string) {
  const stored = readAdmin();
  if (stored) {
    const computed = scryptHex(code, stored.salt);
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(stored.hash, "hex"));
  }
  const fallback = process.env.ADMIN_CODE || "admin123";
  return code === fallback;
}

export function setAdminCode(newCode: string) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = scryptHex(newCode, salt);
  const secret: AdminSecret = { salt, hash, updatedAt: Date.now() };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(secret, null, 2), "utf8");
}
