import { Database, LockKeyhole, Save } from "lucide-react";
import PanelHeading from "../common/PanelHeading.jsx";
import { fmt } from "../../lib/formatters.js";
import StatusBadge from "../common/StatusBadge.jsx";

export default function BillSummary({ totals, amountPaid, setAmountPaid, onSave, busy }) {
  return <section className="panel summary-panel">
    <PanelHeading icon={Database} title="Bill summary" description="Calculated automatically"/>
    <div className="summary-line"><span>Items subtotal</span><strong>{fmt(totals.total)}</strong></div>
    <div className="grand-total"><span>Whole total</span><strong>{fmt(totals.total)}</strong></div>
    <label>Amount received (₹)<input type="number" min="0" step="0.01" value={amountPaid} onChange={e=>setAmountPaid(e.target.value)}/></label>
    <div className="summary-line"><span>Balance due</span><strong>{fmt(totals.balance)}</strong></div>
    <div className="status-row"><span>Payment status</span><StatusBadge status={totals.status}/></div>
    <button className="primary full save-btn" onClick={onSave} disabled={busy || totals.total <= 0 || Number(amountPaid || 0) > totals.total}>
      {busy ? "Saving bill…" : <><Save size={17}/> Save cash memo</>}
    </button>
    <p className="helper"><LockKeyhole size={14}/> Bill number is allocated by MongoDB-backed server logic.</p>
  </section>;
}
