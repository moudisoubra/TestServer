'use strict';
var restify = require("restify");
var fs = require("fs");
var mongoose = require('mongoose');
var server = restify.createServer();

console.log('Hello Soubra, Server activated');
//
var playerProfile = [];
var uristring =
    process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/MeltDown';

mongoose.connect(uristring, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to Mongoose!!!!! Mabroooook");
});

var playerProfileMongo = new mongoose.Schema({
    player_ID: String,
    player_Name: String,
    player_Hat_ID: Number,
    player_Score: Number,
    r: Number,
    g: Number,
    b: Number
});

var Player = mongoose.model('Player', playerProfileMongo);

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

server.get("/SaveMongoose/:playerID/:playerName/:playerHatID/:playerScore/:r/:g/:b", function (req, res, next) {

    var playerID = req.params.playerID;
    var playerName = req.params.playerName;
    var playerHatID = req.params.playerHatID;
    var playerScore = req.params.playerScore;
    var r = req.params.r;
    var g = req.params.g;
    var b = req.params.b;

    Player.findOne({ "player_ID": playerID }, (err, player) => {

        if (!player) {

            console.log("Didnt find");

            var pl = new Player({
                "player_ID": playerID,
                "player_Name": playerName,
                "player_Hat_ID": playerHatID,
                "player_Score": playerScore,
                "r": r,
                "g": g,
                "b": b
            });

            console.log("Created: " + pl);
            res.send({ pl });

            pl.save(function (err) { if (err) console.log('Error on save!') });
        }
        else 
        {

            player = new Player({

                "player_ID": playerID,
                "player_Name": playerName,
                "player_Hat_ID": playerHatID,
                "player_Score": playerScore,
                "r": r,
                "g": g,
                "b": b

            });

            console.log("Found player: " + player);
            res.send({ player });

        }

    });


});

server.get("/ChangeColor/:playerID/:r/:g/:b", function (req, res, next)
{
    var playerID = req.params.playerID;
    var r = req.params.r;
    var g = req.params.g;
    var b = req.params.b;

    Player.findOne({ "player_ID": playerID }, (err, player) => {

        if (!player) {
            console.log("Didnt find a player with that ID");
        }
        else {
            console.log("Found player: " + player);

            player.r = r;
            player.g = g;
            player.b = b;

            player.save(function (err) { if (err) console.log('Error on save!') });

            res.send({ player });
        }
    });
});

server.get("/ChangePlayerName/:playerID/:playerName", function (req, res, next)
{
    var playerID = req.params.playerID;
    var playerName = req.params.playerName;

    Player.findOne({ "player_ID": playerID }, (err, player) => {
        if (!player)
        {
            console.log("Didnt find a player with that ID");
        }
        else {
            console.log("Found player: " + player);
            player.player_Name = playerName;
            player.save(function (err) { if (err) console.log('Error on save!') });
            res.send({ player });
        }
    });

});

server.get("/ChangePlayerScore/:playerID/:playerScore", function (req, res, next)
{
    var playerID = req.params.playerID;
    var playerScore = req.params.playerScore;

    Player.findOne({ "player_ID": playerID }, (err, player) => {
        if (!player)
        {
            console.log("Didnt find a player with that ID");
        }
        else {

            if (playerScore > player.player_Score)
            {
                console.log("Found player: " + player);
                player.player_Score = playerScore;
                player.save(function (err) { if (err) console.log('Error on save!') });
                res.send({ player });
            }
            else
            {
                var string = ("Player Score is Higher");
                res.send({ string });
            }
        }
    });

});

server.get("/leaderboard", function (req, res) {

    Player.find({}).sort({ player_Score: -1 }).limit(10).exec(function (err, scores) 
    {
        var leaderboard = scores;

        res.send({ leaderboard });
    });
});

server.get("/ChangePlayerHat/:playerID/:playerHatID", function (req, res, next) {

    var playerID = req.params.playerID;
    var playerHatID = req.params.playerHatID;

    Player.findOne({ "player_ID": playerID }, (err, player) => {
        if (!player) {
            console.log("Didnt find a player with that ID");
        }
        else {
            console.log("Found player: " + player);
            player.player_Hat_ID = playerHatID;
            player.save(function (err) { if (err) console.log('Error on save!') });
            res.send({ player });
        }
    });

});

server.get("/clearOneMongo/:playerID", function (req, res) { //REMOVES ONE PLAYER FROM THE DATABASE BASED ON ID SCORE
    //Sets the information based on the input from the user
    var player_ID = req.params.playerID;
    Player.findOneAndDelete({ "player_ID": player_ID }, (err, player) => { //Finds one user
        if (!player) { //If we dont find the player within the database
            console.log("Player already deleted!");
        }
        else {
            console.log("Found player: " + player);
            res.send({ player }); //The player already exists in the database & will be sent to us.
        }
    });
});

server.get("/ClearAll", function (req, res) { //BIG RED BUTTON

    Player.remove({}, function (err) {
        console.log('DataBase Wiped')

        var string = "DataBase Wiped";
    
        res.send(string.toString());
    });

});

server.get("/SortByID", function (req, res) {

    Player.find({}).sort({ player_ID: 1 }).exec(function (err, ID)
    {
        var leaderboard = ID;

        console.log(leaderboard);

        res.send({ leaderboard });
    });

});

server.get("/listAllMongo", function (req, res) { //LISTS ALL PLAYERS IN THE DATABASE
    Player.find(function (err, player) {

        if (err) return console.error(err);

        console.log(player);

        res.send({ player });
    });
});

server.get("/ListDataBaseCount", function (req, res) {

    Player.count({}, function (err, c) {

        res.send({ c });

        console.log('Count is ' + c);
    });

});

//--------------------------------------------------------------SAVING TO FILE--------------------------------------------------------------------------//

server.get("/AddPlayerProfile/:playerID/:score/:aesthetic/:r/:g/:b", function (req, res, next) {

    console.log('Add player');

    var obj = {};
    obj.id = req.params.playerID;
    obj.score = req.params.score;
    obj.aesthetic = req.params.aesthetic;
    obj.r = req.params.r; 
    obj.g = req.params.g; 
    obj.b = req.params.b; 
    playerProfile.push(obj);
    res.send({playerProfile});
    next();

});

server.get("/Print", function (req, res, next) {

    console.log('print');
    res.send({playerProfile});
    next();

});

server.get("/DeleteArray", function (req, res, next) {

    console.log('print');
    playerProfile.length = 0;
    res.send({ playerProfile });
    next();

});

server.get("/ReadFile", function (req, res, next) {

    fs.readFile("temp.txt", function (err, buf) {

        var string = buf.toString();

        res.send(JSON.parse(string));
        
    });
});

server.get("/SaveFile", function (req, res, next) {

    var data = JSON.stringify(playerProfile);

    fs.writeFile("temp.txt", data, (err) => {

        if (err) console.log(err);

        res.send("Successfully Written to File Manually.");
        console.log("Successfully Written to File Manually.");
    });
});


function SavingToFile()
{
    var data = JSON.stringify(playerProfile);

    fs.writeFile("temp.txt", data, (err) => {

        if (err) console.log(err);

        console.log("Successfully Written to File.");
    });

}
    
//--------------------------------------------------------------SAVING TO FILE--------------------------------------------------------------------------//

server.listen(process.env.PORT || 3000, function () { /// Heroku Port process.env.PORT

    //console.log(process.env.PORT);

});
