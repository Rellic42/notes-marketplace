"use client";
import { useEffect, useState } from "react";
import { CATEGORIES } from "../data/notes";
import NoteCard from "../components/NoteCard";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/notes").then((r) => r.json()).then(setNotes).finally(() => setLoaded(true));
  }, []);

  const shown = notes.filter((n) =>
    (category === "All" || n.subject === category) &&
    n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <section className="hero">
        <h1>Notes from students who actually attended the lecture.</h1>
        <p className="muted">Buy handwritten and PDF notes by subject, or sell your own.</p>
        <input placeholder="Search notes by title…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </section>
      <div className="chips">
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} className={c === category ? "chip active" : "chip"} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      <div className="grid">{shown.map((n) => <NoteCard key={n.id} note={n} />)}</div>
      {loaded && shown.length === 0 && <p className="muted">No notes found. Try another subject or search term.</p>}
    </>
  );
}
