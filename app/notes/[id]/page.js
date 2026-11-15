"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../components/AuthProvider";
import Stars from "../../../components/Stars";

export default function NoteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");

  const load = () => fetch(`/api/notes/${id}`).then(async (r) => {
    if (r.ok) setNote(await r.json()); else setError("Note not found.");
  });
  useEffect(() => { load(); }, [id, user]); // reload when login state changes

  async function post(url, body) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    if (!res.ok) setError((await res.json()).error);
    else { setError(""); load(); }
  }
  async function remove() {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard"); else setError((await res.json()).error);
  }

  if (error && !note) return <p className="error">{error}</p>;
  if (!note) return <p className="muted">Loading…</p>;

  return (
    <>
      <Link href="/" className="muted">← Back to browse</Link>
      <h1>{note.title}</h1>
      <p className="muted">{note.subject} · by {note.sellerName} · {note.type} · {note.pages} pages</p>
      <p><Stars value={note.avg} /> {note.count ? note.avg.toFixed(1) : "No ratings yet"} ({note.count} ratings)</p>
      <p>{note.description}</p>

      <h2>Preview pages</h2>
      <div className="pages">
        {note.hasPreviewImage && <div className="sheet"><img src={`/api/notes/${id}/preview-image`} alt="Preview page" /></div>}
        {note.previewLines.map((text, i) => (
          <div key={i} className="sheet"><small>Page {i + 1}</small><p>{text}</p></div>
        ))}
        {Array.from({ length: note.lockedCount }).map((_, i) => (
          <div key={"l" + i} className="sheet locked"><small>Page {note.previewLines.length + i + 1}</small><span className="lock">Buy to unlock</span></div>
        ))}
      </div>

      <div className="buy">
        {note.isOwner ? (
          <>
            <span className="muted">This is your note.</span>
            <a className="btn" href={`/api/notes/${id}/download`}>Download file</a>
            {note.canDelete && <button className="btn danger" onClick={remove}>Delete</button>}
          </>
        ) : note.bought ? (
          <>
            <a className="btn" href={`/api/notes/${id}/download`}>Download notes</a>
            <span className="muted">Your rating:</span>
            <Stars value={note.myRating} onRate={(n) => post(`/api/notes/${id}/rate`, { stars: n })} />
          </>
        ) : (
          <button className="btn" onClick={() => user ? post(`/api/notes/${id}/buy`) : router.push("/login")}>
            {note.price === 0 ? "Get for free" : `Buy for ₹${note.price}`}
          </button>
        )}
      </div>
      {!user && !note.isOwner && <p className="muted">Log in to buy and download this note.</p>}
      {error && <p className="error">{error}</p>}
    </>
  );
}
