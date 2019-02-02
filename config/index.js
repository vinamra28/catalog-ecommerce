let path = require('path')
global.rootPath = path.normalize(path.join(__dirname, "..", ".."));
let dev = require("./dev");
let prod = require("./prod");
let app_conf = (process.env.NODE_ENV == "production") ? prod : dev;

app_conf.isDevMode = () => {
	return (process.env.NODE_ENV == "development") ? true : false;
};
app_conf.isProduction = () => {
	return (process.env.NODE_ENV == "production") ? true : false;
};

module.exports = app_conf;
