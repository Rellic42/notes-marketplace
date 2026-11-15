import { loadDB, publicNote } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
export const dynamic = "force-dynamic";

// Everything for "My account": notes I bought + notes I uploaded (with sales)
export async function GET() {
  const user = currentUser();
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
  const db = loadDB();

  const purchased = db.purchases.filter((p) => p.userId === user.id).map((p) => {
    const note = db.notes.find((n) => n.id === p.noteId);
    const mine = db.ratings.find((r) => r.userId === user.id && r.noteId === p.noteId);
    return note ? { ...publicNote(db, note), paid: p.price, boughtOn: p.date, myRating: mine ? mine.stars : 0 } : null;
  }).filter(Boolean);

  const uploads = db.notes.filter((n) => n.sellerId === user.id).map((n) => {
    const sales = db.purchases.filter((p) => p.noteId === n.id);
    return { ...publicNote(db, n), sales: sales.length, earned: sales.reduce((a, p) => a + p.price, 0) };
  });
  return Response.json({ purchased, uploads });
}
