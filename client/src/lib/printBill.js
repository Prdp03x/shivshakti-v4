import { dateFmt } from "./formatters.js";

export function printBill(bill, business) {
  if (!bill) return false;
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return false;
  const biz = business || {};
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const rows = (bill.items || []).map(i =>
    `<tr><td>${safe(i.name)}</td><td>${safe(i.qty)}</td><td>₹${Number(i.price).toFixed(2)}</td><td>₹${Number(i.lineTotal).toFixed(2)}</td></tr>`
  ).join("");
  w.document.write(`<!doctype html><html><head><title>${safe(bill.billNumber)}</title><style>
    body{font:14px Arial;padding:24px;color:#222}h1{text-align:center}
    table{width:100%;border-collapse:collapse;margin-top:20px}
    th,td{padding:9px;border-bottom:1px solid #ddd;text-align:left}.right{text-align:right}
    .total{font-size:20px;font-weight:bold;text-align:right;margin-top:20px}
    @media print{button{display:none}}
  </style></head><body>
    <h1>CASH MEMO</h1><h2>${safe(biz.name)}</h2>
    <p>${safe(biz.address)}<br>${safe(biz.phone)}${biz.gstNumber ? "<br>GST: "+safe(biz.gstNumber):""}</p><hr>
    <p><b>Bill:</b> ${safe(bill.billNumber)} &nbsp; <b>Date:</b> ${safe(dateFmt(bill.createdAt))}</p>
    <p><b>Customer:</b> ${safe(bill.customerSnapshot?.name || "Walk-in")}<br>
    ${safe(bill.customerSnapshot?.phone || "")}<br>${safe(bill.customerSnapshot?.address || "")}</p>
    <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Line Total</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="total">Total: ₹${Number(bill.total).toFixed(2)}</p>
    <p class="right">Paid: ₹${Number(bill.amountPaid).toFixed(2)}<br>Balance: ₹${Number(bill.balance).toFixed(2)}<br>Status: ${safe(bill.paymentStatus)}</p>
    <p>${safe(bill.notes || "")}</p><p style="text-align:center;margin-top:40px">Thank you</p>
    <script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
  return true;
}
