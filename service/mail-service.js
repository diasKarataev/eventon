const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_KEY
            }
        })
    }
    async sendActivationMail(to, link){
        const htmlContent = `
        <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
        </div>
    `;
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта Eventon',
            text: '',
            html: htmlContent
        })
    }
    async sendMailing(mails, message) {
        try {
            const htmlContent = `
            <div>
                <h1>От администрации eventon</h1>
                <p>${message}</p>
            </div>
        `;

            for (const user of mails) {
                await this.transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: user,
                    subject: 'Eventon',
                    text: '',
                    html: htmlContent
                });
            }

            console.log('Emails sent successfully!');
        } catch (error) {
            console.error('Error sending emails:', error);
            throw error;
        }
    }
}

module.exports = new MailService();