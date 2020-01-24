function PhotoUploader(uploader, mongoose, fs, multer)
{

   var picSchema = new mongoose.Schema({
    
        imgName: String,
        img: { data: Buffer, contentType: String }
   
    });

    var picModel = mongoose.model('pics', picSchema);

    //uploader.use(multer({dest:__dirname+'Uploads/'}).any());

   uploader.get("/picPage", function(req, res)
   {
       res.sendFile(__dirname+"/uploadPic.html");
   })

   uploader.post('/uploadPic',function(req,res){

    var file = req.files.picture;

    console.log(req.body);
    console.log("Name: " + req.body.name);
    console.log("pic: " + file);
    console.log("Pic Name: " + file.name);
    console.log("Path : " + __dirname + "/Uploads/" + file.name);



    file.mv("./Uploads/" + file.name, function(err){

        if(err){
            console.log(err);
            res.send("Somethings not right:  " + filename);
        }
        else{
        
            var newItem = new picModel();
            newItem.img.data = fs.readFileSync(__dirname + "/Uploads/" + file.name)
            newItem.img.contentType = 'image/png';
            newItem.imgName = file.name;
            newItem.save();
        }
    });

   });

   uploader.get("/listAllPics", function (req, res) { //LISTS ALL PDFS IN THE DATABASE
        
    picModel.find(function (err, pic) {
        
        if (err) return console.error(err);
        
        console.log(pic);
        
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