var pkg = require("../package.json");

let app_conf = {
	port: 3000,
	db: {
		uri: process.env.MONGO_URI || "mongodb://localhost/" + pkg.config.dbName,
		options: {
			useMongoClient: true,
			user: "",
			pass: "",
			server: {
				socketOptions: {
					keepAlive: 1
				}
			}
		}
	},
	agendaTimer: "one minute",
};

module.exports = app_conf;