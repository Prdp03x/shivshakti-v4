import { useCallback, useRef, useState } from "react";
import { api } from "../lib/api.js";

export const PAGE_SIZE = 500;

export function useBills() {
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: PAGE_SIZE });
  const lastQuery = useRef({ search: "", dateFrom: "", dateTo: "", page: 1 });
  const requestId = useRef(0);

  const loadBills = useCallback(async ({ search = "", dateFrom = "", dateTo = "", page = 1 } = {}) => {
    lastQuery.current = { search, dateFrom, dateTo, page };
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    const id = ++requestId.current;
    const data = await api(`/bills?${params.toString()}`);
    if (id !== requestId.current) return data; // a newer request superseded this one
    lastQuery.current.page = data.page;
    setBills(data.bills);
    setPagination({ page: data.page, totalPages: data.totalPages, total: data.total, limit: data.limit });
    return data;
  }, []);

  // Re-run the last search/page (used after deleting a bill so you stay on the same page).
  const reloadBills = useCallback(() => loadBills(lastQuery.current), [loadBills]);

  const createBill = useCallback((payload) =>
    api("/bills", { method: "POST", body: JSON.stringify(payload) }), []);

  const deleteBill = useCallback((id) =>
    api(`/bills/${id}`, { method: "DELETE" }), []);

  return { bills, pagination, setBills, loadBills, reloadBills, createBill, deleteBill };
}
