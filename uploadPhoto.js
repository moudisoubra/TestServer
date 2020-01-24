function PhotoUploader(uploader, bodyparser, mongoose, fs, multer)
{

   var picSchema = new mongoose.Schema({
    
        imgName: String,
        img: { data: Buffer, contentType: String }
   
    });

    var picModel = mongoose.model('pics', picSchema);

    uploader.use(multer({dest:__dirname+'Uploads/'}).any());

   uploader.get("/picPage", function(req, res)
   {
       res.sendFile(__dirname+"/uploadPic.html");
   })

   uploader.post('/uploadPic',function(req,res){

    //var file = req.body.picture;

    console.log(req.body);
    console.log("Name: " + req.body.name);
    //console.log("pic: " + file);
    //console.log("Pic Name: " + file.name);

    // var newItem = new picModel();
    // newItem.img.data = fs.readFileSync(req.files.pic.path)
    // newItem.img.contentType = 'image/png';
    // newItem.imgName = req.files.pic.name;
    // newItem.save();
   });

   uploader.get("/listAllPics", function (req, res) { //LISTS ALL PDFS IN THE DATABASE
        
    picModel.find(function (err, pic) {
        
        if (err) return console.error(err);
        
        console.log(pic);
        
        res.send({ pic });
    });
});


}

module.exports = PhotoUploader;