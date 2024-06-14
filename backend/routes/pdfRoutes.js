const express = require('express');
const { uploadPDF, getPDFs, getPDF } = require('../controllers/pdfController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/upload', protect, uploadPDF);
router.get('/', protect, getPDFs);
router.get('/:id', protect, getPDF);

module.exports = router;
