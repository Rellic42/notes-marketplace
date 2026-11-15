import fs from "fs";
import path from "path";
import { loadDB, saveDB, publicNote, STORAGE } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";
export const dynamic = "force-dynamic";

// GET one note. Locked preview pages are NOT sent to people who haven't bought it.
export async function GET(req, { params }) {
  const db = loadDB();
  const note = db.notes.find((n) => n.id === params.id);
  if (!note) return Response.json({ error: "Note not found" }, { status: 404 });
  const user = currentUser();
  const isOwner = !!user && user.id === note.sellerId;
  const bought = !!user && db.purchases.some((p) => p.userId === user.id && p.noteId === note.id);
  const unlocked = isOwner || bought;
  const lines = note.preview || [];
  const mine = user && db.ratings.find((r) => r.userId === user.id && r.noteId === note.id);
  return Response.json({
    ...publicNote(db, note), isOwner, bought,
    previewLines: unlocked ? lines : lines.slice(0, 2),
    lockedCount: unlocked ? 0 : Math.max(lines.length - 2, 0),
    myRating: mine ? mine.stars : 0,
    canDelete: isOwner && !db.purchases.some((p) => p.noteId === note.id),
  });
}

// DELETE: only the seller, and only if nobody has bought it yet
export async function DELETE(req, { params }) {
  const user = currentUser();
  const db = loadDB();
  const note = db.notes.find((n) => n.id === params.id);
  if (!user || !note || note.sellerId !== user.id) return Response.json({ error: "Not allowed" }, { status: 403 });
  if (db.purchases.some((p) => p.noteId === note.id)) return Response.json({ error: "Already bought by someone, so it cannot be deleted." }, { status: 409 });
  [note.file, note.previewImage].filter(Boolean).forEach((f) => fs.rmSync(path.join(STORAGE, f), { force: true }));
  db.notes = db.notes.filter((n) => n.id !== note.id);
  saveDB(db);
  return Response.json({ ok: true });
}
