const nodemailer = require("nodemailer");

const Config = require("../../config.json");

/**
 * Sends an email to a specified address.
 *
 * @param {String} address - The email address to send to.
 * @param {String} subject - The email subject.
 * @param {String} body - The email body.
 * @returns {Promise<Object>} - The response data.
 */
module.exports = async function (address, subject, body) {
  try {
    const Email = Config.Email2;

    const transport = nodemailer.createTransport({
      host: Email.Host,
      port: Email.Port,
      auth: {
        user: Email.User,
        pass: Email.Password,
      },
    });

    const Res = await transport.sendMail({
      from: Email.From,
      to: address,
      subject: subject,
      html: body,
    });

    return Res;
  } catch (error) {
    console.error("[REQUEST] Error sending email:", error);
    throw error;
  }
};
