import Link from "next/link";
import Stars from "./Stars";

export default function NoteCard({ note }) {
  return (
    <Link href={`/notes/${note.id}`} className="card">
      <div className="tag">{note.subject}</div>
      <h3>{note.title}</h3>
      <p className="muted">{note.sellerName} · {note.type} · {note.pages} pages</p>
      <div className="row">
        <span><Stars value={note.avg} /> <small>{note.count ? note.avg.toFixed(1) : "New"}</small></span>
        <strong>{note.price === 0 ? "Free" : `₹${note.price}`}</strong>
      </div>
    </Link>
  );
}
