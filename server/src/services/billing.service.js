import { Bill, Business, Counter, Customer } from "../models/index.js";
import { money, paymentStatus } from "../utils/http.js";

export async function nextBillNumber(prefix) {
  const counter = await Counter.findOneAndUpdate(
    { _id: "main" }, { $inc: { value: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return `${prefix || "CM"}-${String(counter.value).padStart(6, "0")}`;
}

export async function createBill(input) {
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 200) {
    const e = new Error("Add between 1 and 200 items."); e.status=400; throw e;
  }
  const items=input.items.map(item=>{
    const name=String(item.name||"").trim().slice(0,200);
    const qty=Number(item.qty), price=Number(item.price);
    if(!name||!Number.isFinite(qty)||qty<=0||!Number.isFinite(price)||price<0){
      const e=new Error("Each item needs a name, positive quantity and non-negative price.");e.status=400;throw e;
    }
    const roundedPrice=money(price);
    return {name,qty,price:roundedPrice,lineTotal:money(qty*roundedPrice)};
  });
  const total=money(items.reduce((sum,item)=>sum+item.lineTotal,0));
  const amountPaid=money(Number(input.amountPaid||0));
  if(!Number.isFinite(amountPaid)||amountPaid<0||amountPaid>total){
    const e=new Error("Amount paid must be between zero and the bill total.");e.status=400;throw e;
  }

  let customerId=null;
  let snapshot={
    name:String(input.customer?.name||"").trim().slice(0,160),
    phone:String(input.customer?.phone||"").trim().slice(0,30),
    address:String(input.customer?.address||"").trim().slice(0,500),
    email:String(input.customer?.email||"").trim().slice(0,200)
  };

  if(snapshot.name||snapshot.phone||snapshot.address||snapshot.email){
    let customer=snapshot.phone?await Customer.findOne({phone:snapshot.phone}):null;
    if(customer){
      customer.name=snapshot.name||customer.name;
      customer.address=snapshot.address||customer.address;
      customer.email=snapshot.email||customer.email;
      await customer.save();
    } else if(snapshot.name) customer=await Customer.create(snapshot);
    if(customer){
      customerId=customer._id;
      snapshot={name:snapshot.name||customer.name,phone:snapshot.phone||customer.phone,address:snapshot.address||customer.address,email:snapshot.email||customer.email};
    }
  }

  const business=await Business.findOne();
  const billNumber=await nextBillNumber(business?.billPrefix||"CM");
  return Bill.create({
    billNumber,customerId,customerSnapshot:snapshot,items,total,amountPaid,
    balance:money(total-amountPaid),paymentStatus:paymentStatus(total,amountPaid),
    notes:String(input.notes||"").slice(0,1000)
  });
}
