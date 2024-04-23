// authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


//JWT routes

router.post('/login', authController.login);

router.post('/refresh', authController.refreshToken);

router.post('/logout', authController.logout);


// OAuth routes

router.get('/google', authController.redirectToGoogle);

router.get('/google/callback', authController.googleCallback);



module.exports = router;

