const { body } = require("express-validator");

const validateEmail = [
  body("name").trim().not().isEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Must be a valid email address."),
  body("message").trim().not().isEmpty().withMessage("Message is required."),
  body("subject").trim().not().isEmpty().withMessage("Subject is required."),
];

module.exports = validateEmail;
