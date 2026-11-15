import { loadDB } from "../../../../lib/db";
import { checkPassword, startSession, safeUser } from "../../../../lib/auth";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = loadDB().users.find((u) => u.email === (email || "").trim().toLowerCase());
  if (!user || !checkPassword(password || "", user.password))
    return Response.json({ error: "Wrong email or password." }, { status: 401 });
  startSession(user.id);
  return Response.json({ user: safeUser(user) });
}
