// jshint esversion:8
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
  user:{
    type: String,
    required: true,
    unique:true
  },
  downlines:[{
    type: String,
  }],
  affiliateEarnings:{
     type:Number,
     default:0
  },
  monthlyRevenue:{
    type:Number,
    default:0
  },
  earningBalance:{
    type:Number,
    default:0
  },
  depositeBalance:{
    type:Number,
    default:0
  },
  appEarnings:{
    type:Number,
    default:0
  },
  withdrawals:{
    type:Number,
    default:0
  },
  package:{
    type: String,
    required: true,
  },
},
{ timestamps: true });
const Dashboard = new mongoose.model('Dashboard',dashboardSchema);
module.exports= Dashboard;
