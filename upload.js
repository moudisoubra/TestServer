

function  Uploader(upload,express){
    
    var 

    uploadFile = require("express-fileupload"),
    filesystem = require("fs");

    // var pdfSchema = new mongoose.Schema({
    //     user_ID: String,
    //     user_Password: String
    // });
    
    // var User = mongoose.model('User', usersSchema);


    upload.use(uploadFile())
    upload.use(express.static(__dirname + "/Uploads"));

    console.log("Upload Server Started!")

    var fileNamePublic;

    upload.get("/uploadpage", function(req, res)
    {
        res.sendFile(__dirname+"/index.html");
    })

    upload.get("/showPic", function(req, res)
    {
        var name = req.params.picName;
        res.type('text/html');
        
        //res.send(' <h1> This is the PDF </h1> <embed src="/'+name+'" width ="200" Height="200"/>');

        res.send(' <h1> This is the PDF </h1> <iframe src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://testserversoubra.herokuapp.com/sample.pdf" width="500" height="375">');
    })

    upload.get('/PDF/:pdfName', function(req, res){

        var pdf = req.params.pdfName;
        
        filesystem.readFile("./Uploads/" + pdf, function (err,data){
           res.contentType("application/pdf");
           res.send(data);
        });

    });

    upload.post("/", function(req, res){
        if(req.files){

            //console.log(req.body.fileText + " LLOOOOKKKKK ATTTT THISSSSS")

            var file = req.files.fileName,
                filename = req.files.fileName.name
                console.log(req.files.fileName.name + "  THIS IS THE FILE NAME")

                file.mv("./Uploads/" + filename, function(err){

                    if(err){
                        console.log(err);
                        res.send("Somethings not right:  " + filename);
                    }
                    else{

                        res.send("Done! File Name: " + filename);
                    }

                })
        
        }
    })

    upload.get("/downloadFile/:picName", (req, res) => {

        var name = req.params.picName;
        filesystem.readFile("./Uploads/"+name, (err, data) =>
        {
            if(err)
            {
                console.log("Cannot Read " + name + +err);
                res.send("{error: "  + name + "/////////" +err+"}");
            }
            else{
                res.send(data);
            }
        }
        )
        res.sendFile(__dirname, "./Uploads/"+name, function(err){

            if(err){
                console.log(err);
            }
            else{
                console.log("HERE IS THE PIC");
            }
        })

      });
    }
    module.exports = Uploader;