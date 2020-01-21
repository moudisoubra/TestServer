

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
        pdfs.findOne({ "pdfName": name }, (err, pdf) => {

            if (!pdf) 
            {
                console.log("Didnt Find that PDF");
    
                var string = "Didnt Find that PDF";
    
                res.send(string.toString());
            }
            else 
            {
                var mainPart = '<iframe src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://testserversoubra.herokuapp.com/';
                var endPart = '" width="500" height="375" id = "resize"> </iframe> <script> var e=document.getElementById("resize");e.setAttribute("width",800);e.setAttribute("width",window.innerWidth);e.setAttribute("height", window.innerHeight);</script>';
        
                res.send(mainPart + pdf.pdfFullName + endPart + "'");
                console.log(mainPart + pdf.pdfFullName + endPart + "'");
            }
        });
        //res.send(' <h1> This is the PDF </h1> <embed src="/'+name+'" width ="200" Height="200"/>');

    })

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
                        
                        //res.send("Done! File Name: " + filename + "--------- This is the full name:     " + fullName + " -------------- This is the first Name:    " + firstName);
                        res.sendFile(__dirname+"/pdfUploaded.html");
                        pdfs.findOne({ "pdfName": firstName }, (err, pdf) => {

                            if (!pdf) 
                            {
                    
                                var newPDF = new pdfs({

                                    "pdfName": firstName,
                                    "pdfFullName": fullName
                                });
                                
                                newPDF.save(function (err) { if (err) console.log('Error on save!') });
                            }
                            else 
                            {
                    
                                pdf = new pdfs({
                    
                                    "pdfName": firstName,
                                    "pdfFullName": fullName
                                });
                    
                                console.log("PDF Found: " + pdf);
                    
                            }
                        });    
                    }
                

            });
        
        }
    });

    setInterval(function() {
        console.log("KEEPING IT AWAKE");
    }, 1000 * 60 * 5); 

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
      
      upload.get("/listAllPDFs", function (req, res) { //LISTS ALL PDFS IN THE DATABASE
        
        pdfs.find(function (err, pdf) {
            
            if (err) return console.error(err);
            
            console.log(pdf);
            
            res.send({ pdf });
        });
    });

    upload.get("/ClearAllPDF", function (req, res) { //BIG RED BUTTON

        pdfs.remove({}, function (err) {
            console.log('PDF DataBase Wiped')
    
            var string = "PDF DataBase Wiped";
        
            res.send(string.toString());
        });
    
    });

    upload.get("/DeletePDF/:pdfName", function (req, res) { 
    
        var pdfName = req.params.pdfName;
    
        pdfs.findOneAndDelete({ "pdfName": pdfName }, (err, pdf) => { 
    
            if (!pdf) { 
                console.log("Player already deleted!");
            }
            else {
                console.log("Found player: " + pdf);
                res.send({ pdf });
            }
        });
    });
}
    module.exports = Uploader;