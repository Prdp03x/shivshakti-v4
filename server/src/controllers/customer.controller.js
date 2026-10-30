import { Customer } from "../models/index.js";
import { escapeRegex } from "../utils/http.js";
export async function listCustomers(req,res){
  const q=String(req.query.q||"").trim().slice(0,100);
  const filter=q?{$or:[{name:{$regex:escapeRegex(q),$options:"i"}},{phone:{$regex:escapeRegex(q),$options:"i"}}]}:{};
  const customers=await Customer.find(filter).sort({updatedAt:-1}).limit(30).lean();
  res.json({customers});
}
