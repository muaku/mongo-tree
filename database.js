var MongoClient = require("mongodb").MongoClient
var mongodb_url = "mongodb://localhost:27017/myTreeDB"

var dbConnect = {
	start: MongoClient.connect(mongodb_url, function(err, database){
		if (err) { return console.log(err)}
		console.log("Connected to mongodb")
		//console.log("DB: ", database)
		// Apply database to Global variable db
		this.db = database
	})
}

module.exports = dbConnect
