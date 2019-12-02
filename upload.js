var express = require("express"),
    upload = express(),
    http = require("http").Server(upload).listen(process.env.PORT || 3000);
    uploadFile = require("express-fileupload");
    filesystem = require("fs");

    upload.use(uploadFile())

    console.log("Upload Server Started!")
    var fileNamePublic;
    upload.get("/uploadpage", function(req, res)
    {
        res.sendFile(__dirname+"/index.html");
    })

    upload.post("/", function(req, res){
        if(req.body){

            console.log(req.body.fileText + "LLOOOOKKKKK ATTTT THISSSSS")

            var file = req.body.fileName,
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

        var name = req.params.picName;//ss
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