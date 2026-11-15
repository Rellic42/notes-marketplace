import { loadDB, saveDB } from "../../../../../lib/db";
import { currentUser } from "../../../../../lib/auth";
export const dynamic = "force-dynamic";

// Only buyers can rate; rating again replaces the old rating
export async function POST(req, { params }) {
  const user = currentUser();
  const { stars } = await req.json();
  const db = loadDB();
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
  if (!(stars >= 1 && stars <= 5)) return Response.json({ error: "Rating must be 1 to 5." }, { status: 400 });
  if (!db.purchases.some((p) => p.userId === user.id && p.noteId === params.id)) return Response.json({ error: "Buy this note to rate it." }, { status: 403 });
  const old = db.ratings.find((r) => r.userId === user.id && r.noteId === params.id);
  if (old) old.stars = stars; else db.ratings.push({ userId: user.id, noteId: params.id, stars });
  saveDB(db);
  return Response.json({ ok: true });
}
