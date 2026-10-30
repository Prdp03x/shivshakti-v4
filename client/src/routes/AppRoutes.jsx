import NewBillPage from "../pages/NewBillPage.jsx";
import RecordsPage from "../pages/RecordsPage.jsx";
import BillDetailPage from "../pages/BillDetailPage.jsx";
import CustomersPage from "../pages/CustomersPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import { useLocation, useNavigate } from "./router.jsx";

export default function AppRoutes(props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (pathname === "/") return <NewBillPage {...props.newBill}/>;
  if (pathname === "/records") return <RecordsPage {...props.records}/>;
  if (pathname === "/customers") return <CustomersPage onNotice={props.onNotice}/>;
  if (pathname === "/settings") return <SettingsPage {...props.settings}/>;
  if (pathname.startsWith("/bills/")) return <BillDetailPage {...props.detail}/>;
  return <NewBillPage {...props.newBill}/>
}
