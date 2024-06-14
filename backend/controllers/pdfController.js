const PDF = require('../models/PDF');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
}).single('pdf');

exports.uploadPDF = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const newPDF = await PDF.create({
        filename: req.file.filename,
        path: req.file.path,
        uploadedBy: req.user.id
      });
      res.status(201).json({ success: true, pdf: newPDF });
    } catch (error) {
      fs.unlinkSync(req.file.path);
      res.status(400).json({ success: false, error: error.message });
    }
  });
};

exports.getPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ uploadedBy: req.user.id });
    res.status(200).json({ success: true, pdfs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'PDF not found' });
    }
    res.sendFile(path.resolve(pdf.path));
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
