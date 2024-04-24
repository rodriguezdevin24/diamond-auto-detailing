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

router.get('/success', (req, res) => {
    res.send('Successfully logged in');
});

module.exports = router;

