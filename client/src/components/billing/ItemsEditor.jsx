import { Plus, ReceiptText, Trash2 } from "lucide-react";
import PanelHeading from "../common/PanelHeading.jsx";
import { fmt } from "../../lib/formatters.js";

export default function ItemsEditor({ items, totals, onUpdate, onAdd, onRemove, notes, setNotes }) {
  return <>
    <div className="section-rule"/>
    <PanelHeading icon={ReceiptText} title="Items" description="Enter item details manually"
      action={<span className="count-pill">{items.length} {items.length === 1 ? "item" : "items"}</span>}/>
    <div className="items-table">
      <div className="item-row item-head"><span>ITEM DESCRIPTION</span><span>QTY</span><span>UNIT PRICE (₹)</span><span>LINE TOTAL</span><span/></div>
      {items.map((item,index)=><div className="item-row" key={index}>
        <input aria-label="Item name" autoComplete="off" value={item.name} onChange={e=>onUpdate(index,"name",e.target.value)} placeholder="Item name"/>
        <input aria-label="Quantity" autoComplete="off" type="number" min="0.001" step="any" value={item.qty} onChange={e=>onUpdate(index,"qty",e.target.value)}/>
        <input aria-label="Unit price" autoComplete="off" type="number" min="0" step="0.01" value={item.price} onChange={e=>onUpdate(index,"price",e.target.value)} placeholder="0.00"/>
        <strong className="line-total">{fmt(totals.rows[index]?.lineTotal)}</strong>
        <button className="icon-btn danger-icon" title="Remove item" onClick={()=>onRemove(index)}><Trash2 size={16}/></button>
      </div>)}
    </div>
    <button className="add-row" onClick={onAdd}><Plus size={16}/> Add another item</button>
    <div className="section-rule"/>
    <label>Notes <textarea autoComplete="off" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional notes for this bill" rows={2}/></label>
  </>;
}
