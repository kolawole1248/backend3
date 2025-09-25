const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be alphanumeric
    body("classification_name")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("Classification name must contain only letters and numbers with no spaces.")
  ]
}

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate