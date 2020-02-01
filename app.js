
var mongoose = require('mongoose');
var express = require('express');
var uploader = require("./upload")
var blogger = require("./blogcontroller")();
var teams = require("./team")
var sorts = require("./sort")
var events = require("./eventSystem")
var photoUploader = require("./uploadPhoto");
var awarder = require("./AwardController.js");
var emailer = require("./emailSender.js");
var useExpress = express();
var filesystem = require("fs");
var multer = require("multer");
var http = require("http").Server(useExpress).listen(process.env.PORT || 3001);
//console.log((blogger));

var users = [];

const Uploader = new uploader(useExpress, express, mongoose);
const Blogger = new blogger.blogger(useExpress, mongoose);
const Teams = new teams(useExpress, mongoose);
const Sorts = new sorts(useExpress, mongoose, Teams);
const Events = new events(useExpress, mongoose);
const Awarder = new awarder(useExpress, mongoose);
const Emailer = new emailer(useExpress);

//const pu = new photoUploader(useExpress, mongoose, filesystem, multer)
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


//Picture, Name, nationality, position, department, Property, Date of Joining (DOJ)
var usersSchema = new mongoose.Schema({
    user_ID: String,
    user_Password: String,
    user_Name: String,
    user_Gender: String, 
    user_Seniority: String,
    user_House: Number,
    user_Login: String,
    user_Nationality: String, 
    user_Department: String,
    user_DOJ: String,
    user_Property:String,
    user_Position: String
});

var User = mongoose.model('User', usersSchema);

useExpress.get("/wakeup", function (req, res) {

    var string = "Server is awake!";
    

    res.send(string.toString());
});


useExpress.get("/TryFunction", function (req, res) {
    pu.checkFunction();
});

useExpress.get("/FindUser/:userID", function (req, res) {

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
    //var userSeniority = req.body.userOccupation;
    var userHouse = req.body.userHouse;
    var userLogin = req.body.userLogin;
    var userPassword = "J@"+userID;
    var userNationality = req.body.userNationality;
    var userDOJ = req.body.userMonth + "/" + req.body.userDay + "/" + req.body.userYear;
    var userProperty = req.body.userProperty;
    var userPosition = req.body.userPosition;
    var userDepartment = req.body.userDepartment;
    var userPicture = req.files.picture;

    console.log(userID + " " + userName + " " + userNationality 
    + " " +userPosition + " " + userDepartment + " " + userDOJ + " " + userProperty );

    User.findOne({ "user_ID": userID }, (err, user) => {

        if (!user) 
        {

            console.log("Didnt find");

            picUploader(userPicture, userID.toString());

            createRecruit(userID.toString(), userName.toString(), userNationality.toString()
            ,userPosition.toString(), userDepartment.toString(), userDOJ.toString(), userProperty);

            var U = new User({
                "user_ID": userID,
                "user_Name": userName,
                "user_Gender": userGender,
                "user_House": userHouse,
                "user_Login": userLogin,
                "user_Password": userPassword,
                "user_Nationality": userNationality, 
                "user_Department": userDepartment,
                "user_DOJ": userDOJ,
                "user_Property":userProperty,
                "user_Position": userPosition
            });

            console.log("Created: " + U);
            
            U.save(function (err) { if (err) console.log('Error on save!');});
            res.sendFile(__dirname+"/userCreated.html");
        }
        else 
        {
            picUploader(userPicture, userID.toString());
            createRecruit(userID.toString(), userName.toString(), userNationality.toString()
            ,userPosition.toString(), userDepartment.toString(), userDOJ.toString(), userProperty);
            user = new User({
                "user_ID": userID,
                "user_Name": userName,
                "user_Gender": userGender,
                "user_House": userHouse,
                "user_Login": userLogin,
                "user_Password": userPassword,
                "user_Nationality": userNationality, 
                "user_Department": userDepartment,
                "user_DOJ": userDOJ,
                "user_Property":userProperty,
                "user_Position": userPosition
            });

            console.log("User Found: " + user);
            res.sendFile(__dirname+"/userCreated.html");

        }

    });

});



//-----------------------------------------------------------------------------------------------------Picture Uploads-----------------------------------//
console.log("PIC UPLOAD UP");
var picSchema = new mongoose.Schema({
 
     imgName: String,
     img: { data: Buffer, contentType: String }

 });

 var picModel = mongoose.model('pics', picSchema);


 function picUploader(file, name)
 {
 file.mv("./Uploads/" + file.name, function(err){

     if(err){
         console.log(err);
         res.send(err);
     }
     else{

         var newItem = new picModel();
         newItem.img.data = filesystem.readFileSync(__dirname + "/Uploads/" + file.name)
         newItem.img.contentType = 'image/png';
         newItem.imgName = name;
         newItem.save();
     }
 });
 }

 function checkFuction()
     {
         console.log("THIS WORKS")
 }



useExpress.get("/picPage", function(req, res)
{
    res.sendFile(__dirname+"/uploadPic.html");
})

useExpress.post('/uploadPic',function(req,res){

 var file = req.files.picture;

 console.log("pic: " + file);
 console.log("Pic Name: " + file.name);
 console.log("Path : " + __dirname + "/Uploads/" + file.name);


 picUploader(file, req.body.userName);


});

useExpress.get('/showPicture/:pictureName', function (req, res, next) {

 var picName = req.params.pictureName;

 picModel.findOne({ "imgName": picName }, (err, pic) => {
     if(!pic)
     {
         res.send("No PIC FOUND");
     }
     else{
        res.contentType(pic.img.contentType);
        res.send(pic.img.data);
     }
   if (err) return next(err);

   //res.send(pic.img);
 });

});

useExpress.get("/listAllPics", function (req, res) { 
        
    picModel.find(function (err, pic) {
        
        if (err) return console.error(err);
        
        console.log(pic.imgName);
        
        res.send({ pic });
    });
});
useExpress.get("/clearAllPics", function (req, res) { 
    picModel.remove({}, function (err) {
        console.log('Pics DataBase Wiped')

        var string = "Pics DataBase Wiped";
    
        res.send(string.toString());
    });

});
 
 //-----------------------------------------------------------------------------------------------------Picture Uploads-----------------------------------//
 //-----------------------------------------------------------------------------------------------------New User Uploads-----------------------------------//
 var recruitsSchema = new mongoose.Schema({
 
    recruit_ID: String,
    recruit_Name: String,
    recruit_Nationality: String,
    recruit_Department: String,
    recruit_Position: String,
    recruit_DOJ: String,
    recruit_Property: String

});

var recruitsModel = mongoose.model('Recruits', recruitsSchema);

function createRecruit(ID, name, nationality, position, department, DOJ, property)
{
    recruitsModel.findOne({ "recruit_ID": ID }, (err, recruit) => {

        if (!recruit) 
        {
            var U = new recruitsModel({
                "recruit_ID": ID,
                "recruit_Name": name,
                "recruit_Nationality": nationality,
                "recruit_Department": department,
                "recruit_Position": position,
                "recruit_DOJ": DOJ,
                "recruit_Property": property
            });

            console.log("Recruited: " + U);

            U.save(function (err) { if (err) console.log('Error on save!');});
        }
    });
}

useExpress.get("/listAllRecruits", function (req, res) { 
        
    recruitsModel.find(function (err, recruit) {
        
        if (err) return console.error(err);
        
        //console.log(recruit);
        
        res.send({ recruit });
    });
});
useExpress.get("/clearAllRecruits", function (req, res) { 
    recruitsModel.remove({}, function (err) {
        console.log('Recruits DataBase Wiped')

        var string = "Recruits DataBase Wiped";
    
        res.send(string.toString());
    });

});
// useExpress.listen(process.env.PORT || 3000, function () { /// Heroku Port process.env.PORT

//     //console.log(process.env.PORT);

// });
