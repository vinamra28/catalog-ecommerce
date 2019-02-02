const generator = require('generate-password');
const mailer = require('./Mailer');
const config = require('../config');

class MailService {

  forgotPassword(user, password) {
    return mailer.send(user.email, "forgotPassword", password).then((send) => {
      return send;
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  sendTokenEmail(user, token, res) {
    var link = config.basePath + "api/user/verifyemail/" + user._id + "/" + token + ""
    // var link = "http://localhost:3000/api/user/verifyemail/" + user._id + "/" + token + ""
    res.render('emailVerification', {
      info: link
    }, function (err, HTML) {
      var subject = "Please confirm your email account"
      return mailer.send(user.email, subject, HTML).then((send) => {
        return send;
      }).catch((err) => {
        return Promise.reject(err);
      });
    })
  }
}

module.exports = new MailService();
