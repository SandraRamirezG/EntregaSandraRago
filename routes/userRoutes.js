const express = require('express');
const router = express.Router();
const { forgotPassword, changeUserRole, uploadDocuments } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const User = require('../dao/models/user');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/';
        if (file.fieldname === 'profile') folder = 'uploads/profiles';
        if (file.fieldname === 'product') folder = 'uploads/products';
        if (file.fieldname === 'document') folder = 'uploads/documents';
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST /api/users/:uid/documents
router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

// PUT /api/users/premium/:uid
router.put('/premium/:uid', changeUserRole);

// Otras rutas existentes
router.post('/forgot-password', forgotPassword);

module.exports = router;
