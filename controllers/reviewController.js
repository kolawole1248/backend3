const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Add new review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  const { inv_id, review_text, rating } = req.body
  const account_id = res.locals.accountData.account_id

  // Validation
  if (!review_text || !rating || rating < 1 || rating > 5) {
    req.flash("notice", "Please provide a valid review and rating (1-5 stars).")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  const result = await reviewModel.addReview(inv_id, account_id, review_text, parseInt(rating))

  if (result) {
    req.flash("notice", "Review added successfully!")
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
  }

  res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const review = await reviewModel.getReviewById(review_id)

  // Check if review exists and user owns it
  if (!review || review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "Review not found or access denied.")
    return res.redirect("/inv/")
  }

  let nav = await utilities.getNav()
  res.render("reviews/edit", {
    title: "Edit Review",
    nav,
    errors: null,
    review_id: review.review_id,
    review_text: review.review_text,
    rating: review.rating,
    inv_id: review.inv_id
  })
}

/* ***************************
 *  Update review
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
  const { review_id, review_text, rating, inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  // Verify user owns the review
  const review = await reviewModel.getReviewById(review_id)
  if (!review || review.account_id !== account_id) {
    req.flash("notice", "Access denied.")
    return res.redirect("/inv/")
  }

  // Validation
  if (!review_text || !rating || rating < 1 || rating > 5) {
    req.flash("notice", "Please provide a valid review and rating.")
    return res.redirect(`/reviews/edit/${review_id}`)
  }

  const result = await reviewModel.updateReview(review_id, review_text, parseInt(rating))

  if (result) {
    req.flash("notice", "Review updated successfully!")
  } else {
    req.flash("notice", "Sorry, updating the review failed.")
  }

  res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 *  Delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const account_id = res.locals.accountData.account_id

  // Verify user owns the review
  const review = await reviewModel.getReviewById(review_id)
  if (!review || review.account_id !== account_id) {
    req.flash("notice", "Access denied.")
    return res.redirect("/inv/")
  }

  const result = await reviewModel.deleteReview(review_id)

  if (result) {
    req.flash("notice", "Review deleted successfully!")
  } else {
    req.flash("notice", "Sorry, deleting the review failed.")
  }

  res.redirect(`/inv/detail/${review.inv_id}`)
}

module.exports = reviewCont