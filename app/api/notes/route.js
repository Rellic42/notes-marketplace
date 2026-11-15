import fs from "fs";
import path from "path";
import crypto from "crypto";
import { loadDB, saveDB, publicNote, STORAGE, FILE_TYPES, IMAGE_EXT, extOf } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
export const dynamic = "force-dynamic";

// GET /api/notes -> every note on the marketplace (newest first)
export async function GET() {
  const db = loadDB();
  return Response.json(db.notes.map((n) => publicNote(db, n)).sort((a, b) => b.createdAt - a.createdAt));
}

// POST /api/notes -> a logged-in seller uploads a note (multipart form with the file)
export async function POST(req) {
  const user = currentUser();
  if (!user) return Response.json({ error: "Please log in to sell notes." }, { status: 401 });

  const form = await req.formData();
  const title = (form.get("title") || "").toString().trim();
  const price = Number(form.get("price"));
  const file = form.get("file");
  const previewImage = form.get("previewImage");

  if (!title || !(price >= 0) || form.get("price") === "") return Response.json({ error: "Title and price are required." }, { status: 400 });
  if (!file || typeof file === "string" || file.size === 0) return Response.json({ error: "Please choose a file to sell." }, { status: 400 });
  if (!FILE_TYPES[extOf(file.name)]) return Response.json({ error: "Allowed files: PDF, PNG, JPG, DOCX, TXT." }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: "File must be under 10 MB." }, { status: 400 });
  const hasPreview = previewImage && typeof previewImage !== "string" && previewImage.size > 0;
  if (hasPreview && !IMAGE_EXT.includes(extOf(previewImage.name))) return Response.json({ error: "Preview must be a PNG or JPG image." }, { status: 400 });

  const id = crypto.randomUUID();
  fs.mkdirSync(STORAGE, { recursive: true });
  const fileName = `${id}-file.${extOf(file.name)}`;
  fs.writeFileSync(path.join(STORAGE, fileName), Buffer.from(await file.arrayBuffer()));
  let previewName = null;
  if (hasPreview) {
    previewName = `${id}-preview.${extOf(previewImage.name)}`;
    fs.writeFileSync(path.join(STORAGE, previewName), Buffer.from(await previewImage.arrayBuffer()));
  }

  const db = loadDB();
  db.notes.push({
    id, title, price, sellerId: user.id, sellerName: user.name, createdAt: Date.now(),
    subject: form.get("subject"), type: extOf(file.name) === "pdf" ? "PDF" : "Handwritten",
    pages: Number(form.get("pages")) || 1, description: (form.get("description") || "").toString(),
    preview: (form.get("preview") || "").toString().split("\n").map((l) => l.trim()).filter(Boolean),
    file: fileName, fileName: file.name, previewImage: previewName, baseSum: 0, baseCount: 0,
  });
  saveDB(db);
  return Response.json({ id });
}
