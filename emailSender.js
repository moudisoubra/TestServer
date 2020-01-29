    console.log("emailer up");
    var fs = require('fs');
    var path = require('path');

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
    let HelperOptions = {
        from: '"Form Dummy" testdummynodejs@gmail.com',
        to: 'moudisoubra001@gmail.com',
        subject: 'Job Application Form', 
        text: 'This is another test email'
    };
    transporter.sendMail(HelperOptions, (error, info) => {
        if(error){
            console.log(error);
        }
        console.log("Email sent");
        console.log(info);
    })
