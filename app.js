'use strict';
var mongoose = require('mongoose');
var express = require('express');
var uploader = require("./upload")
var blogger = require("./blogcontroller")
var teams = require("./team")
var sorts = require("./sort")
var events = require("./eventSystem")
var photoUploader = require("./uploadPhoto");
var useExpress = express();
var filesystem = require("fs");
var multer = require("multer");
var http = require("http").Server(useExpress).listen(process.env.PORT || 3000);

var users = [];

const Uploader = new uploader(useExpress, express, mongoose);
const Blogger = new blogger(useExpress, mongoose);
const Teams = new teams(useExpress, mongoose);
const Sorts = new sorts(useExpress, mongoose, Teams);
const Events = new events(useExpress, mongoose);
const pu = new photoUploader(useExpress, mongoose, filesystem, multer)

useExpress.use('/static', express.static('public'));
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
    // Red = 0, Blue = 1, Green = 2, Purple = 3.

    var userID = req.params.userID;
    var userName = req.params.userName;
    var userGender = req.params.userGender;
    var userSeniority = req.params.userSeniority;
    var userHouse = req.params.userHouse;
    var userLogin = req.params.userLogin;
    var userPassword = req.params.userPassword;
    
    User.findOne({ "user_ID": userID }, (err, user) => {

        if (!user) 
        {

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

    res.send("HI");

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

useExpress.get("/userPage", function(req, res)
{
    res.sendFile(__dirname+"/createUser.html");
});

useExpress.get("/mainPage", function(req, res)
{
    res.sendFile(__dirname+"/MainPage.html");
});


useExpress.post("/getUserInfo", function(req, res)
{
    var userID = req.body.userID;
    var userName = req.body.userName;
    var userGender = req.body.userGender;
    var userSeniority = req.body.userOccupation;
    var userHouse = req.body.userHouse;
    var userLogin = req.body.userLogin;
    var userPassword = req.body.userPassword;

    console.log(userID + " " + userName + " " + userGender + " " + userSeniority + " " + userHouse + " " + userLogin + " " + userPassword);

    User.findOne({ "user_ID": userID }, (err, user) => {

        if (!user) 
        {

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
            res.sendFile(__dirname+"/userCreated.html");

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
            res.sendFile(__dirname+"/userCreated.html");

        }

    });

});

// useExpress.listen(process.env.PORT || 3000, function () { /// Heroku Port process.env.PORT

//     //console.log(process.env.PORT);

// });
