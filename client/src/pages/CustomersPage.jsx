import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { dateFmt } from "../lib/formatters.js";

export default function CustomersPage({ onNotice }) {
  const [customers,setCustomers]=useState([]);
  useEffect(()=>{api("/customers").then(d=>setCustomers(d.customers)).catch(e=>onNotice("",e.message));},[]);
  return <section><div className="page-heading"><div><p className="eyebrow">CONTACTS</p><h1>Customers</h1><p className="muted">Customer details are stored separately from bill documents.</p></div><span className="count-pill">{customers.length} recent matches</span></div>
    <div className="panel"><div className="records-table-wrap"><table className="records-table"><thead><tr><th>Name</th><th>Phone</th><th>Address</th><th>Last updated</th></tr></thead><tbody>{customers.map(c=><tr key={c._id}><td><strong>{c.name}</strong></td><td>{c.phone||"—"}</td><td>{c.address||"—"}</td><td>{dateFmt(c.updatedAt)}</td></tr>)}</tbody></table></div>
    {customers.length===0&&<div className="empty-state"><Users size={28}/><h3>No saved customers</h3><p>Customers are saved when you create a bill with customer details.</p></div>}</div>
  </section>;
}
