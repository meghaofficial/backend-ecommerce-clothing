const multer = require('multer');

const storage = multer.memoryStorage(); // file kept in memory
const upload = multer({ storage: storage });

module.exports = upload;
