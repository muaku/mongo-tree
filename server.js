const express = require("express")
const app = express()
//const dbConnect = require("./database.js")
const bodyParser = require('body-parser')

// require database.js and this.db will active
var dbConnect = require("./database").start

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE")
  next();
});

app.get("/", (req, res)=>{
	res.send("SERVER ON PORT 3000 is RUNNING")
})

/*
	SAVE Data
	JSON data should contain room,node,sensor
*/
app.post("/addTopic", function(req, res){

	//console.log("db: ", db)

	var data = {
		room: req.body.room,
		node: req.body.node,
	 	sensor: req.body.sensor
	}
	 
	// db.collection("room").insert( { _id: "Books", path: null } )
	// db.collection("room").insert( { _id: "Programming", path: ",Books," } )
	// db.collection("room").insert( { _id: "Databases", path: ",Books,Programming," } )

	// check room
	this.db.collection("rooms").findOne({ roomNumber: data.room }, function(err, result){
		if (err) { return res.send(err) }
		if (result) { 
			console.log(" rooms "+ data.room +" already exist")
			console.log("roomNumber result: ", result)
		}
		else {
			// insert room into collection
			this.db.collection("rooms").insert({ roomNumber: data.room, path: null }, function(err, done){
				if (err) {
					return res.status(404).send(err)
				}
				console.log("SAVE NODE DONE")
			})
		}
	})

	// check nodeName where path
	var nodePath = ","+data.room+","
	this.db.collection("rooms").findOne({ $and: [{ nodeName: data.node}, { path: nodePath }]}, function(err, result){
		if (err) { return res.send(err)}
		if (result) { console.log(" Node "+ data.node +" already exist!")}
		else {
			this.db.collection("rooms").insert({ nodeName: data.node, path: nodePath}, function(err, done){
				if (err) {
					return res.send(err)
				}
				console.log("SAVE NODE DONE")
			})
		}
	})


	// Check sensorName with Path
	var sensorPath = ","+data.room+","+data.node+","
	this.db.collection("rooms").findOne({ $and: [{ sensorName: data.sensor}, { path: sensorPath }]}, function(err, result){
		if (err) { return res.send(err)}
		if (result) { console.log("Sensor "+ data.sensor + " already exist!")}
		else {
			this.db.collection("rooms").insert({ sensorName: data.sensor, path: sensorPath}, function(err, done){
				if (err) {
					console.log("ERR: ", err )
					return res.status(404).send(err)
				}
				console.log("SAVE SENSOR DONE")
			})
		}
	})

	res.status(200).send("DONE")
})

/*
	QUERY DATA from mongothis.db
*/

/*
	Get: BY ROOM with room parameter
	EX: GET http://localhost:3000/getTopic/room/908
*/
app.get("/getTopic/room/:room", function(req, res){
	var room = req.params.room
	// Get data that contain room's number
	this.db.collection("rooms").find({ "path": {$regex : ".*"+room+".*"}}).toArray(function(err, result){
		//console.log(result)
		res.send(result)
	})
	//console.log(result)
	//res.status(200).send(result)
})

/*
	Get: BY ROOM/NODE with room&node parameter
	EX: GET http:localhost:3000/getTopic/room/908/node/A
*/

app.get("/getTopic/room/:room/node/:node", function(req, res){
	var room = req.params.room
	var node = req.params.node
	// Get data that contain room number & node
	this.db.collection("rooms").find({ "path": {$regex : ".*"+room+".*"+node+".*"}}).toArray(function(err, result){
		//console.log(result)
		res.send(result)
	})
	//console.log(result)
	//res.status(200).send(result)
})



app.listen(3000, function(){
	console.log("Server is running on port 3000")
})
