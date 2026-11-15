import crypto from "crypto";
import { loadDB, saveDB } from "../../../../lib/db";
import { hashPassword, startSession, safeUser } from "../../../../lib/auth";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password || password.length < 6)
    return Response.json({ error: "Enter name, email and a password of 6+ characters." }, { status: 400 });
  const db = loadDB();
  const mail = email.trim().toLowerCase();
  if (db.users.some((u) => u.email === mail))
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  const user = { id: crypto.randomUUID(), name: name.trim(), email: mail, password: hashPassword(password) };
  db.users.push(user);
  saveDB(db);
  startSession(user.id);
  return Response.json({ user: safeUser(user) });
}
