const sgMail = require('@sendgrid/mail')

const sgAPIkey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sgAPIkey)


// const mailjet = require ('node-mailjet')
// .connect('****************************1234', '****************************abcd')
// const request = mailjet
// .post("send", {'version': 'v3.1'})
// .request({
//   "Messages":[
//     {
//       "From": {
//         "Email": "danyapavl20.03@gmail.com",
//         "Name": "Yiknok"
//       },
//       "To": [
//         {
//           "Email": "danyapavl20.03@gmail.com",
//           "Name": "Yiknok"
//         }
//       ],
//       "Subject": "Greetings from Mailjet.",
//       "TextPart": "My first Mailjet email",
//       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
//       "CustomID": "AppGettingStartedTest"
//     }
//   ]
// })
// request
//   .then((result) => {
//     console.log(result.body)
//   })
//   .catch((err) => {
//     console.log(err.statusCode)
//   })




const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danyapavl20.03@gmail.com',
        subject: 'Thank ypu for joining!',
        text: `Hi, ${name}, thank you for using our service!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'danyapavl20.03@gmail.com',
        subject: 'Deleting account',
        text: `Hi, ${name}, thank you for using our service! You delete your account, please attach the reason.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}