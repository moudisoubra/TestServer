'use strict';
var restify = require("restify");
var fs = require("fs");
var mongoose = require('mongoose');
var uuid = require('uuid');
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
    console.log("MongoDB online!");
});

var usersSchema = new mongoose.Schema({
    user_ID: String,
    user_Password: String,
    user_Name: String,
    user_Gender: String, 
    user_Seniority: String,
    user_House: Number,
    user_Login: String
});

var User = mongoose.model('User', usersSchema);

server.get("/wakeup", function (req, res, next) {

    var string = "Server is awake!";

    res.send(string.toString());
});

server.get("/FindUser/:userID", function (req, res, next) {

    var userID = req.params.userID;

    User.findOne({ "user_ID": userID }, (err, user) => {

        if (!user) 
        {
            console.log("Didnt find a user with that ID");

            var string = "Didn't find a user with that ID";

            res.send(string.toString());
        }
        else 
        {
            console.log("Found User: " + user);

            var string = user.toString();

            res.send(user);
        }
    });
});



server.get("/AddUser/:userID/:userName/:userGender/:userSeniority/:userHouse/:userLogin/:userPassword", function (req, res, next) {

    var userID = req.params.userID;
    var userName = req.params.userName;
    var userGender = req.params.userGender;
    var userSeniority = req.params.userSeniority;
    var userHouse = req.params.userHouse;
    var userLogin = req.params.userLogin;
    var userPassword = req.params.userPassword;

    User.findOne({ "user_ID": userID }, (err, user) => {

        if (!user) {

            console.log("Didnt find");

            var U = new User({
                "user_ID": userID,
                "user_Name": userName,
                "user_Gender": userGender,
                "user_Seniority": userSeniority,
                "user_House": userHouse,
                "user_Login": userLogin,
                "user_Password": userPassword
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
                "user_Gender": userGender,
                "user_Seniority": userSeniority,
                "user_House": userHouse, 
                "user_Login": userLogin,
                "user_Password": userPassword
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

server.get("/DeleteUser/:userID", function (req, res) { 
    
    var userID = req.params.userID;

    User.findOneAndDelete({ "user_ID": userID }, (err, user) => { 

        if (!user) { 
            console.log("Player already deleted!");
        }
        else {
            console.log("Found player: " + user);
            res.send({ user });
        }
    });
});

server.get("/ClearAll", function (req, res) { //BIG RED BUTTON

    User.remove({}, function (err) {
        console.log('DataBase Wiped')

        var string = "DataBase Wiped";
    
        res.send(string.toString());
    });

});

server.get("/SortByID", function (req, res) {

    User.find({}).sort({ user_ID: 1 }).exec(function (err, ID)
    {
        var leaderboard = ID;

        console.log(leaderboard);

        res.send({ leaderboard });
    });

});

server.get("/listAllMongo", function (req, res) { //LISTS ALL PLAYERS IN THE DATABASE
    User.find(function (err, user) {

        if (err) return console.error(err);

        console.log(user);

        res.send({ user });
    });
});

server.listen(process.env.PORT || 3000, function () { /// Heroku Port process.env.PORT

    //console.log(process.env.PORT);

});
