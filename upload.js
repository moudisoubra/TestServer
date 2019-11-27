var express = require("express"),
    upload = express(),
    http = require("http").Server(upload).listen(process.env.PORT || 3000);
    uploadFile = require("express-fileupload");
    filesystem = require("fs");

    upload.use(uploadFile())

    console.log("Upload Server Started!")

    upload.get("/uploadpage", function(req, res)
    {
        res.sendFile(__dirname+"/index.html");
    })

    upload.post("/", function(req, res){
        if(req.files){

            console.log(req.files)

            var file = req.files.fileName,
                filename = file.name;
                
                file.mv("./Uploads/" + filename, function(err){

                    if(err){
                        console.log(err);
                        res.send("Somethings not right:  " + filename);
                    }
                    else{
                        res.send("Done!");
                    }

                })
        
        }
    })

    upload.get("/downlaodFile/:picName", (req, res) => {

        var name = req.params.picName;
        filesystem.readFile("./Uploads/"+name, (err, data) =>
        {
            if(err)
            {
                console.log("Cannot Read"+err);
                res.send("{error:"+err+"}");
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