import { Business } from "../models/index.js";
export async function getBusiness(req,res){
  let business=await Business.findOne(); if(!business)business=await Business.create({});
  res.json({business});
}
export async function updateBusiness(req,res){
  const fields=["name","address","phone","email","gstNumber","logoUrl","billPrefix"];
  const update={}; for(const key of fields)if(req.body[key]!==undefined)update[key]=String(req.body[key]).trim().slice(0,500);
  if(update.billPrefix&&!/^[A-Za-z0-9-]{1,10}$/.test(update.billPrefix))return res.status(400).json({error:"Bill prefix can contain letters, numbers and hyphens only."});
  let business=await Business.findOne();if(!business)business=await Business.create({});
  Object.assign(business,update);await business.save();res.json({business});
}
