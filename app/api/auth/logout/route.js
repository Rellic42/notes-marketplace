import { endSession } from "../../../../lib/auth";
export const dynamic = "force-dynamic";
export async function POST() { endSession(); return Response.json({ ok: true }); }
