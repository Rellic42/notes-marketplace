"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "../../data/notes";
import { useAuth } from "../../components/AuthProvider";

export default function Sell() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <p>Please <Link href="/login"><u>log in</u></Link> to sell your notes.</p>;

  async function submit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      // FormData lets us send text fields AND files together
      const res = await fetch("/api/notes", { method: "POST", body: new FormData(e.target) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/notes/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>Sell your notes</h1>
      <label>Title<input name="title" required /></label>
      <label>Subject
        <select name="subject">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      </label>
      <label>Price in ₹ (0 for free)<input name="price" type="number" min="0" step="1" required /></label>
      <label>Number of pages<input name="pages" type="number" min="1" /></label>
      <label>Short description<input name="description" /></label>
      <label>Notes file (PDF, image, DOCX or TXT, max 10 MB)
        <input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.docx,.txt" required />
      </label>
      <label>Preview image of a page (optional, PNG/JPG)
        <input name="previewImage" type="file" accept=".png,.jpg,.jpeg" />
      </label>
      <label>Preview text for buyers (one line per sample page, first 2 lines are free)
        <textarea name="preview" rows="4" />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Uploading…" : "List my notes"}</button>
    </form>
  );
}
