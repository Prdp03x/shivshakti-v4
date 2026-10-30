import { AlertCircle, Database, LockKeyhole, Save, Settings } from "lucide-react";
import { useState } from "react";
import PanelHeading from "../components/common/PanelHeading.jsx";
import CredentialsForm from "../components/settings/CredentialsForm.jsx";
import { api } from "../lib/api.js";
import { downloadResponse } from "../lib/download.js";

export default function SettingsPage({ settings, setSettings, saveBusiness, onNotice, username, onUpdateCredentials }) {
  const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);try{await saveBusiness(settings);onNotice("Business details saved.");}catch(e){onNotice("",e.message);}finally{setBusy(false);}}
  async function backup(){try{await downloadResponse(await api("/backup",{raw:true}),"cash-memo-backup.json");onNotice("Backup generated. The downloaded file is now outside the application's control.");}catch(e){onNotice("",e.message);}}
  async function restore(file){
    if(!file)return;
    if(!window.confirm("Restore this backup? Current business, customer and bill data will be replaced. Login accounts are not overwritten."))return;
    try{const data=JSON.parse(await file.text());const result=await api("/backup/restore",{method:"POST",body:JSON.stringify(data)});onNotice(result.message);window.location.reload();}
    catch(e){onNotice("",e.message||"Could not restore backup.");}
  }
  return <section><div className="page-heading"><div><p className="eyebrow">CONFIGURATION</p><h1>Business settings</h1><p className="muted">These details appear on your printed cash memos.</p></div></div>
    <form className="panel settings-form" onSubmit={submit}><PanelHeading icon={Settings} title="Business details" description="Saved in the businesses collection"/>
      <div className="form-grid">
        <label>Business name<input value={settings.name||""} onChange={e=>setSettings({...settings,name:e.target.value})} required/></label>
        <label>Phone number<input value={settings.phone||""} onChange={e=>setSettings({...settings,phone:e.target.value})}/></label>
        <label className="span-2">Business address<textarea value={settings.address||""} onChange={e=>setSettings({...settings,address:e.target.value})} rows={2}/></label>
        <label>Email<input type="email" value={settings.email||""} onChange={e=>setSettings({...settings,email:e.target.value})}/></label>
        <label>GST number<input value={settings.gstNumber||""} onChange={e=>setSettings({...settings,gstNumber:e.target.value})}/></label>
        <label>Bill number prefix<input value={settings.billPrefix||""} onChange={e=>setSettings({...settings,billPrefix:e.target.value})} required/></label>
        <label>Logo URL (optional)<input value={settings.logoUrl||""} onChange={e=>setSettings({...settings,logoUrl:e.target.value})}/></label>
      </div>
      <div className="settings-footer"><span className="helper"><LockKeyhole size={14}/> Bill counter is kept separately and is not editable here.</span><button className="primary" disabled={busy}><Save size={16}/> {busy?"Saving…":"Save business details"}</button></div>
    </form>
    <CredentialsForm username={username} onSubmit={onUpdateCredentials}/>
    <div className="panel backup-panel"><PanelHeading icon={Database} title="Backup & restore" description="Backup files include business, customer, bill and counter data"/>
      <div className="backup-actions"><button className="secondary" onClick={backup}><Database size={16}/> Download JSON backup</button><label className="secondary upload-label">Restore JSON backup<input type="file" accept="application/json,.json" onChange={e=>{restore(e.target.files?.[0]);e.target.value="";}}/></label></div>
      <p className="helper"><AlertCircle size={14}/> Store downloaded backups securely. Restore replaces billing data and cannot be undone. Counter never moves backwards.</p>
    </div>
  </section>;
}
