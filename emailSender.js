    function emailer(emailer){
    console.log("emailer up");
    var fs = require('fs');
    var path = require('path');
    const pdfMake = require('./pdfmake.js');
    const vfsFonts = require('./vfs_fonts.js');
    pdfMake.vfs = vfsFonts.pdfMake.vfs;
    var nodeMailer = require('nodemailer');
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: 'true',
        auth:{
            user: 'testdummynodejs@gmail.com',
            pass: 'nodeJS1234'
        },
        tls:{
            rejectUnauthorized: 'false'
        }
    });


    emailer.get("/sendEmail/:subject/:content", function (req, res) {

        let HelperOptions = {
            from: '"Form Dummy" testdummynodejs@gmail.com',
            to: 'moudisoubra001@gmail.com',
            subject: req.params.subject, 
            text: req.params.content
        };

        transporter.sendMail(HelperOptions, (error, info) => {
            if(error){
                console.log(error);
                res.send("Email Failed");
            }
            console.log("Email sent");
            console.log(info);
            res.send("Email Sent");
        })
        
    });

    //res.sendFile(__dirname+"/createUser.html");

    emailer.get("/sendHTML/:subject/:content", function (req, res) {

        let HelperOptions = {
            from: '"Form Dummy" testdummynodejs@gmail.com',
            to: 'moudisoubra001@gmail.com',
            subject: req.params.subject, 
            attachments: [        {   // define custom content type for the attachment
                filename: 'form.html',
                path: 'Application.html',
                content: 'hello world!',
                contentType: 'text/html'
            }]
        };

        transporter.sendMail(HelperOptions, (error, info) => {
            if(error){
                console.log(error);
                res.send("Email Failed");
            }
            console.log("Email sent");
            console.log(info);
            res.send("Email Sent");
        })
        
    });
    //res.sendFile(__dirname+"/Application.html");

    emailer.get("/applicationPage", function(req, res)
    {
        res.sendFile(__dirname+"/test.html");
         
    });


    emailer.post('/pdf', (req, res, next)=>{
        //res.send('PDF');
    
        const fname = req.body.fname;
        const lname = req.body.lname;
        var download;
        var documentDefinition = {
            content: [
                {
                    style: 'tableExample',
                    color: '#444',
                    table: {
                        widths: [77.66666666666667,77.66666666666667,77.66666666666667,77.66666666666667,77.66666666666667,77.66666666666667],
                        //headerRows: 2,
                        // keepWithHeaderRows: 1,
                        body: [
                            [{text: 'INTERNAL VACANCY APPLICATION FORM', style: 'tableHeader', colSpan: 6, alignment: 'center', fillColor: '#CCCCCC'},
                            {}, {},{},'',''],
                            
                            [{text: 'Section 1 – Associate information', colSpan: 6, alignment: 'center', bold:true,color: 'black', fillColor: '#CCCCCC'}
                            , {}, {},{},'',''],
                            
                            [{text: 'Associate Name', colSpan: 1 , fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {},
                            {text: 'Department', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {}],
                                                
                            [{text: 'Associate #', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {},
                            {text: 'Division', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {}],
                            
                            [{text: 'Job Title', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {},
                            {text: 'Location', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {}],	
                            
                            [{text: 'Starting date in current position', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {},
                            {text: 'Line manager', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {}],
                            
                            [{text: 'Mobile #', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {},
                            {text: 'Email address', colSpan: 1, fontSize: 10},
                            {text: ' ', colSpan: 2, fontSize: 10},
                            {}],
                                                
                            [{text: 'Position applied for', colSpan: 6, alignment: 'center', bold:true,color: 'black', fillColor: '#CCCCCC'}
                            , {}, {},{},'',''],
                            
                            [{text: 'Position applied for', colSpan: 1, fontSize: 10, height: 100},
                            {text: ' ', colSpan: 5, fontSize: 10},
                            {},
                            {},
                            {},
                            {}],
                                                
                            [{text: 'Department', colSpan: 1, fontSize: 10, height: 100},
                            {text: ' ', colSpan: 5, fontSize: 10},
                            {},
                            {},
                            {},
                            {}],
                                                
                            [{text: 'Property', colSpan: 1, fontSize: 10, height: 100},
                            {text: ' ', colSpan: 5, fontSize: 10},
                            {},
                            {},
                            {},
                            {}],
                        ]
                    }
                }
                
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    margin: [0, 10, 0, 0],
                    color: 'black'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
                 
        };
    
        const pdfDoc = pdfMake.createPdf(documentDefinition);

        pdfDoc.getBase64((data)=>{



            res.writeHead(200, 
            {
                'Content-Type': 'application/pdf'
            });
    
            download = Buffer.from(data.toString('utf-8'), 'base64');

            fs.writeFile(__dirname + "/Uploads/whatever.pdf" , download, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 

            //console.log(download.path)
            //res.end(download);

                    let HelperOptions = {
                        from: '"Form Dummy" testdummynodejs@gmail.com',
                        to: 'moudisoubra001@gmail.com',
                        subject: "HI", 
                        attachments: [        {   // define custom content type for the attachment
                            filename: 'form.pdf',
                            path: __dirname + "/Uploads/whatever.pdf",
                            contentType: 'application/pdf'
                        }]
                    };

                    transporter.sendMail(HelperOptions, (error, info) => {
                        if(error){
                            console.log(error);
                            fs.unlink(__dirname + "/Uploads/whatever.pdf", function(err) {
                                if (err) {
                                  throw err
                                } else {
                                  console.log("Successfully deleted the file.")
                                }
                              })
                            res.send("Email Failed");
                        }
                        console.log("Email sent");
                        console.log(info);
                        fs.unlink(__dirname + "/Uploads/whatever.pdf", function(err) {
                            if (err) {
                              throw err
                            } else {
                              console.log("Successfully deleted the file.")
                            }
                          })
                        res.send("Email Sent");
                    })
        });
    
    });

}
module.exports = emailer;
