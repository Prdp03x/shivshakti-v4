import { LayoutDashboard, LockKeyhole, LogOut, Menu, Plus, ReceiptText, Settings, Users, X } from "lucide-react";
import { Link, useLocation } from "../../routes/router.jsx";
import { useState } from "react";

const items = [
  { to: "/", label: "New cash memo", icon: Plus, end: true },
  { to: "/records", label: "Bill records", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/settings", label: "Business settings", icon: Settings },
];

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {open ? <X size={21}/> : <Menu size={21} />}
      </button>
      {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={closeMenu} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="side-brand">
        <div className="brand-mark small"><ReceiptText size={21}/></div>
        <div><strong>Cash Memo</strong><span>Billing workspace</span></div>
      </div>
      <div className="side-label">WORKSPACE</div>
      {items.slice(0,3).map(({to,label,icon:Icon}) =>
        <Link key={to} to={to} onClick={closeMenu} className={`nav-item ${location.pathname === to ? "active" : ""}`}>
          <Icon size={18}/>{label}
        </Link>
      )}
      <div className="side-label">ADMINISTRATION</div>
      {items.slice(3).map(({to,label,icon:Icon}) =>
        <Link key={to} to={to} onClick={closeMenu} className={`nav-item ${location.pathname === to ? "active" : ""}`}>
          <Icon size={18}/>{label}
        </Link>
      )}
      <div className="sidebar-bottom">
        <div className="user-chip">
          <div className="avatar">{user.username.slice(0,1).toUpperCase()}</div>
          <div className="user-meta"><strong>{user.username}</strong><span>Administrator</span></div>
          <button className="icon-btn" title="Log out" onClick={onLogout}><LogOut size={17}/></button>
        </div>
        <p className="secure-note"><LockKeyhole size={13}/> Online · no local data storage</p>
      </div>
      </aside>
    </>
  );
}
