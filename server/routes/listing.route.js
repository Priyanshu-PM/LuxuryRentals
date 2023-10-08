const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const { createListing } = require('../controllers/listing.controller');

const router = express.Router();

router.post('/create', verifyToken, createListing);

module.exports = router;