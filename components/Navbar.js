"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  return (
    <nav className="nav">
      <Link href="/" className="logo">NoteSwap</Link>
      <div className="links">
        <Link href="/">Browse</Link>
        <Link href="/sell">Sell notes</Link>
        {user && <Link href="/dashboard">My account</Link>}
        {!loading && (user
          ? <button className="linkbtn" onClick={async () => { await logout(); router.push("/"); }}>Log out ({user.name.split(" ")[0]})</button>
          : <Link href="/login" className="loginlink">Log in</Link>)}
      </div>
    </nav>
  );
}
