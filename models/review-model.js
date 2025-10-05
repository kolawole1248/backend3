const pool = require("../database/")

/* ***************************
 *  Get reviews by inventory ID
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM reviews r 
      JOIN account a ON r.account_id = a.account_id 
      WHERE r.inv_id = $1 
      ORDER BY r.created_date DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error: " + error)
    return []
  }
}

/* ***************************
 *  Add new review
 * ************************** */
async function addReview(inv_id, account_id, review_text, rating) {
  try {
    const sql = `
      INSERT INTO reviews (inv_id, account_id, review_text, rating) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `
    const result = await pool.query(sql, [inv_id, account_id, review_text, rating])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
    return null
  }
}

/* ***************************
 *  Get review by ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const sql = 'SELECT * FROM reviews WHERE review_id = $1'
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("getReviewById error: " + error)
    return null
  }
}

/* ***************************
 *  Update review
 * ************************** */
async function updateReview(review_id, review_text, rating) {
  try {
    const sql = `
      UPDATE reviews 
      SET review_text = $1, rating = $2, updated_date = CURRENT_TIMESTAMP 
      WHERE review_id = $3 
      RETURNING *
    `
    const result = await pool.query(sql, [review_text, rating, review_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateReview error: " + error)
    return null
  }
}

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM reviews WHERE review_id = $1 RETURNING *'
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("deleteReview error: " + error)
    return null
  }
}

module.exports = {
  getReviewsByInventoryId,
  addReview,
  getReviewById,
  updateReview,
  deleteReview
}