"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setUser(data.user);
    router.push("/");
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>{mode === "login" ? "Log in" : "Create your account"}</h1>
      {mode === "signup" && <label>Name<input name="name" value={form.name} onChange={change} /></label>}
      <label>Email<input name="email" type="email" value={form.email} onChange={change} /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={change} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn" type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
      <p className="muted">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <button type="button" className="linkbtn" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
          {mode === "login" ? "Create an account" : "Log in"}
        </button>
      </p>
    </form>
  );
}
