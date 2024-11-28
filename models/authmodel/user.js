const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Password = require('../../utils/auth/password');
const userSchema =  new Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    upline:{
        type: String,
    },
    resetPasswordToken:String,
    resetPassworExpire:Date,
},{ timestamps: true });

userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
    // console.log(this.get('password'));
    const password  =  await Password.toHash(this.get('password'));
    this.set('password', password);
  }
  done();
})


userSchema.methods.getResetPasswordToken = function(){
  // create reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  // hash reset token and set to reset pass token field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // set expire 
  this.resetPassworExpire =Date.now() +10*60*1000;
  return resetToken;
};

const User = new mongoose.model('User',userSchema);
module.exports= User;