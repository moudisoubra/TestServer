var fs = require('fs');
var path = require('path');

var nodeMailer = require('nodemailer');
let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: 'false',
    port: 25,
    auth:{
        user: 'testdummynodejs@gmail.com',
        pass: 'nodeJS1234'
    },
    tls:{
        rejectUnauthorized: 'false'
    }
});
let HelperOptions = {
    from: '"Mohammad Soubra" testdummynodejs@gmail.com',
    to: 'moudisoubra001@gmail.com',
    subject: 'please work',
    text: 'please work more'
};
transporter.sendMail(HelperOptions, (error, info) => {
    if(error){
        console.log(error);
    }
    console.log("Email sent");
    console.log(info);
})