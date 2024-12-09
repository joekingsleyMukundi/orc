const axios = require("axios")
const moment = require("moment");
const Dashboard = require("../../models/dashmodel/dash");
const Transaction = require("../../models/finances/transactions");
const { sendMail } = require("../../utils/mails");
const User = require("../../models/authmodel/user");
const formatPhoneNumber = require('../../utils/auth/phoneverify');
const WhatsAppDashboard = require("../../models/dashmodel/whatsappdashboard");

exports.wallet = async(req,res, next)=>{
    const user = req.session.user;
    const whatsappdash = await WhatsAppDashboard.findOne({user:user._id})
    const dashboard = await Dashboard.findOne({ user: user._id });
    const transactions = await Transaction.find({ user: user._id })
        .sort({ createdAt: -1 })  
    const buytrans = await Transaction.find({ user: user._id, Transactiontype:'Deposit' })
        .sort({ createdAt: -1 })
    const formattedTransactions = transactions.map(transaction => ({
        orderId: transaction.Transactioncode,
        billingName: transaction.Billingname,
        date: transaction.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        total: `KES${transaction.Amount}`,  // Format amount as currency
        status: transaction.Status,
        paymentMethod: transaction.Paymentmethod,
        Phone: transaction.Phone,
        Transactiontype: transaction.Transactiontype // Map the payment method icon and text
    }));
    res.render("wallet",{
        successmessage:req.flash('success'),
        errormessage:req.flash('error'),
        user,
        dashboard,
        buytrans: buytrans,
        transactions: formattedTransactions,
        whatsappdash: whatsappdash
    })
}
exports.withdraw = async (req, res, next) => {
  try {
    const user = req.session.user;
    const dashboardData = await Dashboard.findOne({ user: user._id });
    const whatsappdash = await WhatsAppDashboard.findOne({user:user._id})
     const wmodule =req.body.module;
console.log("mimimiimimiimimmimi"+wmodule)
console.log(typeof wmodule) 
    if (!dashboardData) {
      req.flash('error', 'User dashboard data not found');
      res.redirect('/withdraw');
      return;
    }

    if (req.method === 'POST') {
      var amount = dashboardData.earningBalance;
       if(wmodule == "affiliates" ){
	  amount = dashboardData.affiliateEarnings;
	}
    if(wmodule == "Whatsapp" ){
      amount = whatsappdash.activeBalance ;
    }
      var original_amount = dashboardData.earningBalance
	  if(wmodule == "affiliates"){
         original_amount = dashboardData.affiliateEarnings;
        }
    if(wmodule == "Whatsapp" ){
      original_amount = whatsappdash.activeBalance ;
    }
	var balance = dashboardData.earningBalance
	if(wmodule == "affiliates"){
         balance = dashboardData.affiliateEarnings;
        }
      if(wmodule == "Whatsapp" ){
      balance = whatsappdash.activeBalance ;
    }
      amount =Math.ceil(Number(amount)*1)
      // Check for sufficient balance
      if (amount > balance) {
        req.flash('error', 'Insufficient balance');
        res.redirect('/withdraw');
        return;
      }

      // Generate random alphanumeric transaction code
      const generateTransactionCode = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)];
        const randomLetters = Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        return randomNum + randomLetters;
      };

      const transactionCode = generateTransactionCode();
       var tmodule = "withdraw"
	 if(wmodule== "affiliates"){
         	tmodule = "affiliates";
        }
        if(wmodule== "Whatsapp"){
         	tmodule = "Whatsapp";
        }
      // Create a new transaction
      const newTransaction = new Transaction({
        user: user._id,
        Billingname: user.fullname,
        Amount: amount,
        Phone: user.phone,
        Transactioncode: transactionCode,
        Status: 'Pending',
        Paymentmethod: 'Mpesa',
        Transactiontype: 'Withdraw',
        Transactionmodule: tmodule,
      });

      await newTransaction.save();

      // Deduct balance from dashboard
	if(wmodule== "affiliates"){
                 dashboardData.affiliateEarnings -= Number(original_amount);
        }
        if(wmodule== "Whatsapp"){
                 whatsappdash.activeBalance -= Number(original_amount);
        }
if(wmodule == undefined){
	console.log("mimimimi"+ wmodule)
	 dashboardData.earningBalance -= Number(original_amount);
	}
  if(wmodule == "Whatsapp"){
	console.log("mimimimirrrr"+ wmodule)
	 whatsappdash.withdrawn += Number(original_amount);
	}
      dashboardData.withdrawals += Number(amount)
      await dashboardData.save();
      await whatsappdash.save();
      const message  = `Dear customer, you have successfully withdrawn KES ${amount} courtesy of Metapay. Besure to continue earning with us!`;
      const subj = "Withdrawal";
      await sendMail(user.fullname,user.email,subj,message);
      req.flash('success', 'Withdrawal request successful, please wait for confirmation');
      res.redirect('/wallet');
      return;
    }
  } catch (error) {
    console.error('Error in withdrawal:', error);
    req.flash('error', 'An error occurred during withdrawal');
    res.redirect('/wallet');
  }
};

exports.mpesapayment= async(req,res)=>{
    console.log(req.query);
    var amount = req.query.amount;
    const option = req.query.option;
    const phone = req.session.user.phone
    if (option) {
    switch (option) {
        case "Basic":
            amount = 1000;
            break;
        case "Platnum":
            amount = 2500;
            break;
        case "Premium_ads":
            amount = 4800;
            break;
        case "Premium ":
            amount = 7000;
            break;
        case "Money_pass":
            amount = 9000;
            break;
        case "Associate":
            amount = 7000;
            break;
        case "Partner":
            amount = 8000;
            break;// Default value if no valid package is selected
	case "Linkage_access":
	     amount = 14000;
	     break;
    }
}

    console.log(amount);
    var user;
    try {
      user = req.session.user;
    } catch (error) {
      console.log(error);
    }
    let url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    let auth =  "Bearer " + req.access_token;
    let Timestamp = moment().format('YYYYMMDDHHmmss')
    let password = new Buffer.from("4078895"+ "921234bd44fba65ac807170d7153f0781ebd5a906ddf6d07405fe22916cc5c9e" + Timestamp).toString('base64')
    const callback = `https://Metapayquestagencies.com/callback/${user._id}?option=${option}`
    axios({
        url:url,
        method:"POST",
        headers:{
            "Authorization" : auth
        },
        data:{
            "BusinessShortCode": "4078895",
            "Password":password,
            "Timestamp":Timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": "4142903",
            "PhoneNumber": phone,
            "CallBackURL": callback,
            "AccountReference": `Account in Metapay for user :${user.fullname}`,
            "TransactionDesc": "proccess subscription payment"
        }
    })
    .then((response)=>{
        req.flash('success', 'Request made sucessfully');
        res.redirect('/wallet')
    })
    .catch((error)=>{
        req.flash('error', 'Request has an error');
        res.redirect('/wallet')
        console.log(error)
    })
}

exports.callback = async (req,res,next)=>{
  console.log("......sts......")
  console.log(req.body)
  const user_id=req.params.id
  const op = req.query.option;
  console.log(op);
  if (req.body.Body.stkCallback.ResultDesc == "The service request is processed successfully.") {
      const item_data = req.body.Body.stkCallback.CallbackMetadata
      const data = item_data.Item
      console.log(data)
      const amount=data[0].Value;
      const transaction_code = data[1].Value
      const filteredResult = data.find((data) => data.Name == 'PhoneNumber');
      const phone = filteredResult.Value;
      try {
        const user_dashboard = await Dashboard.findOne({user:user_id})
        const useracc =  await User.findOne({_id:user_id})
        const upline_id = useracc.upline;
	console.log("mimim")
console.log(user_dashboard)
console.log(typeof op)
        if (op != 'undefined'){
console.log("tutu")
            user_dashboard.package = op;
	    user_dashboard.isCashback = true;
	 console.log(user_dashboard)
            if(upline_id){
                const upline_dashboard = await Dashboard.findOne({user:upline_id})
                upline_amount = amount * 0.75;
                upline_dashboard.affiliateEarnings += Number(upline_amount);
                await upline_dashboard.save();
            }
        }else{
console.log("kuku")
          user_dashboard.depositeBalance += Number(amount);   
        }
        await user_dashboard.save();
console.log(user_dashboard)
        const newTransaction = new Transaction({
        user: user_id,
        Billingname: useracc.fullname,
        Amount: amount,
        Phone: phone,
        Transactioncode: transaction_code,
        Status: 'Completed',
        Paymentmethod: 'Mpesa',
        Transactiontype: 'Deposit',
        Transactionmodule: 'Payment',
      });
        await newTransaction.save();
        req.flash('success', 'deposit made sucessfully');
      } catch (error) {
        console.log(error);
        req.flash('error', 'Internal server error');
      }
console.log("end")
    res.redirect('/wallet')
    return;
  }else{
    req.flash('error', 'Something went wrong with your payment try again');
    res.redirect('/wallet')
  }
}
