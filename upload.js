

function  Uploader(upload,express,mongoose){
    
    var 

    uploadFile = require("express-fileupload"),
    filesystem = require("fs");

    var pdfSchema = new mongoose.Schema({
         pdfName: String,
         pdfFullName: String
     });
    
     var pdfs = mongoose.model('pdfs', pdfSchema);


    upload.use(uploadFile())
    upload.use(express.static(__dirname + "/Uploads"));

    console.log("Upload Server Started!")

    var fileNamePublic;

    upload.get("/uploadpage", function(req, res)
    {

        res.sendFile(__dirname+"/index.html");
    })

    upload.get("/showPic/:picName", function(req, res)
    {
        var name = req.params.picName;
        res.type('text/html');
        pdfs.findOne({ "pdfName": name }, (err, user) => {

            if (!user) 
            {
                console.log("Didnt Find that PDF");
    
                var string = "Didnt Find that PDF";
    
                res.send(string.toString());
            }
            else 
            {
                var mainPart = '<iframe src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://testserversoubra.herokuapp.com/';
                var endPart = '" width="500" height="375" id = "resize"> </iframe> <script> var e=document.getElementById("resize");e.setAttribute("width",800);e.setAttribute("width",window.innerWidth);e.setAttribute("height", window.innerHeight);</script>';
        
                res.send(' <h1> This is the PDF </h1>' + mainPart + name + endPart + "'");
                console.log(' <h1> This is the PDF </h1>' + mainPart + name + endPart + "'");
            }
        });
        //res.send(' <h1> This is the PDF </h1> <embed src="/'+name+'" width ="200" Height="200"/>');

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

                        
                        var fullName = filename;
                        var splitName = fullName.split(".");
                        var firstName = splitName[0];
                        
                        console.log("This is the full name:     " + fullName);
                        console.log("This is the first Name:    " + firstName);
                        
                        res.send("Done! File Name: " + filename + "--------- This is the full name:     " + fullName + " -------------- This is the first Name:    " + firstName);

                        newPDF = new pdfs({

                            "pdfName": firstName,
                            "pdfFullName": fullName
                        });
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

    useExpress.get("/listAllPDFs", function (req, res) { //LISTS ALL PDFS IN THE DATABASE

        pdfs.find(function (err, pdf) {
    
            if (err) return console.error(err);
    
            console.log(pdf);
    
            res.send({ pdf });
        });
    });
    module.exports = Uploader;