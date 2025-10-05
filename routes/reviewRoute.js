const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")

// Route to add review
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.addReview)
)

// Route to build edit review view
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
)

// Route to update review
router.post(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.updateReview)
)

// Route to delete review
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router