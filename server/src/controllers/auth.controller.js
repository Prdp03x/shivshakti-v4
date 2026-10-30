import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/index.js";
import { sessionCookieOptions } from "../config/env.js";

export async function login(req,res){
  const username=String(req.body?.username||"").trim().toLowerCase();
  const password=String(req.body?.password||"");
  if(!username||!password||username.length>100||password.length>200)return res.status(400).json({error:"Enter username and password."});
  const user=await User.findOne({username,active:true});
  const ok=user&&await bcrypt.compare(password,user.passwordHash);
  if(!ok)return res.status(401).json({error:"Invalid username or password."});
  await new Promise((resolve,reject)=>req.session.regenerate(err=>err?reject(err):resolve()));
  req.session.userId=String(user._id);req.session.username=user.username;
  user.lastLoginAt=new Date();await user.save();
  res.json({user:{username:user.username,role:user.role}});
}
export async function me(req,res){res.json({user:{username:req.session.username,role:"admin"}});}
export async function logout(req,res){
  if(req.session)await new Promise(resolve=>req.session.destroy(()=>resolve()));
  res.clearCookie("cashmemo.sid",sessionCookieOptions);
  res.json({ok:true});
}

const USERNAME_RE=/^[a-z0-9._-]{3,50}$/;

export async function updateCredentials(req,res){
  const currentPassword=String(req.body?.currentPassword||"");
  const newPassword=String(req.body?.newPassword||"");
  const rawUsername=String(req.body?.newUsername||"").trim().toLowerCase();
  if(!currentPassword||currentPassword.length>200)return res.status(400).json({error:"Enter your current password."});

  const user=await User.findOne({_id:req.session.userId,active:true});
  if(!user)return res.status(401).json({error:"Account not found. Please log in again."});
  // 403 (not 401) so the client does not treat a typo as an expired session.
  if(!(await bcrypt.compare(currentPassword,user.passwordHash)))return res.status(403).json({error:"Current password is incorrect."});

  const changes={};
  if(rawUsername&&rawUsername!==user.username){
    if(!USERNAME_RE.test(rawUsername))return res.status(400).json({error:"Username must be 3-50 characters: letters, numbers, dot, dash or underscore."});
    if(await User.exists({username:rawUsername,_id:{$ne:user._id}}))return res.status(409).json({error:"That username is already taken."});
    changes.username=rawUsername;
  }
  if(newPassword){
    if(newPassword.length<10||newPassword.length>200)return res.status(400).json({error:"New password must be 10-200 characters long."});
    if(newPassword===currentPassword)return res.status(400).json({error:"New password must be different from the current one."});
    changes.passwordHash=await bcrypt.hash(newPassword,12);
  }
  if(!Object.keys(changes).length)return res.status(400).json({error:"Nothing to change. Enter a new username or a new password."});

  try{Object.assign(user,changes);await user.save();}
  catch(err){if(err?.code===11000)return res.status(409).json({error:"That username is already taken."});throw err;}

  // Fresh session id after a credential change.
  await new Promise((resolve,reject)=>req.session.regenerate(err=>err?reject(err):resolve()));
  const userId=String(user._id);
  req.session.userId=userId;req.session.username=user.username;

  // A new password signs out every other device/browser.
  if(changes.passwordHash){
    try{await mongoose.connection.collection("sessions").deleteMany({_id:{$ne:req.sessionID},session:{$regex:`"userId":"${userId}"`}});}
    catch(err){console.warn("Could not clear other sessions:",err.message);}
  }

  const parts=[];
  if(changes.username)parts.push("Username");
  if(changes.passwordHash)parts.push("Password");
  res.json({user:{username:user.username,role:user.role},message:`${parts.join(" and ")} updated.${changes.passwordHash?" Other devices were signed out.":""}`});
}
