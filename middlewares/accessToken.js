const axios = require("axios")
const accessToken = (req,res,next)=>{
    const consumer_key = "zJ1pGMFwU2OR21kRxPKHdRLpaTXqsQbJ"
    const consumer_secret = "G5G1IZfIUxxfvgiw"
    const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const auth = "Basic " + new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
    axios.get( url,
        {
          headers : {
            "Authorization":auth
         }
        })
        .then((response)=>{
            req.access_token = response.data.access_token
            next()
         })
        .catch((error)=>{
            console.log(error)
        })
}

module.exports = accessToken;