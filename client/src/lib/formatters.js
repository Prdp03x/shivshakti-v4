export const fmt = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));

export const dateFmt = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    : "—";

export const emptyItem = () => ({ name: "", qty: "1", price: "" });
export const emptyCustomer = () => ({ name: "", phone: "", address: "", email: "" });

export function calculateTotals(items, amountPaid) {
  const rows = items.map((item) => {
    const qty = Number(item.qty || 0);
    const price = Number(item.price || 0);
    return { ...item, qtyValue: qty, priceValue: price, lineTotal: Math.round(qty * price * 100) / 100 };
  });
  const total = Math.round(rows.reduce((sum, row) => sum + row.lineTotal, 0) * 100) / 100;
  const paid = Math.min(total, Math.max(0, Number(amountPaid || 0)));
  return {
    rows,
    total,
    paid,
    balance: Math.round((total - paid) * 100) / 100,
    status: paid <= 0 ? "Pending" : paid < total ? "Partially Paid" : "Paid",
  };
}
