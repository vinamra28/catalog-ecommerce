require('../core/mongo')();
var UserModel = require('../models/user');

var userData = {
  firstName: "Shravan",
  email: "admin@admin.com",
  password: "admin",
  role: "ADMIN"
};


var admin = new UserModel(userData);
admin.save().then((user) => {
  console.info("user created: ", user);
  process.exit();
}).catch((err) => {
  console.error(err);
  process.exit();
});