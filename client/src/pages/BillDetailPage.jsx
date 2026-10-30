import { Printer } from "lucide-react";
import { useNavigate, useParams } from "../routes/router.jsx";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { dateFmt, fmt } from "../lib/formatters.js";
import StatusBadge from "../components/common/StatusBadge.jsx";

export default function BillDetailPage({ business, onPrint, onNotice }) {
  const {id}=useParams(); const navigate=useNavigate(); const [bill,setBill]=useState(null);
  useEffect(()=>{api(`/bills/${id}`).then(d=>setBill(d.bill)).catch(e=>onNotice("",e.message));},[id]);
  if(!bill)return <section className="panel"><p className="muted">Loading bill…</p></section>;
  return <section className="panel bill-detail">
    <button className="secondary" onClick={()=>navigate("/records")}>← Back to records</button>
    <div className="page-heading"><div><p className="eyebrow">CASH MEMO</p><h1>{bill.billNumber}</h1><p className="muted">{dateFmt(bill.createdAt)}</p></div><button className="primary" onClick={()=>onPrint(bill)}><Printer size={16}/> Print memo</button></div>
    <h2>{business?.name}</h2><p className="muted">{business?.address} · {business?.phone}</p>
    <p><b>Customer:</b> {bill.customerSnapshot?.name||"Walk-in"} · {bill.customerSnapshot?.phone}</p>
    <div className="records-table-wrap"><table className="records-table"><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Line total</th></tr></thead>
      <tbody>{bill.items.map((i,index)=><tr key={index}><td>{i.name}</td><td>{i.qty}</td><td>{fmt(i.price)}</td><td>{fmt(i.lineTotal)}</td></tr>)}</tbody></table></div>
    <div className="detail-totals"><p>Total <strong>{fmt(bill.total)}</strong></p><p>Paid <strong>{fmt(bill.amountPaid)}</strong></p><p>Balance <strong>{fmt(bill.balance)}</strong></p><p>Status <StatusBadge status={bill.paymentStatus}/></p></div>
  </section>;
}
