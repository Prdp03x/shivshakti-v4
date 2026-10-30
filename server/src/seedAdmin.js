import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "./config/env.js";
import { User, Business, Counter } from "./models/index.js";

try {
  await mongoose.connect(env.mongoUri);
  const username=(process.env.ADMIN_USERNAME||"admin").trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD;
  if(!password||password.length<12)throw new Error("Set ADMIN_PASSWORD in .env to a value at least 12 characters long.");
  const existing=await User.findOne({username});
  if(existing)console.log(`Admin "${username}" already exists. No changes made.`);
  else {await User.create({username,passwordHash:await bcrypt.hash(password,12),role:"admin"});console.log(`Created admin "${username}".`);}
  if(!(await Business.findOne()))await Business.create({});
  await Counter.updateOne({_id:"main"},{$setOnInsert:{value:0}},{upsert:true});
}catch(e){console.error(e.message);process.exitCode=1;}
finally{await mongoose.disconnect();}
