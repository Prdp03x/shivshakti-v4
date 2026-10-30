import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function Alert({ type = "success", children, onClose }) {
  return (
    <div className={`alert ${type}`}>
      {type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
      {children}
      {onClose && <button className="alert-close" onClick={onClose}><X size={15} /></button>}
    </div>
  );
}
