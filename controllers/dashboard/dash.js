const Dashboard = require('../../models/dashmodel/dash');
const User = require('../../models/authmodel/user')
const Transaction = require('../../models/finances/transactions');
const WhatsAppDashboard = require("../../models/dashmodel/whatsappdashboard");
exports.dashboard = async (req,res, next)=>{
    const user = req.session.user;
    const whatsappdash = await WhatsAppDashboard.findOne({user:user._id})
    const downlines = await User.find({ upline: user._id, verified: true });
    const dashboard = await Dashboard.findOne({user:user._id});
   const transactions = await Transaction.find({ user: user._id })
        .sort({ createdAt: -1 })  // Sort by createdAt in descending order
        .limit(6)

    const formattedTransactions = transactions.map(transaction => ({
        orderId: transaction.Transactioncode,
        billingName: transaction.Billingname,
        date: transaction.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        total: `$${transaction.Amount}`,  // Format amount as currency
        status: transaction.Status,
        paymentMethod: transaction.Paymentmethod,
        Phone: transaction.Phone,
        Transactiontype: transaction.Transactiontype
         // Map the payment method icon and text
    }));

    res.render("index",{
        successmessage:req.flash('success'),
        errormessage:req.flash('error'),
        user,
        dashboard,
        downlines,
        transactions: formattedTransactions,
        whatsappdash
    });
}