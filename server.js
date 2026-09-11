/**
 * Optional production-style API starter for MileMitra.
 * npm install express cors dotenv razorpay
 * Copy .env.example to .env and add your server-side keys.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const app = express();
app.use(cors({origin: process.env.WEB_ORIGIN || true}));
app.use(express.json());

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET})
  : null;

app.get('/api/health',(req,res)=>res.json({ok:true,service:'milemitra-api'}));

app.post('/api/payments/order', async (req,res)=>{
  try{
    if(!razorpay) return res.status(503).json({error:'Payment provider not configured'});
    const amount = Number(req.body.amount);
    if(!Number.isInteger(amount) || amount < 100) return res.status(400).json({error:'Invalid amount'});
    const order=await razorpay.orders.create({amount,currency:'INR',receipt:`ride_${Date.now()}`,notes:{rideId:String(req.body.rideId||'')}});
    res.json({id:order.id,amount:order.amount,currency:order.currency});
  }catch(e){res.status(500).json({error:'Could not create order'})}
});

app.post('/api/payments/verify',(req,res)=>{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  if(!process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({error:'Payment provider not configured'});
  const body=`${razorpay_order_id}|${razorpay_payment_id}`;
  const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
  const ok=crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(String(razorpay_signature||'')));
  res.status(ok?200:400).json({verified:ok});
});

// Production TODOs: auth/OTP, user verification, ride CRUD, route scoring,
// messaging, notification jobs, payment webhooks, refunds, receipts, safety events,
// moderation, audit logs, DPDP consent/retention, admin roles and observability.
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`MileMitra API listening on ${port}`));
