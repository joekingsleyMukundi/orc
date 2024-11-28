exports.addons = async(req, res, next)=>{
    const user = req.session.user;
    const package = req.param.pkg;
    switch (package) {
        case "Basic":
            amount = 1000;
        case "Platnum":
            amount = 2500;
        case "Premium Adverts ":
            amount = 4800;
        case "Premium ":
            amount = 7000;
        case "Money Pass ":
            amount = 11000;
        case "Linkage Access ":
            amount = 9000;
        case "Game Acces ":
            amount = 500;
// Default multiplier if no valid package type
    }
    res.render('agent',{
        user: user,
    })
}