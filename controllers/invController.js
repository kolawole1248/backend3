const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const grid = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    grid,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  // ============================================
  // NEW: Add classification dropdown for inventory management
  // ============================================
  const classificationSelect = await utilities.buildClassificationList()
  
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,  // ✅ ADDED: Pass classification dropdown to view
    errors: null
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classResult = await invModel.addClassification(classification_name)

  if (classResult.rowCount > 0) {
    // Refresh nav to include new classification
    nav = await utilities.getNav()
    req.flash("notice", `Classification "${classification_name}" was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  })
}

/* ***************************
 *  Process new inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body

  const invData = {
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  }

  const invResult = await invModel.addInventory(invData)

  if (invResult.rowCount > 0) {
    req.flash("notice", `Inventory item "${inv_make} ${inv_model}" was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, adding the inventory item failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...invData // Make form sticky
    })
  }
}

/* ***************************
 *  Trigger intentional error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // Intentionally cause an error
  throw new Error("Intentional 500 error triggered from footer link")
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if(data.length > 0) {
    return res.json(data)
  } else {
    return res.json([]) // Return empty array if no data
  }
}

module.exports = invCont