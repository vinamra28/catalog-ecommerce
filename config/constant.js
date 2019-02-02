module.exports = {
  expiresIn: 60,
  secretKey: "wondersecret",
  issuer: 'wonderpillars',

  // SEND OTP
  SEND_OTP_PATH: 'https://control.msg91.com/api/sendotp.php?authkey=226810AIjzx4nh5b4f2dcc&otp_expiry=&template=&otp_length=6&message=&sender=COLLOBO&mobile=',
  VERIFY_OTP_PATH: 'https://control.msg91.com/api/verifyRequestOTP.php?authkey=226810AIjzx4nh5b4f2dcc&mobile='

};

