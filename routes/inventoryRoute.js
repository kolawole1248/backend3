// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require('../utilities/classification-validation')
const invValidate = require('../utilities/inventory-validation')

// Route to build management view
router.get("/", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagement)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory by inventory id view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build add classification view
router.get("/add-classification", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to process add classification
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to process add inventory
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// ============================================
// NEW: AJAX route for inventory management
// ============================================
router.get("/getInventory/:classification_id", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.getInventoryJSON)
)

// ============================================
// NEW: Route to build edit inventory view
// ============================================
router.get("/edit/:inv_id", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildEditInventoryView)
)

// ============================================
// NEW: Route to process inventory update
// ============================================
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// ============================================
// NEW: Route to build delete confirmation view
// ============================================
router.get("/delete/:inv_id", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildDeleteConfirmationView)
)

// ============================================
// NEW: Route to process inventory deletion
// ============================================
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

// Route to trigger intentional error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router