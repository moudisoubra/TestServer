var express = require("express"),
    upload = express(),
    http = require("http").Server(upload).listen(process.env.PORT || 3000);
    uploadFile = require("express-fileupload");
    filesystem = require("fs");

    upload.use(uploadFile())
    upload.use(Express.static(__dirname+'/Uploads'));

    console.log("Upload Server Started!")
    var fileNamePublic;
    upload.get("/uploadpage", function(req, res)
    {
        res.sendFile(__dirname+"/index.html");
    })

    upload.get("/showPic", function(req, res)
    {
        res.type('text/html');
        res.send(' <h1> This is the PDF </h1> <img class="logo" src="/Uploads/'+1+'.png" alt="PDF" id="kk"/>');
    })

    upload.post("/", function(req, res){
        if(req.files){

            console.log(req.body.fileText + " LLOOOOKKKKK ATTTT THISSSSS")

            var file = req.files.fileName,
                filename = req.body.fileText
                
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

        //res.sendFile(path.join(__dirname, "./Uploads/pic.jpg"));
      });