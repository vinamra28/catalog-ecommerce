let path = require("path");
let pkg = require("../package.json");

let app_conf = {
	port: 3000,
	defaultPassword:"wonder@123",
	authKey:'226810AIjzx4nh5b4f2dcc',
	basePath:'http://13.127.98.44:3000',
	mailgun_user: 'shravan.wonderpillars@gmail.com',
  	mailgun_pass: 'Wonder@786',
	db: {
		// uri: process.env.MONGO_URI || "mongodb://localhost:" + pkg.config.dbPort + "/" + pkg.config.dbName,
		uri : "mongodb://collobo:collobodev1@ds251332.mlab.com:51332/collobo",
		options: {
			// useMongoClient: true,
			user: "",
			pass: "",
			keepAlive: 1
			}
		},

	logging: {
		console: {
			level: "debug"
		},

		file: {
			enabled: false,
			path: path.join(global.rootPath, "logs"),
			level: "info",
			json: false,
			exceptionFile: true
		},

		graylog: {
			enabled: false
			// servers: [ { host: "192.168.0.174", port: 12201 } ]
		},

		papertrail: {
			enabled: false,
			host: null,
			port: null,
			level: "debug",
			program: "vem"
		},

		logentries: {
			enabled: false,
			token: null
		},

		loggly: {
			enabled: false,
			token: null,
			subdomain: null
		},

		logsene: {
			enabled: false,
			token: null
		},

		logzio: {
			enabled: false,
			token: null
		}

	}
}

module.exports = app_conf;
