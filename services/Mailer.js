const sgMail = require("@sendgrid/mail");

module.exports = async ({ subject, recipients }, content) => {
  sgMail.setApiKey(process.env.SEND_GRID_KEY);
  const formattedRecipients = recipients.map(({ email }) => email);
  const msg = {
    to: formattedRecipients,
    from: process.env.FROM_EMAIL,
    subject: subject,
    html: content,
  };
  await sgMail.send(msg);
};
