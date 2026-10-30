import ExcelJS from "exceljs";
import { Bill } from "../models/index.js";

export async function excel(req,res){
  const bills=await Bill.find().sort({createdAt:1}).lean();
  const workbook=new ExcelJS.Workbook();const sheet=workbook.addWorksheet("Bills");
  sheet.columns=[
    {header:"Bill Number",key:"billNumber",width:18},{header:"Date",key:"date",width:22},
    {header:"Customer",key:"customer",width:25},{header:"Phone",key:"phone",width:18},
    {header:"Items",key:"items",width:60},{header:"Total",key:"total",width:14},
    {header:"Amount Paid",key:"amountPaid",width:14},{header:"Balance",key:"balance",width:14},
    {header:"Payment Status",key:"paymentStatus",width:20}
  ];
  for(const b of bills)sheet.addRow({
    billNumber:b.billNumber,date:b.createdAt?.toISOString(),customer:b.customerSnapshot?.name||"Walk-in",
    phone:b.customerSnapshot?.phone||"",items:(b.items||[]).map(i=>`${i.name} (${i.qty} × ${i.price}) = ${i.lineTotal}`).join("; "),
    total:b.total,amountPaid:b.amountPaid,balance:b.balance,paymentStatus:b.paymentStatus
  });
  sheet.getRow(1).font={bold:true};
  res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition",'attachment; filename="cash-memo-bills.xlsx"');
  await workbook.xlsx.write(res);res.end();
}
