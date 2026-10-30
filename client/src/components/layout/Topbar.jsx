import { ChevronRight } from "lucide-react";
import { useLocation } from "../../routes/router.jsx";

const titles = {
  "/": "New cash memo",
  "/records": "Bill records",
  "/customers": "Customers",
  "/settings": "Business settings",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pathname.startsWith("/bills/") ? "Bill details" : (titles[pathname] || "Workspace");
  return <header className="topbar">
    <div><span className="breadcrumb">Workspace</span><ChevronRight size={14}/><strong>{title}</strong></div>
    <div className="top-actions"><span className="online-dot"/> Connected</div>
  </header>;
}
