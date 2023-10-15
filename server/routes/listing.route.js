const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const { createListing, deleteListing, updateListing, getListing, getListings } = require('../controllers/listing.controller');

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

module.exports = router;