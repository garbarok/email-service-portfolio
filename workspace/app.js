const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Resend } = require('resend')
const rateLimit = require('express-rate-limit')
const sanitizeHtml = require('sanitize-html')
require('dotenv').config()

const app = express()
const resend = new Resend(process.env.AUTH_TOKEN)

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,
})

app.use(limiter)
app.use(cors({ origin: process.env.ORIGIN }))
app.use(bodyParser.json())

app.post('/send-email', async (req, res, next) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) {
    res.status(400).send('Bad Request')
    return
  }

  try {
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {},
    })

    await resend.emails.send({
      from: `${email}`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message:</p>
        <p>${sanitizedMessage}</p>
      `,
    })

    res.status(200).send('Email sent successfully')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Server error')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
