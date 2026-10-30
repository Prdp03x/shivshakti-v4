import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Drop-in replacement for <input type="password"> with a show/hide eye button.
export default function PasswordInput({ className = "", ...inputProps }) {
  const [visible, setVisible] = useState(false);
  const label = visible ? "Hide password" : "Show password";
  return (
    <div className={`password-field ${className}`.trim()}>
      <input {...inputProps} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="password-toggle"
        aria-label={label}
        aria-pressed={visible}
        title={label}
        onMouseDown={(e) => e.preventDefault()} // keep the caret in the input
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
