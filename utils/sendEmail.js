const nodemailer=require('nodemailer')
const sendEmail=async(options)=>{
const transporter=nodemailer.createTransport({
    service:process.env.SMTP_SERVICE,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD,

    }
})
const mailOptions={
    host:"smtp.gmail.com",
    port:465,
    from:process.env.SMTP_MAIL,
    to:options.email,
    subject:options.subject,
    text:options.message,
};
try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
} catch (error) {
    console.error('Error sending email:', error);
}

}

module.exports=sendEmail;