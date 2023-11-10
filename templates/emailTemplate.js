const emailTemplate = (name, email, subject, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Message Received</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; background-color: #f4f4f4; line-height: 1.6; }
        .email-container { background-color: #ffffff; margin: auto; padding: 20px; border-radius: 8px; width: 100%; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        h1 { color: #333; }
        p { color: #666; }
        a { color: #0066cc; }
        pre { background-color: #eee; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
        @media (max-width: 600px) {
            .email-container { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <header>
            <img src="your-logo-url" alt="Your Logo" style="max-width: 100px;">
        </header>
        <h1>New message from ${name}</h1>
        <h2>Subject: ${subject}</h2>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <pre>${message}</pre>
    </div>
</body>
</html>
`;

module.exports = emailTemplate;
