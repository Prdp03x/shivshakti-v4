import { useCallback, useState } from "react";
import { api } from "../lib/api.js";

export function businessForm(business = {}) {
  return {
    name: business.name || "",
    address: business.address || "",
    phone: business.phone || "",
    email: business.email || "",
    gstNumber: business.gstNumber || "",
    logoUrl: business.logoUrl || "",
    billPrefix: business.billPrefix || "CM",
  };
}

export function useBusiness() {
  const [business, setBusiness] = useState(null);
  const [settings, setSettings] = useState({});

  const loadBusiness = useCallback(async () => {
    const data = await api("/business");
    setBusiness(data.business);
    setSettings(businessForm(data.business));
    return data.business;
  }, []);

  const saveBusiness = useCallback(async (values) => {
    const data = await api("/business", { method: "PUT", body: JSON.stringify(values) });
    setBusiness(data.business);
    setSettings(businessForm(data.business));
    return data.business;
  }, []);

  return { business, settings, setSettings, loadBusiness, saveBusiness };
}
