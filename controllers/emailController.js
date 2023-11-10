const { validationResult } = require("express-validator");
const { Resend } = require("resend");
const sanitizeHtml = require("sanitize-html");
const emailTemplate = require("../templates/emailTemplate");

const resend = new Resend(process.env.AUTH_TOKEN);

exports.sendEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const html = emailTemplate(name, email, subject, sanitizedMessage);

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [process.env.EMAIL_USER],
      subject: `New message from ${name}`,
      html: html,
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
