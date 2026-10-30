import { Database, FileSpreadsheet, Printer, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "../routes/router.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { dateFmt, fmt } from "../lib/formatters.js";
import { api } from "../lib/api.js";
import { downloadResponse } from "../lib/download.js";

export default function RecordsPage({ onNotice, bills, pagination, loadBills, onDelete }) {
  // Values currently typed in the filter inputs
  const [search,setSearch]=useState("");
  const [dateFrom,setDateFrom]=useState("");
  const [dateTo,setDateTo]=useState("");
  // Filters actually applied (set when Search is pressed). Paging always uses these,
  // so typing in a box and then clicking "next" does not silently change the results.
  const [applied,setApplied]=useState({search:"",dateFrom:"",dateTo:""});
  const [loading,setLoading]=useState(false);
  const panelRef=useRef(null);
  const navigate=useNavigate();

  async function fetchPage(filters,page=1){
    setLoading(true);
    try{await loadBills({...filters,page});}
    catch(e){onNotice("",e.message);}
    finally{setLoading(false);}
  }

  useEffect(()=>{fetchPage(applied,1);},[]); // initial load only

  function searchBills(){const filters={search,dateFrom,dateTo};setApplied(filters);fetchPage(filters,1);}
  function refresh(){fetchPage(applied,pagination.page);}
  function goToPage(page){
    fetchPage(applied,page);
    panelRef.current?.scrollIntoView({behavior:"smooth",block:"start"});
  }

  async function exportExcel(){try{await downloadResponse(await api("/export/excel",{raw:true}),"cash-memo-bills.xlsx");}catch(e){onNotice("",e.message);}}
  async function backup(){try{await downloadResponse(await api("/backup",{raw:true}),"cash-memo-backup.json");onNotice("Backup generated. The downloaded file is now outside the application's control.");}catch(e){onNotice("",e.message);}}
  async function remove(bill){
    if(!window.confirm(`Delete ${bill.billNumber}? This cannot be undone. Its number will never be reused.`))return;
    try{await onDelete(bill);onNotice(`${bill.billNumber} deleted. The bill counter is unchanged.`);}catch(e){onNotice("",e.message);}
  }

  const pager={page:pagination.page,totalPages:pagination.totalPages,total:pagination.total,pageSize:pagination.limit,onChange:goToPage,disabled:loading};

  return <section>
    <div className="page-heading"><div><p className="eyebrow">HISTORY</p><h1>Bill records</h1><p className="muted">Search, review, export and delete saved cash memos.</p></div>
      <div className="heading-actions"><button className="secondary" onClick={exportExcel}><FileSpreadsheet size={16}/> Export Excel</button><button className="secondary" onClick={backup}><Database size={16}/> Backup</button></div>
    </div>
    <div className="panel filters">
      <div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")searchBills();}} placeholder="Search bill number, customer or phone"/></div>
      <label>From<input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/></label>
      <label>To<input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}/></label>
      <button className="secondary" onClick={searchBills} disabled={loading}><Search size={16}/> Search</button>
      <button className="icon-btn" title="Refresh" onClick={refresh} disabled={loading}><RefreshCw size={17} className={loading?"spin":""}/></button>
    </div>
    <div className="panel records-panel" ref={panelRef}>
      <div className="records-head"><h2>All bills</h2><span className="count-pill">{pagination.total.toLocaleString("en-IN")} total · page {pagination.page} of {pagination.totalPages}</span></div>
      {bills.length===0?<div className="empty-state"><Database size={28}/><h3>{loading?"Loading bills…":"No bills found"}</h3><p>{loading?"Please wait a moment.":"Try changing your search or create a new cash memo."}</p></div>:<>
      <Pagination {...pager} className="top" showSummary={false}/>
      <div className={`records-table-wrap${loading?" is-loading":""}`}><table className="records-table"><thead><tr><th>Bill number</th><th>Date</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{bills.map(b=><tr key={b._id}><td><strong>{b.billNumber}</strong></td><td>{dateFmt(b.createdAt)}</td><td>{b.customerSnapshot?.name||"Walk-in"}<small>{b.customerSnapshot?.phone||""}</small></td><td>{fmt(b.total)}</td><td>{fmt(b.amountPaid)}</td><td>{fmt(b.balance)}</td><td><StatusBadge status={b.paymentStatus}/></td>
        <td><div className="table-actions"><button className="icon-btn" title="View and print" onClick={()=>navigate(`/bills/${b._id}`)}><Printer size={16}/></button><button className="icon-btn danger-icon" title="Delete bill" onClick={()=>remove(b)}><Trash2 size={16}/></button></div></td></tr>)}</tbody>
      </table></div>
      <Pagination {...pager} className="bottom"/>
      </>}
    </div>
  </section>;
}
