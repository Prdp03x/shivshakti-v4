import { useEffect, useState } from "react";
import { Router } from "../routes/router.jsx";
import AppShell from "../components/layout/AppShell.jsx";
import Alert from "../components/common/Alert.jsx";
import LoginPage from "../components/auth/LoginPage.jsx";
import AppRoutes from "../routes/AppRoutes.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useBusiness } from "../hooks/useBusiness.js";
import { useBills } from "../hooks/useBills.js";
import { printBill } from "../lib/printBill.js";

export default function App() {
  const { user, loading, connectionError, login, logout, updateCredentials } = useAuth();
  const { business, settings, setSettings, loadBusiness, saveBusiness } = useBusiness();
  const { bills, pagination, loadBills, reloadBills, createBill, deleteBill } = useBills();
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  const onNotice=(msg="",err="")=>{setMessage(msg);setError(err);};

  // Depend on "is logged in", not the user object, so changing the username
  // does not reload (and overwrite) unsaved business-settings edits.
  const isAuthed=Boolean(user);
  useEffect(()=>{
    if(!isAuthed)return;
    Promise.all([loadBusiness(),loadBills()]).catch(e=>onNotice("",e.message));
  },[isAuthed,loadBusiness,loadBills]);

  async function removeBill(bill){
    await deleteBill(bill._id);
    await reloadBills(); // stay on the current page and filters
  }

  if(loading)return <main className="login-screen"><div className="login-card"><p className="muted">Loading workspace…</p></div></main>;
  if(!user)return <LoginPage onLogin={login} connectionError={connectionError}/>;

  const print=(bill)=>{if(!printBill(bill,business))onNotice("","Allow the print window to open.");};

  const routeProps={
    onNotice,
    newBill:{
      business,onNotice,
      onBillCreated:()=>loadBills(),
      onPrint:print,
      createBill,
    },
    records:{onNotice,bills,pagination,loadBills,onDelete:removeBill},
    detail:{business,onPrint:print,onNotice},
    settings:{settings,setSettings,saveBusiness,onNotice,username:user.username,onUpdateCredentials:updateCredentials},
  };

  return <Router>
    <AppShell user={user} onLogout={async()=>{await logout();onNotice();}}>
      {message&&<Alert type="success" onClose={()=>setMessage("")}>{message}</Alert>}
      {error&&<Alert type="error" onClose={()=>setError("")}>{error}</Alert>}
      <AppRoutes {...routeProps}/>
    </AppShell>
  </Router>;
}
