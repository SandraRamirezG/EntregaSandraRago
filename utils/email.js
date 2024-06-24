const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    let info = await transporter.sendMail({
        from: '"Your Company" <your-email@gmail.com>',
        to: to,
        subject: subject,
        text: text
    });

    console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;