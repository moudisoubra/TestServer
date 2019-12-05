'use strict';
var restify = require("restify");
var fs = require("fs");
var uploader = require("./upload")
var mongoose = require('mongoose');
var uuid = require('uuid');
var express = require('express');
var useExpress = express();
var BP =  require('body-parser');
var multer = require('multer');
//var server = restify.createServer();

var http = require("http").Server(express).listen(process.env.PORT || 3000);
var uploadFile = require("express-fileupload");
var filesystem = require("fs");

console.log('Test server Activated');
//
var users = [];

const Uploader = new uploader(useExpress, express);

//uploader.Uploader(express);

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

useExpress.get("/wakeup", function (req, res) {

    var string = "Server is awake!";

    res.send(string.toString());
});

useExpress.get("/FindUser/:userLogin", function (req, res) {

    var userLogin = req.params.userLogin;

    User.findOne({ "user_Login": userLogin }, (err, user) => {

        if (!user) 
        {
            console.log("Didnt find a user with that Login");

            var string = "Didn't find a user with that Login";

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

useExpress.get("/Login/:userLogin/:userPassword", function (req, res)
{

    var userLogin = req.params.userLogin;
    var userPassword = req.params.userPassword;

    User.findOne({ "user_Login": userLogin}, (err, user) => 
    {
        if  (!user)
        {
            var string = "Didn't find a user with that Login";

            console.log(string);

            res.send(string.toString());
        }
        else
        {
            if(userPassword === user.user_Password)
            {
                var string = "User Logged In";

                var string2 = user.toString();
                
                console.log(string);

                res.send(user);
            }
            else
            {
                var string = "Wrong Password";

                console.log(string);

                res.send(string.toString());
            }
        }
    });
});

useExpress.get("/AddUser/:userID/:userName/:userGender/:userSeniority/:userHouse/:userLogin/:userPassword", function (req, res) {

    //AddUser/1/Soubra/Male/Intern/1/Soubra/123

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

useExpress.get("/DeleteUser/:userID", function (req, res) { 
    
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

useExpress.get("/ClearAll", function (req, res) { //BIG RED BUTTON

    User.remove({}, function (err) {
        console.log('DataBase Wiped')

        var string = "DataBase Wiped";
    
        res.send(string.toString());
    });

});

useExpress.get("/SortByID", function (req, res) {

    User.find({}).sort({ user_ID: 1 }).exec(function (err, ID)
    {
        var leaderboard = ID;

        console.log(leaderboard);

        res.send({ leaderboard });
    });

});

useExpress.get("/listAllMongo", function (req, res) { //LISTS ALL PLAYERS IN THE DATABASE
    User.find(function (err, user) {

        if (err) return console.error(err);

        console.log(user);

        res.send({ user });
    });
});

// useExpress.listen(process.env.PORT || 3000, function () { /// Heroku Port process.env.PORT

//     //console.log(process.env.PORT);

// });
