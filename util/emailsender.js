const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

exports.sendMail=  async (email,URL) =>{
    const mailOptions={
        from:'My Movies',
        to:email,
        subject:"verification of email",
        html:`<p>click on below link to verify your account
                <a href="${URL}">click here</a>
                <br>
                valid upto 3 hours.
              </p>`
    }
   return await transporter.sendMail(mailOptions).then(console.log)
}