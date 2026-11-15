import crypto from "crypto";
import { cookies } from "next/headers";
import { loadDB, saveDB } from "./db";

// Passwords are stored as salt:hash (never plain text)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + crypto.scryptSync(password, salt, 64).toString("hex");
}
export function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  return crypto.timingSafeEqual(crypto.scryptSync(password, salt, 64), Buffer.from(hash, "hex"));
}

// Login = create a random token, save it in the DB and in an httpOnly cookie
export function startSession(userId) {
  const db = loadDB();
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions.push({ token, userId });
  saveDB(db);
  cookies().set("session", token, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7, secure: process.env.NODE_ENV === "production",
  });
}
export function endSession() {
  const token = cookies().get("session")?.value;
  if (token) { const db = loadDB(); db.sessions = db.sessions.filter((s) => s.token !== token); saveDB(db); }
  cookies().set("session", "", { path: "/", maxAge: 0 });
}
// Who is logged in? (null if nobody)
export function currentUser() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  const db = loadDB();
  const s = db.sessions.find((x) => x.token === token);
  return s ? db.users.find((u) => u.id === s.userId) || null : null;
}
export const safeUser = (u) => (u ? { id: u.id, name: u.name, email: u.email } : null);
