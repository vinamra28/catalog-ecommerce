const mailer  = require('../services/Mailer');
const generator = require('generate-password');
// const config = 

class Mail {

  forgotPassword(user, password) {
    return mailer.send(user.email,"forgotPassword",password).then((send)=>{
      return send;
    }).catch((err)=>{
      return Promise.reject(err);
    });
  }

  sendTokenEmail(user, token) {
    var link = "http://13.127.98.44:3000/api/user/verifyemail/"+user._id+"/"+token+""
    var subject = "Please confirm your Email account"
    var html = "Hello,\nPlease Click on the link to verify your email.\n<a href="+link+">Click here to verify</a>" 
    return mailer.send(user.email,subject,html).then((send)=>{
      return send;
    }).catch((err)=>{
      return Promise.reject(err);
    });
  }
}

module.exports = new Mail();
