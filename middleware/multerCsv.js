const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname.replace(/\s/g, ''));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
