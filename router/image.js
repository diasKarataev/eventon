const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/auth-admin-middleware');
const imageController = require('../controller/image-controller')
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get('/:id', imageController.getImage);
router.post('/user', upload.single('image'),  imageController.uploadUserImage);
router.post('/event/:id', upload.single('image'),  imageController.uploadEventImage);
router.delete('/:id', imageController.deleteImage)
router.delete('', imageController.deleteAllImages)
router.get('', imageController.getImageModels)
module.exports = router;