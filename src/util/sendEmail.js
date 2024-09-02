const nodemailer = require("nodemailer");

const Config = require('../../config.json');

/**
 * Sends an email to a specified address.
 * 
 * @param {BigInt} address - The user ID to fetch data for.
 * @param {String} subject - The email subject.
 * @param {String} body - The email body.
 * @returns {Promise<Object>} - The response data.
 */
module.exports = async function(address, subject, body) {
    try {
        const transport = nodemailer.createTransport({
            host: Config.Email.Host,
            port: Config.Email.Port,
            auth: {
                user: Config.Email.User,
                pass: Config.Email.Password,
            },
        });

        const Res = await transport.sendMail({
            from: Config.Email.From,
            to: address,
            subject: subject,
            html: body,
        });

        return Res;
    } catch (error) {
        console.error('[REQUEST] Error sending email:', error);
        throw error;
    }
};
