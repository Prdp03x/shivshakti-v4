import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppShell({ user, onLogout, children }) {
  return <div className="app-shell">
    <Sidebar user={user} onLogout={onLogout}/>
    <main className="main-area"><Topbar/><div className="content">{children}</div></main>
  </div>;
}
