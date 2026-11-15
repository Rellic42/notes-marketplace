"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import Stars from "../../components/Stars";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("bought");

  const load = () => fetch("/api/dashboard").then((r) => r.ok ? r.json() : null).then(setData);
  useEffect(() => { if (user) load(); }, [user]);

  async function rate(noteId, stars) {
    await fetch(`/api/notes/${noteId}/rate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stars }) });
    load();
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <p>Please <Link href="/login"><u>log in</u></Link> to see your account.</p>;
  if (!data) return <p className="muted">Loading…</p>;

  const spent = data.purchased.reduce((a, n) => a + n.paid, 0);
  const earned = data.uploads.reduce((a, n) => a + n.earned, 0);

  return (
    <>
      <h1>Hello, {user.name}</h1>
      <p className="muted">{user.email}</p>
      <div className="chips">
        <button className={tab === "bought" ? "chip active" : "chip"} onClick={() => setTab("bought")}>Bought ({data.purchased.length})</button>
        <button className={tab === "sold" ? "chip active" : "chip"} onClick={() => setTab("sold")}>My uploads ({data.uploads.length})</button>
      </div>

      {tab === "bought" && (
        data.purchased.length === 0 ? <p className="muted">You haven't bought any notes yet. <Link href="/"><u>Browse notes</u></Link></p> : (
          <>
            <p className="muted">Total spent: ₹{spent}</p>
            {data.purchased.map((n) => (
              <div key={n.id} className="listrow">
                <div>
                  <Link href={`/notes/${n.id}`}><strong>{n.title}</strong></Link>
                  <p className="muted">{n.subject} · {n.sellerName} · paid ₹{n.paid}</p>
                </div>
                <div className="actions">
                  <Stars value={n.myRating} onRate={(s) => rate(n.id, s)} />
                  <a className="btn small" href={`/api/notes/${n.id}/download`}>Download</a>
                </div>
              </div>
            ))}
          </>
        )
      )}

      {tab === "sold" && (
        data.uploads.length === 0 ? <p className="muted">You haven't uploaded any notes. <Link href="/sell"><u>Sell your first notes</u></Link></p> : (
          <>
            <p className="muted">Total earned: ₹{earned}</p>
            {data.uploads.map((n) => (
              <div key={n.id} className="listrow">
                <div>
                  <Link href={`/notes/${n.id}`}><strong>{n.title}</strong></Link>
                  <p className="muted">{n.subject} · ₹{n.price}</p>
                </div>
                <div className="actions">
                  <span><Stars value={n.avg} /> <small>({n.count})</small></span>
                  <span>{n.sales} sold · ₹{n.earned}</span>
                </div>
              </div>
            ))}
          </>
        )
      )}
    </>
  );
}
