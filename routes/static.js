const express = require('express');
const router = express.Router();
const path = require('path');

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "/public/css"));
router.use("/js", express.static(__dirname + "/public/js"));
router.use("/images", express.static(__dirname + "/public/images"));

// ============================================
// NEW: Handle favicon requests to avoid 404 errors
// ============================================
router.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/images/favicon.ico'));
});

// ============================================
// NEW: Handle error image requests
// ============================================
router.get('/images/errors/:image', (req, res) => {
  const imageName = req.params.image;
  // Only allow specific error images for security
  const allowedImages = ['server-error.jpg', '404-error.jpg', '500-error.jpg'];
  
  if (allowedImages.includes(imageName)) {
    res.sendFile(path.join(__dirname, `../public/images/errors/${imageName}`));
  } else {
    res.status(404).send('Image not found');
  }
});

module.exports = router;