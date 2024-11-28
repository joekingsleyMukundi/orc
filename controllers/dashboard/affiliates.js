const User = require("../../models/authmodel/user");
const Dashboard = require("../../models/dashmodel/dash");
const Transaction = require("../../models/finances/transactions");
const { getUserActivities } = require('../../services/activityService');
const { getTopProducts } = require('../../services/productService');
exports.affiliate = async (req, res, next)=>{
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
    // Fetch downlines for the current user
    const downlines = await User.find({ upline: user._id });

    res.render('affiliates',{
	successmessage:req.flash('success'),
        errormessage:req.flash('error'),
        user,
        dashboard,
        downlines
    })
}

exports.deleteDownline = async (req, res, next)=>{
    const user = req.session.user;
    const downlineId = req.params.id;
    const dashboard = await Dashboard.findOne({user:user._id});
    const downlineuser = await await User.findById(downlineId);
    downlineuser.verified = false;
    await downlineuser.save()
    // Fetch downlines for the current user
    const downlines = await User.find({ upline: user._id });
    req.flash('success', 'Downline deactivated');
    res.redirect('/downlines')
}

exports.downlineDashboard = async (req, res, next)=>{
    const currentuser = req.session.user;
    const downlineId = req.params.id;
    const user = await User.findById(downlineId);
    const dashboard = await Dashboard.findOne({user:downlineId});
    console.log(dashboard)
    if(!dashboard){
        req.flash('error', 'User Not active');
        res.redirect('/downlines')
        return;
    }
    // Fetch downlines for the current user
    const downlines = await User.find({ upline: currentuser._id, verified: true });
    const transactions = await Transaction.find({ user: downlineId })
        .sort({ createdAt: -1 })  // Sort by createdAt in descending order
        .limit(6)
    const topProducts = await getTopProducts();
    const activities = await getUserActivities(downlineId);
    // Destructure each activity to extract the activity text and date
    const formattedActivities = activities.map(activityString => {
        const activity = activityString.split(' at ')[0];  // Extract the activity part
        const date = activityString.split(' at ')[1];      // Extract the date part
        return { activity, date };                        // Return an object with activity and date
    });

    const formattedTransactions = transactions.map(transaction => ({
        orderId: transaction.Transactioncode,
        billingName: transaction.Billingname,
        date: transaction.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        total: `$${transaction.Amount}`,  // Format amount as currency
        status: transaction.Status,       
	paymentMethod: transaction.Paymentmethod,
        Phone: transaction.Phone,
        Transactiontype: transaction.Transactiontype  // Map the payment method icon and text
    }));

    res.render('index',{
        successmessage:req.flash('success'),
        errormessage:req.flash('error'),
        user,
        dashboard,
        downlines,
        transactions: formattedTransactions,
        topProducts,
        activities: formattedActivities
    })
}
