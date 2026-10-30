import { AlertCircle, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import PanelHeading from "../common/PanelHeading.jsx";
import PasswordInput from "../common/PasswordInput.jsx";

const MIN_PASSWORD = 10;

export default function CredentialsForm({ username, onSubmit }) {
  const [usernameInput, setUsernameInput] = useState(username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }

  // Keep the field in sync after a successful username change.
  useEffect(() => { setUsernameInput(username); }, [username]);

  const usernameChanged = usernameInput.trim().toLowerCase() !== username;
  const mismatch = confirmPassword && newPassword !== confirmPassword;

  async function submit(e) {
    e.preventDefault();
    setStatus(null);
    if (!usernameChanged && !newPassword) return setStatus({ type: "error", text: "Change the username or enter a new password." });
    if (newPassword && newPassword.length < MIN_PASSWORD) return setStatus({ type: "error", text: `New password must be at least ${MIN_PASSWORD} characters.` });
    if (newPassword !== confirmPassword) return setStatus({ type: "error", text: "New password and confirmation do not match." });

    setBusy(true);
    try {
      const result = await onSubmit({
        currentPassword,
        ...(usernameChanged ? { newUsername: usernameInput.trim() } : {}),
        ...(newPassword ? { newPassword } : {}),
      });
      setStatus({ type: "success", text: result.message });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally { setBusy(false); }
  }

  return (
    <form className="panel settings-form credentials-form" onSubmit={submit} autoComplete="off">
      <PanelHeading icon={KeyRound} title="Login credentials" description={`Signed in as "${username}"`} />
      <div className="form-grid">
        <label>Username
          <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} minLength={3} maxLength={50} autoComplete="off" required />
        </label>
        <label>Current password (required)
          <PasswordInput value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} maxLength={200} autoComplete="current-password" required />
        </label>
        <label>New password (leave empty to keep current)
          <PasswordInput value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={MIN_PASSWORD} maxLength={200} autoComplete="new-password" />
        </label>
        <label>Confirm new password
          <PasswordInput value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} maxLength={200} autoComplete="new-password" />
          {mismatch && <small className="field-error">Passwords do not match.</small>}
        </label>
      </div>
      {status && (
        <div className={`alert ${status.type} inline-alert`}>
          {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.text}
        </div>
      )}
      <div className="settings-footer">
        <span className="helper"><ShieldCheck size={14} /> Username: 3-50 letters, numbers, dot, dash or underscore. Password: at least {MIN_PASSWORD} characters. Changing the password signs out other devices.</span>
        <button className="primary" disabled={busy}><KeyRound size={16} /> {busy ? "Updating…" : "Update credentials"}</button>
      </div>
    </form>
  );
}
