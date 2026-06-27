require("dotenv").config();
const {Resend} = require("resend")
const {welcomeEmailTemplate} = require("./emailTemplate");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(fullname,email){
    try{
        await resend.emails.send({
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: "Welcome to ChatPulse",
            html: welcomeEmailTemplate(fullname),
        })
        console.log(`welcome message send to email : ${email}`);
    }
    catch(err){
        console.log(`Error in sending message to ${email}:`, err.message);
    }
}
module.exports ={
    sendEmail,
}