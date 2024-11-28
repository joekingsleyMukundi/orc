const RequireAuth = (req,res,next)=>{
  if (!req.session.user){
    return res.redirect('/auth_signin')
  }
  next();
};

module.exports = RequireAuth;