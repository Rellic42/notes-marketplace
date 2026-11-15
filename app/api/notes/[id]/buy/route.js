import crypto from "crypto";
import { loadDB, saveDB } from "../../../../../lib/db";
import { currentUser } from "../../../../../lib/auth";
export const dynamic = "force-dynamic";

// Simple "payment": just records the purchase (no real gateway)
export async function POST(req, { params }) {
  const user = currentUser();
  if (!user) return Response.json({ error: "Please log in to buy." }, { status: 401 });
  const db = loadDB();
  const note = db.notes.find((n) => n.id === params.id);
  if (!note) return Response.json({ error: "Note not found" }, { status: 404 });
  if (note.sellerId === user.id) return Response.json({ error: "You can't buy your own note." }, { status: 400 });
  if (db.purchases.some((p) => p.userId === user.id && p.noteId === note.id)) return Response.json({ error: "Already purchased." }, { status: 409 });
  db.purchases.push({ id: crypto.randomUUID(), userId: user.id, noteId: note.id, price: note.price, date: Date.now() });
  saveDB(db);
  return Response.json({ ok: true });
}
