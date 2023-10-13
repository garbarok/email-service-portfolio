const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Resend } = require("resend");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();

const app = express();
const resend = new Resend(process.env.AUTH_TOKEN);

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
});

const envOrigins = {
  production: process.env.PRD_ORIGIN,
  preproduction: process.env.ACC_ORIGIN,
  development: process.env.DEV_ORIGIN,
};

const currentOrigin = envOrigins[process.env.ENVIRONMENT];

app.use(limiter);
app.use(cors({ origin: currentOrigin }));
app.use(bodyParser.json());

app.post("/send-email", async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).send("Bad Request");
    return;
  }

  (async function () {
    try {
      const sanitizedMessage = sanitizeHtml(message, {
        allowedTags: [],
        allowedAttributes: {},
      });
      const emailTemplate = (name, email, message) => `
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .email-container { background-color: #ffffff; margin: 50px auto; padding: 20px; border-radius: 8px; width: 80%; max-width: 600px; }
        h1 { color: #333; }
        p { color: #666; }
        pre { background-color: #eee; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>New message from ${name}</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <pre>${message}</pre>
    </div>
</body>
</html>
`;

      const html = emailTemplate(name, email, sanitizedMessage);
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: [process.env.EMAIL_USER],
        subject: `New message from ${name}`,
        html: html,
      });
      console.log(data);
      res.status(200).send("Email sent successfully");
    } catch (error) {
      console.error(error);
      next(error);
    }
  })();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}, CORS set to ${currentOrigin}`);
});
