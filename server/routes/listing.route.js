const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const { createListing, deleteListing } = require('../controllers/listing.controller');

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);

module.exports = router;