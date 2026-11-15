// A tiny JSON-file "database" (data/db.json) + a folder for uploaded files (storage/).
// Set DATA_DIR (e.g. a Render persistent disk) to keep them somewhere permanent.
import fs from "fs";
import path from "path";
import { notes as seedNotes } from "../data/notes";

const BASE = process.env.DATA_DIR || process.cwd();
const DB_FILE = path.join(BASE, "data", "db.json");
export const STORAGE = path.join(BASE, "storage");

export const FILE_TYPES = {
  pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", txt: "text/plain",
};
export const IMAGE_EXT = ["png", "jpg", "jpeg"];
export const extOf = (name) => (name.split(".").pop() || "").toLowerCase();

export function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    const seed = {
      users: [], sessions: [], purchases: [], ratings: [],
      notes: seedNotes.map((n) => ({ ...n, sellerId: "seed", createdAt: 0 })),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
export function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

// Note data that is safe to show to everyone (no file paths) + average rating
export function publicNote(db, n) {
  const rs = db.ratings.filter((r) => r.noteId === n.id);
  const count = (n.baseCount || 0) + rs.length;
  const sum = (n.baseSum || 0) + rs.reduce((a, r) => a + r.stars, 0);
  return {
    id: n.id, title: n.title, subject: n.subject, price: n.price, type: n.type, pages: n.pages,
    description: n.description, sellerName: n.sellerName, createdAt: n.createdAt,
    hasPreviewImage: !!n.previewImage, avg: count ? sum / count : 0, count,
  };
}
