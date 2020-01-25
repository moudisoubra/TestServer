function PhotoUploader(uploader, mongoose, fs, multer)
{

   var picSchema = new mongoose.Schema({
    
        imgName: String,
        img: { data: Buffer, contentType: String }
   
    });

    var picModel = mongoose.model('pics', picSchema);


   uploader.get("/picPage", function(req, res)
   {
       res.sendFile(__dirname+"/uploadPic.html");
   })

   uploader.post('/uploadPic',function(req,res){

    var file = req.files.picture;

    console.log("pic: " + file);
    console.log("Pic Name: " + file.name);
    console.log("Path : " + __dirname + "/Uploads/" + file.name);



    file.mv("./Uploads/" + file.name, function(err){

        if(err){
            console.log(err);
            res.send("Somethings not right:  " + filename);
        }
        else{
            
            var fullName = file.name;
            var splitName = fullName.split(".");
            var firstName = splitName[0];

            var newItem = new picModel();
            newItem.img.data = fs.readFileSync(__dirname + "/Uploads/" + file.name)
            newItem.img.contentType = 'image/png';
            newItem.imgName = firstName;
            newItem.save();
        }
    });

   });

   uploader.get('/showPicture/:pictureName', function (req, res, next) {

    var picName = req.params.pictureName;

    picModel.findOne({ "imgName": picName }, (err, pic) => {
      if (err) return next(err);
      res.contentType(pic.img.contentType);
      res.send(pic.img.data);
      //res.send(pic.img);
    });

  });

   uploader.get("/listAllPics", function (req, res) { //LISTS ALL PDFS IN THE DATABASE
        
    picModel.find(function (err, pic) {
        
        if (err) return console.error(err);
        
        console.log(pic.imgName);
        
        res.send({ pic });
    });

    uploader.get("/clearAllPics", function (req, res) { //BIG RED BUTTON

        picModel.remove({}, function (err) {
            console.log('Pics DataBase Wiped')
    
            var string = "Pics DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });
});


}

module.exports = PhotoUploader;