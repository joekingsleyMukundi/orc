const Dashboard = require("../../models/dashmodel/dash");
exports.cashback = async (req, res, next) => {
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
    const packageType = dashboard.package;
if(!dashboard.isCashback){
	req.flash('error', 'cashback is not active please buy a higher package');
        res.redirect('/wallet');
	return;
}
    try {
        // Check if all fields are provided
        var revenue;
        switch (packageType) {
        case "Basic":
            revenue =  0;
        case "Platnum":
            revenue = 5000;
        case "Premium_ads":
            revenue = 10000;
        case "Premium":
            revenue = 14000;
// Default multiplier if no valid package type
    }
        dashboard.appEarnings += revenue;
        dashboard.monthlyRevenue += revenue;
        dashboard.earningBalance += revenue;
	dashboard.isCashback = false;
        await dashboard.save();
        req.flash('success', 'Blog created successfully!');
        res.redirect('/wallet');
    } catch (error) {
        console.error('Error creating blog:', error);
        req.flash('error', 'Error creating blog post.');
        res.redirect('/wallet');
    }
};
