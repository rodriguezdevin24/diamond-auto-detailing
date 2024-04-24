const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');

//Configure Google Oauth strategy with your Google client ID and client secret

passport.use(new GoogleStrategy ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3200/api/auth/google/callback'

},

async (accessToken, refreshToken, profile, done) => {
    try {
        //Check if user exists in DB based on Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user); // User exists, proceed to log them in
        } else {
            //If user does not exist, create new user in DB
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value, //Assumes they have an email address 
                isLocal: false
            });
            return done(null, user);
        }
    } catch (error) {
        return done(error, null);
    }
}
));

//Serialize user into the session
passport.serializeUser(( user, done) => {
    done(null, user.id);
});

// Deserialize user from the sessions

passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
        }
});
    

