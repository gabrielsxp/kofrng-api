const nodemailer = require('nodemailer');
const UserController = require('../Controller/UserController');
const dotenv = require('dotenv').config();

module.exports = {
    async sendRecovery(req, res) {
        var password = ''
        try {
            password = await UserController.generateNewPassword(req.body.email);
        } catch (error) {
            return res.status(400).send({ error });
        }

        const transporter = nodemailer.createTransport({
            host: "api.kofastools.com",
            port: 25,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.RECOVERY_EMAIL,
                pass: process.env.RECOVERY_EMAIL_PASSWORD
            },
            tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
            from: process.env.RECOVERY_EMAIL,
            to: `${req.body.email}`,
            subject: 'Your new password of Kofas Tools Dashboard',
            html: `<h2>Your New Password of Kofas Tools Dashbaord</h2><br/><p>Password: ${password}</p>`
        };

        transporter.sendMail(mailOptions, function (error, _) {
            if (error) {
                return res.status(400).send({ error: 'Unable to send this email. Try again later !' });
            } else {
                return res.status(200).send({ success: true });
            }
        });
    }
}