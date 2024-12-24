const express = require('express');
const { register, login, getUser } = require('./../controllers/authController')

const { authenticate } = require('../middleware/authentication')

const router = express.Router();

router.post('/register', register)
router.post('/login', login)


router.get('/getUser', authenticate, getUser)


module.exports = router
