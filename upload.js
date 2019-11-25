var express = require("express"),
    upload = express(),
    http = require("http").Server(upload).listen(80);
    uploadFile = require("express-fileupload");

    upload.use(uploadFile())

    console.log("Server Started!")

    upload.get("/", function(req, res)
    {
        res.sendFile(__dirname+"/index.html");
    })

    upload.post("/upload", function(req, res){
        if(req.files){

            console.log(req.files)

            var file = req.files.fileName,
                filename = file.name;
                
                file.mv("./Uploads/" + filename, function(err){

                    if(err){
                        console.log(err);
                        res.send("Somethings not right");
                    }
                    else{
                        res.send("Done!");
                    }

                })
        
        }
    })