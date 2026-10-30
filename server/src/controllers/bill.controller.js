import mongoose from "mongoose";
import { Bill } from "../models/index.js";
import { escapeRegex } from "../utils/http.js";
import { createBill } from "../services/billing.service.js";

export async function create(req,res){const bill=await createBill(req.body||{});res.status(201).json({bill});}
export async function list(req,res){
  const q=String(req.query.q||"").trim().slice(0,100);
  // Date filters are interpreted in Indian Standard Time (UTC+05:30), not server time.
  const IST="+05:30";
  const parseDay=(value,end)=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||"")))return null;
    const d=new Date(`${value}T${end?"23:59:59.999":"00:00:00.000"}${IST}`);
    return Number.isNaN(d.valueOf())?null:d;
  };
  const from=parseDay(req.query.from,false),to=parseDay(req.query.to,true);
  const filter={};
  if(q)filter.$or=[{billNumber:{$regex:escapeRegex(q),$options:"i"}},{"customerSnapshot.name":{$regex:escapeRegex(q),$options:"i"}},{"customerSnapshot.phone":{$regex:escapeRegex(q),$options:"i"}}];
  if(from||to){
    filter.createdAt={};
    if(from)filter.createdAt.$gte=from;
    if(to)filter.createdAt.$lte=to;
  }
  // Pagination: up to 500 bills per page.
  const MAX_PAGE_SIZE=100;
  const limit=Math.min(MAX_PAGE_SIZE,Math.max(1,parseInt(req.query.limit,10)||MAX_PAGE_SIZE));
  let page=Math.max(1,parseInt(req.query.page,10)||1);
  const total=await Bill.countDocuments(filter);
  const totalPages=Math.max(1,Math.ceil(total/limit));
  if(page>totalPages)page=totalPages; // e.g. last bill of the last page was deleted
  // The records table never uses line items, so skip them to keep each page light.
  const bills=await Bill.find(filter).select("-items").sort({createdAt:-1,_id:-1}).skip((page-1)*limit).limit(limit).lean();
  res.json({bills,page,limit,total,totalPages});
}
export async function getById(req,res){
  if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({error:"Invalid bill ID."});
  const bill=await Bill.findById(req.params.id).lean();if(!bill)return res.status(404).json({error:"Bill not found."});res.json({bill});
}
export async function remove(req,res){
  if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({error:"Invalid bill ID."});
  const bill=await Bill.findByIdAndDelete(req.params.id);if(!bill)return res.status(404).json({error:"Bill not found."});
  res.json({ok:true,deletedBillNumber:bill.billNumber});
}
