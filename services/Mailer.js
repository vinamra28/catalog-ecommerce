const nodemailer = require('nodemailer');
const constant = require('../config')

class Mailer {

  constructor() {
    this.transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: constant.mailgun_user,
        pass: constant.mailgun_pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  send(to, subject, html) {
    return new Promise((resolve, reject) => {
      this.transport.sendMail({ from: constant.mailgun_user, to, subject, html }, (err, info) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log('Info:', info);
        return resolve(info)
      });
    });
  }
}

module.exports = new Mailer();