import fs from "fs";
import path from "path";
import { loadDB, STORAGE, FILE_TYPES, extOf } from "../../../../../lib/db";
export const dynamic = "force-dynamic";

// The seller's preview image is public (it's the free sample)
export async function GET(req, { params }) {
  const note = loadDB().notes.find((n) => n.id === params.id);
  const p = note?.previewImage && path.join(STORAGE, note.previewImage);
  if (!p || !fs.existsSync(p)) return new Response("No preview", { status: 404 });
  return new Response(fs.readFileSync(p), { headers: { "Content-Type": FILE_TYPES[extOf(note.previewImage)] } });
}
