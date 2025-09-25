const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // inv_make is required
    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),

    // inv_model is required
    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),

    // inv_year is required and must be a valid year
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid vehicle year."),

    // inv_description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description (minimum 10 characters)."),

    // inv_price is required and must be a number
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    // inv_miles is required and must be a number
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage."),

    // inv_color is required
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a vehicle color."),

    // classification_id is required
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification.")
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      ...req.body // Make all form fields sticky
    })
    return
  }
  next()
}

module.exports = validate