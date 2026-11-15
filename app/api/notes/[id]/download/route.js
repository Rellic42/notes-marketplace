import fs from "fs";
import path from "path";
import { loadDB, STORAGE, FILE_TYPES, extOf } from "../../../../../lib/db";
import { currentUser } from "../../../../../lib/auth";
export const dynamic = "force-dynamic";

// Protected download: only the buyer or the seller gets the real file
export async function GET(req, { params }) {
  const user = currentUser();
  const db = loadDB();
  const note = db.notes.find((n) => n.id === params.id);
  if (!note) return new Response("Note not found", { status: 404 });
  const allowed = user && (note.sellerId === user.id || db.purchases.some((p) => p.userId === user.id && p.noteId === note.id));
  if (!allowed) return new Response("Buy this note to download it.", { status: 403 });

  const safeTitle = note.title.replace(/[^\w]+/g, "_");
  const filePath = note.file && path.join(STORAGE, note.file);
  if (!filePath || !fs.existsSync(filePath)) { // sample notes have no real file: send their text
    return new Response(`${note.title}\nBy ${note.sellerName}\n\n${(note.preview || []).join("\n\n")}`, {
      headers: { "Content-Type": "text/plain", "Content-Disposition": `attachment; filename="${safeTitle}.txt"` },
    });
  }
  const ext = extOf(note.file);
  return new Response(fs.readFileSync(filePath), {
    headers: { "Content-Type": FILE_TYPES[ext], "Content-Disposition": `attachment; filename="${safeTitle}.${ext}"` },
  });
}
