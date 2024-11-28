const crypto = require('crypto');
const User = require('../../models/authmodel/user');
const Dashboard = require('../../models/dashmodel/dash')
const {sendMail} = require('../../utils/mails')
const formatPhoneNumber = require('../../utils/auth/phoneverify');
const Password = require('../../utils/auth/password');
const { logActivity } = require('../../services/activityService');
const WhatsAppDashboard = require('../../models/dashmodel/whatsappdashboard');
const JobsDashboard = require('../../models/dashmodel/jobsdash');
const CryptoDash = require('../../models/dashmodel/cryptodashboard');
const BlogDashboard = require('../../models/dashmodel/blogsdashbard');
exports.registerUser =  async (req,res,next) => {
    if(req.session.user){
        res.redirect('/')
    }
    if(req.method == 'POST'){
        const{fullname,email,phone,password} = req.body;
        if (email == "" || fullname == "" || phone == ""||password=="") {
            req.flash('error','empty values cannot be submited');
            return res.redirect('/auth_signup');
        }
        const phoneNo = formatPhoneNumber(phone);
        if(phoneNo == undefined){
            req.flash('error','Phone number hassome issues');
            return res.redirect('/auth_signup');
        }
        const user = await User.findOne({phone:phoneNo});
        if(user){
            req.flash('error', 'Phone already exists');
            return res.redirect('/auth_signup');
        }
	const fuser = await User.findOne({fullname:fullname});
        if(fuser){
            req.flash('error', 'Name already exists');
            return res.redirect('/auth_signup');
        }
        User.findOne({email:email})
            .then(userDocs=>{
            if(userDocs){
                console.log(userDocs);
                req.flash('error', 'Email already exists');
                return res.redirect('/auth_signup');
            }
            const user = new User({fullname:fullname,email:email,password:password,phone:phoneNo});
            return user.save()
            .then( async newuser=>{
                console.log("meme2")
                console.log(req.query.invitedby);
                if(req.query.invitedby){
                    console.log("mememmmm111")
                }
                if(req.query.invitedby){
                    console.log("mememmmm")
                    const upline = await User.findOne({fullname:req.query.invitedby})
                    if(upline){
                        console.log(upline);
                        
                        newuser.upline = upline._id;
                       await newuser.save();
                    }
                }
                const activateUrl = `http://${req.get('host')}/activate/${newuser.id}`;
                const message  = `Welcome to LuxurPay ${newuser.fullname}. Please activate your account to get started. Click this link ${activateUrl}`;
                const subj = "Welcome";
                await sendMail(user.fullname,user.email,subj,message);
                logActivity(newuser.id, "Account registration")
                req.flash('success', 'Registration successful.Head to your email to activate account');
                return res.redirect(`/auth_email_verificaion/${user.email}`);
            });
        })
        .catch(error=>{
            console.log(error);
            req.flash('error', 'Error occured plese contact admin');
            return res.redirect('/auth_signup');
        });
    }else{
        res.render('register',{message:req.flash('error')})
    }
}
exports.loginUser = async (req,res,next)=>{
    if(req.session.user){
        console.log(req.session.user);
        return res.redirect('/')
    }
    if(req.method == 'POST'){
        if (req.body.email == "" || req.body.password == "") {
            req.flash('error','empty values cannot be submited');
            return res.redirect('/auth_signin');
        }
        const{email, password} = req.body;
        const existinguser = await User.findOne({email});
        if(!existinguser){
            req.flash('error', 'User does not exist');
            return res.redirect('/auth_signin')
        }
        const matchpassword = await Password.compare(existinguser.password, password);
        if(!matchpassword){
            req.flash('error', 'Wrong password');
            return res.redirect('/auth_signin')
        }
        if(!existinguser.verified){
            req.flash('error', 'User is not activated');
            return res.redirect('/auth_signin')
        }
        req.session.user = existinguser;
        req.session.is_loggedin=true;
        logActivity(existinguser._id, "Account sign in")
        return res.redirect('/')
    }else{
        res.render('login', {successmessage:req.flash('success'),errormessage:req.flash('error')})
    }
}
exports.emailConfirmation = async (req,res,next)=>{
    console.log("meme")
    console.log(req.params)
    const user  = await User.findOne({_id: req.params.id})
    console.log(user);
    if (!user){
        req.flash('error', 'User does not exist');
        return res.redirect('/auth_signup')
    }
    if(!user.verified){
        req.flash('error', 'User is not active');
        return res.redirect(`/auth_email_verificaion/${user.email}`)
    }
    req.session.user = user;
    req.session.is_loggedin = true
    logActivity(user._id, "User email confirmation")
    res.render('confirmem')
}
exports.emailVerification = async (req, res, next)=>{
    if(req.session.user){
        return res.redirect('/')
    }
    const email = req.params.email;
    const user = await User.findOne({email:email})
    if (!user){
        req.flash('error', 'User does not exist');
        return res.redirect('/auth_signup')
    }
    if (user.verified) {
        req.flash('error', 'User is already verified');
        return res.redirect('/auth_signin')
    }
    res.render('emailverification',{
        user,
    });
}
exports.emailVerificationApiController = async (req,res,next)=>{
    const id = req.params.id;
    if (id){
        const user = await User.findOne({_id:id});
        if(!user){
            req.flash('error', 'User doesnot exist');
            res.redirect('/auth_signup')
            return;
        }
        if(user.verified){
            req.flash('error', 'User is already active');
            res.redirect('/auth_signin')
            return;
        }
        user.verified = true;
        await user.save();
        const userDashboard= new Dashboard({user:user.id, package: "None"})
        const whatsappdash = new WhatsAppDashboard({user:user.id});
        const jobsdash = new JobsDashboard({user:user.id})
        const cryptodash = new CryptoDash({user:user.id})
        const blogsdash = new BlogDashboard({user:user.id})
        await userDashboard.save();
        await whatsappdash.save();
        await jobsdash.save();
        await cryptodash.save();
        await blogsdash.save();
        req.flash('success', 'Account activated successfully');
        res.redirect(`/auth_confirm_email/${id}`)
    }
}
exports.forgotPassword = async (req,res,next)=>{
    if(req.session.user){
            res.redirect('/')
    }
    if(req.method == 'POST'){
        if (req.body.email == "") {
            req.flash('error','empty values cannot be submited');
            return res.redirect('/auth_forgot_password');
        }
        const user = await User.findOne({email:req.body.email});
        if(!user){
            req.flash('error', 'User does not exist');
            return res.redirect('/auth_signin');
        }
        const resetToken = user.getResetPasswordToken();
        console.log(resetToken);
        const reseturl = `http://${req.get('host')}/auth_reset_password/${resetToken}`;
        const message  = `You are receiving this email because you (or someone else) has requested a reset of password. Please click this link ${reseturl}`;
        const subj = "Password Renewal";
        try {
            await sendMail(user.username,user.email,subj,message);
            req.flash('success' , 'Instructiions were sent to your email');
            res.redirect('/auth_forgot_password');
        } catch (error) {
            console.log(error);
            user.resetPasswordToken = undefined;
            user.resetPassworExpire = undefined;
            await user.save({validateBeforeSave: false});
            req.flash('error' , 'something went wrong');
            res.redirect('/auth_forgot_password');
        }
        await user.save(
        {
            validateBeforeSave: false
        });
    }else{
        res.render('recoverpw',{successmessage:req.flash('success'),errormessage:req.flash('error')});
    }
}
exports.resetPassword = async (req,res,next)=>{
    // get hashed token
    const resetpassToken  = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    console.log(resetpassToken);
    const user = await User.findOne({
        resetPasswordToken : resetpassToken,
    });

    console.log(user);
    if(!user){
        req.flash('error', 'User does not exist');
        return res.redirect(`/auth_signup`)
    }
    if(req.method == 'POST'){
        if (req.body.password == "") {
            req.flash('error','empty values cannot be submited');
            return res.redirect(`/auth_reset_password/${req.params.resettoken}`);
        }
        if (req.body.password !== req.body.repassword){
            req.flash('error','passwords should match')
            return res.redirect(`/auth_reset_password/${req.params.resettoken}`)
        }
        // set new pass
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPassworExpire= undefined;
        await user.save();
        req.session.user = user;
        req.session.is_loggedin = true
        logActivity(user._id,"Password reset")
        req.flash('success', 'Password reset');
        res.redirect('/')
    }else{
        res.render('resetpw',{ resettoken:req.params.resettoken, successmessage:req.flash('success'),errormessage:req.flash('error')})
    }
}
exports.logout=(req,res,next)=>{
  req.session.destroy(function(err) {
        if(err) {
            return next(err);
        } else {
            req.session = null;
            return res.redirect('/auth_signin');
        }
    });
};
