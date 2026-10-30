import { CheckCircle2, Plus, Printer, X } from "lucide-react";
import { fmt } from "../../lib/formatters.js";

export default function BillSavedModal({ bill, onClose, onPrint, onNew }) {
  if (!bill) return null;
  return <div className="modal-backdrop" onClick={onClose}>
    <div className="modal" onClick={e=>e.stopPropagation()}>
      <button className="modal-close icon-btn" onClick={onClose}><X/></button>
      <div className="success-mark"><CheckCircle2 size={28}/></div>
      <p className="eyebrow">BILL SAVED</p><h2>{bill.billNumber}</h2>
      <p className="muted">Your cash memo has been saved to MongoDB.</p>
      <div className="modal-total">{fmt(bill.total)}</div>
      <div className="modal-actions">
        <button className="secondary" onClick={()=>onPrint(bill)}><Printer size={16}/> Print memo</button>
        <button className="primary" onClick={onNew}>New bill <Plus size={16}/></button>
      </div>
    </div>
  </div>;
}
