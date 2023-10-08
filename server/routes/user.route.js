const express = require('express');
const { test, updateUser } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);

module.exports = router;