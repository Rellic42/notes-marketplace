import { currentUser, safeUser } from "../../../../lib/auth";
export const dynamic = "force-dynamic";
export async function GET() { return Response.json({ user: safeUser(currentUser()) }); }
