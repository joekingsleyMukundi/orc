const Dashboard = require('../../models/dashmodel/dash');
const Loan = require('../../models/dashmodel/loan');
const Transaction = require('../../models/finances/transactions');
exports.loandashboard = async (req,res, next)=>{
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
   const transactions = await Transaction.find({ user: user._id })
        .sort({ createdAt: -1 })  // Sort by createdAt in descending order
        .limit(6)
    const loans = await Loan.find({user:user._id});
    res.render("loans",{
        message:req.flash('error'),
        user,
        dashboard,
        transactions,
        loans,
    });
}

exports.requestLoan = async (req, res, next) => {
    const user = req.session.user;
    const { amount } = req.body;

    try {
        if (amount =="" || amount <= 0) {
            req.flash('error', 'Invalid loan amount.');
            return res.redirect('/loans');
        }

        const newLoan = new Loan({
            user: user._id,
            amount
        });
        await newLoan.save();

        req.flash('success', 'Loan request submitted successfully.');
        res.redirect('/loans');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while requesting the loan.');
        res.redirect('/loans');
    }
};