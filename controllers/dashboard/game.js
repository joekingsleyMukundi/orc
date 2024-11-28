const Dashboard = require("../../models/dashmodel/dash");
exports.games = async(req, res, next)=>{
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
    res.render('game',{
        user: user,
        dashboard
    })
}
exports.gamesupdate = async(req, res, next)=>{
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
    const { funds } = req.body;
    console.log("mimi")
    console.log(funds)
    dashboard.depositeBalance = funds
    await dashboard.save();
    res.json({ success: true, newBalance: dashboard.depositeBalance });
}
