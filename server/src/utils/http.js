export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
export function paymentStatus(total, paid) {
  if (paid <= 0) return "Pending";
  if (paid < total) return "Partially Paid";
  return "Paid";
}
