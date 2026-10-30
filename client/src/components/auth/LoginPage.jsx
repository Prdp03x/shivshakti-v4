import { useState } from "react";
import { AlertCircle, ChevronRight, LockKeyhole, ReceiptText } from "lucide-react";
import PasswordInput from "../common/PasswordInput.jsx";

export default function LoginPage({ onLogin, connectionError = "" }) {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await onLogin(login);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="login-screen">
      <div className="login-card">
        <div className="brand-mark"><ReceiptText size={27} /></div>
        <p className="eyebrow">SHIV SHAKTI Hardware</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your billing records.</p>
        <form onSubmit={submit} className="stack">
          <label>Username<input autoComplete="off" value={login.username} onChange={e => setLogin({...login, username:e.target.value})} required maxLength={100} /></label>
          <label>Password<PasswordInput autoComplete="new-password" value={login.password} onChange={e => setLogin({...login, password:e.target.value})} required maxLength={200} /></label>
          {(error || connectionError) && <div className="alert error"><AlertCircle size={16}/>{error || connectionError}</div>}
          <button className="primary full" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <ChevronRight size={17}/></button>
        </form>
        <p className="login-foot"><LockKeyhole size={14}/> Protected by server-side authentication</p>
      </div>
    </main>
  );
}
