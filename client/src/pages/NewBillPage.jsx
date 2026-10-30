import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import CustomerForm from "../components/billing/CustomerForm.jsx";
import ItemsEditor from "../components/billing/ItemsEditor.jsx";
import BillSummary from "../components/billing/BillSummary.jsx";
import BillSavedModal from "../components/billing/BillSavedModal.jsx";
import { api } from "../lib/api.js";
import { calculateTotals, emptyCustomer, emptyItem } from "../lib/formatters.js";

export default function NewBillPage({ onNotice, onBillCreated, onPrint, business, createBill }) {
  const [items,setItems]=useState([emptyItem()]);
  const [customer,setCustomer]=useState(emptyCustomer());
  const [amountPaid,setAmountPaid]=useState("0");
  const [notes,setNotes]=useState("");
  const [matches,setMatches]=useState([]);
  const [busy,setBusy]=useState(false);
  const [saved,setSaved]=useState(null);
  const totals=useMemo(()=>calculateTotals(items,amountPaid),[items,amountPaid]);

  const clear=()=>{setItems([emptyItem()]);setCustomer(emptyCustomer());setAmountPaid("0");setNotes("");setSaved(null);onNotice("Draft cleared.");};
  const update=(index,key,value)=>setItems(old=>old.map((item,i)=>i===index?{...item,[key]:value}:item));
  const remove=(index)=>setItems(old=>old.length===1?[emptyItem()]:old.filter((_,i)=>i!==index));
  async function searchCustomers(value){
    setCustomer(c=>({...c,phone:value}));
    if(!value.trim()) return setMatches([]);
    try { const d=await api(`/customers?q=${encodeURIComponent(value)}`); setMatches(d.customers.slice(0,6)); }
    catch { setMatches([]); }
  }
  function choose(c){setCustomer({name:c.name||"",phone:c.phone||"",address:c.address||"",email:c.email||""});setMatches([]);}
  async function save(){
    if(!items.some(i=>i.name.trim())) return onNotice("", "Add at least one item.");
    setBusy(true); onNotice();
    try {
      const data=await createBill({items:totals.rows.filter(i=>i.name.trim()).map(i=>({name:i.name,qty:i.qty,price:i.price})),customer,amountPaid:Number(amountPaid||0),notes});
      onBillCreated(data.bill); setSaved(data.bill); clear(); setSaved(data.bill);
      onNotice(`Saved ${data.bill.billNumber} successfully.`);
    } catch(e){onNotice("",e.message);}
    finally{setBusy(false);}
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">BILLING</p><h1>Create cash memo</h1><p className="muted">Add items manually. Totals are verified by the server.</p></div><button className="secondary" onClick={clear}>Clear draft</button></div>
    <div className="billing-layout">
      <section className="panel">
        <CustomerForm customer={customer} onChange={setCustomer} matches={matches} onPhoneSearch={searchCustomers} onChoose={choose}/>
        <ItemsEditor items={items} totals={totals} onUpdate={update} onAdd={()=>setItems(old=>[...old,emptyItem()])} onRemove={remove} notes={notes} setNotes={setNotes}/>
      </section>
      <aside className="summary-column">
        <BillSummary totals={totals} amountPaid={amountPaid} setAmountPaid={setAmountPaid} onSave={save} busy={busy}/>
        <section className="tip-card"><div className="tip-icon"><Printer size={18}/></div><div><strong>Print-ready memo</strong><p>After saving, open the bill and use Print to produce a clean receipt.</p></div></section>
      </aside>
    </div>
    <BillSavedModal bill={saved} onClose={()=>setSaved(null)} onPrint={onPrint} onNew={clear}/>
  </>;
}
