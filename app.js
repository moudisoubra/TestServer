'use strict';
var restify = require("restify");
var fs = require("fs");
var mongoose = require('mongoose');
var server = restify.createServer();

console.log('Test server Activated');
//
var users = [];

var uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/MeltDown';

mongoose.connect(uristring, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to Mongoose!");
});

var usersSchema = new mongoose.Schema({
    user_ID: String,
    user_Name: String,
    user_House: String
});

var User = mongoose.model('User', usersSchema);

server.get("/Goodnight", function (req, res, next) 
{

    var goodnight = "Goodnight.";
    
    res.send(goodnight.toString());

});

server.get("/wakeup", function (req, res, next) {

    var string = "WakeUp!";

    res.send(string.toString());
});

server.get("/FindPlayer/:playerID", function (req, res, next) {

    var playerID = req.params.playerID;

    Player.findOne({ "player_ID": playerID }, (err, player) => {

        if (!player) {
            console.log("Didnt find a player with that ID");
        }
        else {
            console.log("Found player: " + player);

            var string = player.toString();

            res.send(player);//
        }
    });
});

server.get("/AddUser/:userID/:userName/:userHouse", function (req, res, next) {

    var userID = req.params.userID;
    var userName = req.params.userName;
    var userHouse = req.params.userHouse;

    User.findOne({ "user_ID": userID }, (err, user) => {

        if (!user) {

            console.log("Didnt find");

            var U = new User({
                "user_ID": userID,
                "user_Name": userName,
                "user_House": userHouse
            });

            console.log("Created: " + U);
            res.send({ U });

            U.save(function (err) { if (err) console.log('Error on save!') });
        }
        else 
        {

            user = new User({

                "user_ID": userID,
                "user_Name": userName,
                "user_House": userHouse
            });

            console.log("User Found: " + user);
            res.send({ user });

        }

    });


});

// server.get("/ChangeColor/:playerID/:r/:g/:b", function (req, res, next)
// {
//     var playerID = req.params.playerID;
//     var r = req.params.r;
//     var g = req.params.g;
//     var b = req.params.b;

//     Player.findOne({ "player_ID": playerID }, (err, player) => {

//         if (!player) {
//             console.log("Didnt find a player with that ID");
//         }
//         else {
//             console.log("Found player: " + player);

//             player.r = r;
//             player.g = g;
//             player.b = b;

//             player.save(function (err) { if (err) console.log('Error on save!') });

//             res.send({ player });
//         }
//     });
// });

// server.get("/leaderboard", function (req, res) {

//     Player.find({}).sort({ player_Score: -1 }).limit(10).exec(function (err, scores) 
//     {
//         var leaderboard = scores;

//         res.send({ leaderboard });
//     });
// });

// server.get("/clearOneMongo/:playerID", function (req, res) { 
//     //Sets the information based on the input from the user
//     var player_ID = req.params.playerID;
//     Player.findOneAndDelete({ "player_ID": player_ID }, (err, player) => { //Finds one user
//         if (!player) { //If we dont find the player within the database
//             console.log("Player already deleted!");
//         }
//         else {
//             console.log("Found player: " + player);
//             res.send({ player }); //The player already exists in the database & will be sent to us.
//         }
//     });
// });

// server.get("/ClearAll", function (req, res) { //BIG RED BUTTON

//     Player.remove({}, function (err) {
//         console.log('DataBase Wiped')

//         var string = "DataBase Wiped";
    
//         res.send(string.toString());
//     });

// });

// server.get("/SortByID", function (req, res) {

//     Player.find({}).sort({ player_ID: 1 }).exec(function (err, ID)
//     {
//         var leaderboard = ID;

//         console.log(leaderboard);

//         res.send({ leaderboard });
//     });

// });

// server.get("/listAllMongo", function (req, res) { //LISTS ALL PLAYERS IN THE DATABASE
//     Player.find(function (err, player) {

//         if (err) return console.error(err);

//         console.log(player);

//         res.send({ player });
//     });
// });

// server.get("/ListDataBaseCount", function (req, res) {

//     Player.count({}, function (err, c) {

//         res.send({ c });

//         console.log('Count is ' + c);
//     });

// });
    
//--------------------------------------------------------------SAVING TO FILE--------------------------------------------------------------------------//

server.listen(process.env.PORT || 3000, function () { /// Heroku Port process.env.PORT

    //console.log(process.env.PORT);

});
