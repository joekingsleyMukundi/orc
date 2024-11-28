const Dashboard = require("../../models/dashmodel/dash");
const JobAccounts = require("../../models/dashmodel/jobsaccounts");
const JobsDashboard = require("../../models/dashmodel/jobsdash");

exports.jobdashboard = async (req, res, next)=>{
    const user = req.session.user;
    const jobs = await JobsDashboard.findOne({user: user._id})
    const accounts = await JobAccounts.find({
    status: { $nin: ["Sold", "Processing"] }
    });
    const myaccounts = await JobAccounts.find({ 
        buyer: user._id 
    });
    res.render('dashboard-job',{
        message:req.flash('error'),
        user,
        jobs,
        accounts,
        myaccounts
    })
}
exports.addJob = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { name, location, subject, image, price } = req.body;

        // Validate required fields
        if (name == "" || location == "" || subject =="" || image == "" || price == "") {
            req.flash('error', 'Empty values cannot be submitted.');
            return res.redirect('/jobs_dashboard');
        }

        // Ensure price is a valid number
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            req.flash('error', 'Price must be a valid non-negative number.');
            return res.redirect('/jobs_dashboard');
        }

        // Create a new job account entry
        const newJob = new JobAccounts({
            name,
            location,
            subject,
            image,
            price: parsedPrice,
            status: 'active' // or whatever default status you need
        });

        // Save the new job to the database
        await newJob.save();

        // Redirect to the dashboard or another page after success
        res.redirect('/jobs_dashboard'); // Adjust the redirect path as needed
    } catch (error) {
        console.error(error);
        req.flash('error', 'Server error occurred while adding job.');
        res.redirect('/jobs_dashboard');
    }
};// Import JobsDashboard model

exports.buyAccount = async (req, res, next) => {
    try {
        const user = req.session.user; // Get user from session
        // Fetch the user's dashboard
        const dashboard = await Dashboard.findOne({ user: user._id });
        const jobDashboard = await JobsDashboard.findOne({user:user._id})
        if (!dashboard) {
            req.flash('error', "Dashboard not found for the user.");
            return res.redirect('/jobs_dashboard');
        }
        // Find the account to buy using the account ID from the request
        const account = await JobAccounts.findById(req.params.id);
        console.log(account)
        console.log(req.params.id)

        // Check if account exists
        if (!account) {
            req.flash('error', "Account not found.");
            return res.redirect('/jobs_dashboard');
        }
        // Check if the account is already sold
        if (account.buyer) {
            req.flash('error', "Account is already sold.");
            return res.redirect('/jobs_dashboard');
        }

        // Check if user has enough deposit balance
        if (dashboard.depositeBalance < account.price) {
            req.flash('error', "Insufficient balance to buy the account.");
            return res.redirect('/jobs_dashboard');
        }

        // Deduct the amount from user's deposit balance
        dashboard.depositeBalance -= account.price;

        // Update account status to "Processing" and set the buyer to the current user
        account.status = "Processing";
        account.buyer = user._id;

        // Add account ID to paccounts if it's not already there
        if (!jobDashboard.paccounts.includes(account._id.toString())) {
            jobDashboard.paccounts.push(account._id.toString());
        } else {
            req.flash('error', "Account is already in the purchase list.");
            return res.redirect('/jobs_dashboard');
        }

        // Save the updates
        await dashboard.save();
        await jobDashboard.save();
        await account.save();

        req.flash('success', "Account purchased successfully.");
        return res.redirect('/jobs_dashboard');

    } catch (error) {
        console.error("Error purchasing account:", error);
        req.flash('error', "An error occurred while processing the purchase.");
        return res.redirect('/jobs_dashboard');
    }
};
 // Import JobsDashboard model

exports.completePurchase = async (req, res, next) => {
    try {
        const user = req.session.user; // Get user from session

        // Find the user's dashboard
        const dashboard = await JobsDashboard.findOne({ user: user._id });
        if (!dashboard) {
            req.flash('error', "Dashboard not found for the user.");
            return res.redirect('/jobs_dashboard');
        }

        // Find the account to mark as "Sold" using the account ID from the request
        const account = await JobAccounts.findById(req.params.id);

        // Check if account exists and is in "Processing" status
        if (!account) {
            req.flash('error', "Account not found.");
            return res.redirect('/jobs_dashboard');
        }
        if (account.status !== "Processing") {
            req.flash('error', "Account is not in processing status.");
            return res.redirect('/jobs_dashboard');
        }

        // Update account status to "Sold"
        account.status = "Sold";
        await account.save();

        // Remove account ID from paccounts and add it to accounts in the user's dashboard
        const accountIdStr = account._id.toString();
        
        const paccountIndex = dashboard.paccounts.indexOf(accountIdStr);
        if (paccountIndex > -1) {
            dashboard.paccounts.splice(paccountIndex, 1); // Remove from paccounts
        } else {
            req.flash('error', "Account not found in processing list.");
            return res.redirect('/jobs_dashboard');
        }

        // Add to accounts array if not already present
        if (!dashboard.accounts.includes(accountIdStr)) {
            dashboard.accounts.push(accountIdStr); // Add to accounts
        }

        // Save the dashboard updates
        await dashboard.save();

        req.flash('success', "Account status updated to Sold successfully.");
        return res.redirect('/jobs_dashboard');

    } catch (error) {
        console.error("Error updating account status:", error);
        req.flash('error', "An error occurred while updating the account status.");
        return res.redirect('/jobs_dashboard');
    }
};


