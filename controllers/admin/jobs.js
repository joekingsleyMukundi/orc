const Dashboard = require("../../models/dashmodel/dash");
const JobAccounts = require("../../models/dashmodel/jobsaccounts");
const JobsDashboard = require("../../models/dashmodel/jobsdash");

exports.adminJobdashboard = async (req, res, next)=>{
    const user = req.session.user;
    const jobs = await JobsDashboard.findOne({user: user._id})
    const accounts = await JobAccounts.find({
    status: { $nin: ["Sold", "Processing"] }
    });
    const myaccounts = await JobAccounts.find({ 
        buyer: user._id 
    });
    res.render('jobproccesser',{
        message:req.flash('error'),
        user,
        jobs,
        accounts,
        myaccounts
    })
}