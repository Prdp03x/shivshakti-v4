import { Users } from "lucide-react";
import PanelHeading from "../common/PanelHeading.jsx";

export default function CustomerForm({ customer, onChange, matches, onPhoneSearch, onChoose }) {
  return <>
    <PanelHeading icon={Users} title="Customer details" description="Optional · leave blank for walk-in customer"/>
    <div className="form-grid">
      <label>Customer name<input autoComplete="off" value={customer.name} onChange={e=>onChange({...customer,name:e.target.value})} placeholder="Enter customer name"/></label>
      <label>Phone number
        <div className="suggest-wrap">
          <input autoComplete="off" value={customer.phone} onChange={e=>onPhoneSearch(e.target.value)} placeholder="Search existing or enter phone"/>
          {matches.length > 0 && <div className="suggestions">{matches.map(c=>
            <button type="button" key={c._id} onClick={()=>onChoose(c)}><strong>{c.name}</strong><span>{c.phone}</span></button>
          )}</div>}
        </div>
      </label>
      <label className="span-2">Address<input autoComplete="off" value={customer.address} onChange={e=>onChange({...customer,address:e.target.value})} placeholder="Customer address (optional)"/></label>
    </div>
  </>;
}
