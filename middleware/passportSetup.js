const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');

//Configure Google Oauth strategy with your Google client ID and client secret

passport.use(new GoogleStrategy ({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callBackUrl: "Route to Google call back "
}));