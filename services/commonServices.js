// email service
var nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    clientId: "900119512552-khu1tgl6mkh0khqvgggik8q7esgu3tcs.apps.googleusercontent.com",
    clientSecret: "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"
  }
});
exports.sendMail = function(sendMailTo, subject, mailContent) {
     var mailOptions = {
    from: " <help@jewellerybrandname.com>", // sender address
    to: sendMailTo, // list of receivers
    subject: subject+" ✔", // Subject line
    text: "Email", // plaintext body
    html: mailContent, // html body
    auth: {
      user: "help.orangeclips@gmail.com",
      refreshToken: "1//04WgeO6lcDfr1CgYIARAAGAQSNwF-L9Ir6nYFnvxpKqqYkMgsKWurcCC2MUX0z9C6oCQTYrQnghd37gcmo4-Dwx04hKllU2oBGew",
      accessToken: "ya29.a0Aa4xrXO244q0JUj0yC9MayrOlySmbu9UgD66Eh-m3ILaS8uoDNFAyNX019TknMYFLf1-2MzAEBzKD48fsE0CylYHTAJQt2jSt7pcvPcQZ-ENU3Jrhkc7l3BFC6qVzePM2TVWGP5QKFsSB6J9jdsytg31tqh2aCgYKATASARISFQEjDvL9aLs2T69T8H2g49TtfSb7Rw0163",   
      expires : 1918789886000
    }
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error){
      console.log(error)
    } 
    else{
      console.log("sent")
    } 
  });
};
