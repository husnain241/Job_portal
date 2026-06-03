const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

// diskStorage tells Multer WHERE and HOW to save uploaded files
const storage = multer.diskStorage({
  // destination: the folder where files are saved
  destination: (req, file, cb) => {
    // cb is a callback — cb(error, folderPath)
    // null means no error
    cb(null, 'uploads/resumes');
  },

  // filename: what to name the saved file
  filename: (req, file, cb) => {
    // We create a unique name using the user's ID + timestamp + original extension
    // This prevents files from overwriting each other
    const ext = path.extname(file.originalname); // e.g., ".pdf"
    const filename = `resume-${req.user._id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// fileFilter: only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    // cb(null, true) means "accept this file"
    cb(null, true);
  } else {
    // cb(error) means "reject this file"
    cb(new ApiError(400, 'Only PDF files are allowed'), false);
  }
};

// Create the multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;