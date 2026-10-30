import mongoose from "mongoose";
import { Bill, Business, Counter, Customer, User } from "../models/index.js";

export async function backup(req,res){
  const [businesses,customers,bills,users,counters]=await Promise.all([
    Business.find().lean(),Customer.find().lean(),Bill.find().lean(),User.find().select("-passwordHash").lean(),Counter.find().lean()
  ]);
  res.setHeader("Content-Disposition",'attachment; filename="cash-memo-backup.json"');
  res.json({format:"cash-memo-backup-v1",exportedAt:new Date().toISOString(),businesses,customers,bills,users,counters});
}

export async function restore(req,res){
  const data=req.body;
  if(!data||data.format!=="cash-memo-backup-v1"||!Array.isArray(data.businesses)||!Array.isArray(data.customers)||!Array.isArray(data.bills)||!Array.isArray(data.counters))
    return res.status(400).json({error:"Invalid backup format."});
  const currentCounter=await Counter.findById("main");
  const incomingCounter=data.counters.find(c=>c._id==="main")?.value||0;
  const safeCounter=Math.max(currentCounter?.value||0,Number(incomingCounter)||0);
  await mongoose.connection.transaction(async session=>{
    await Business.deleteMany({}, {session});
    if(data.businesses.length)await Business.insertMany(data.businesses,{session});
    await Customer.deleteMany({}, {session});
    if(data.customers.length)await Customer.insertMany(data.customers,{session});
    await Bill.deleteMany({}, {session});
    if(data.bills.length)await Bill.insertMany(data.bills,{session});
    await Counter.updateOne({_id:"main"},{$set:{value:safeCounter}},{upsert:true,session});
  });
  res.json({ok:true,message:"Backup restored. Counter was not moved backwards."});
}
