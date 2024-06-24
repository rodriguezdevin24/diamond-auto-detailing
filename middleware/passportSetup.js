const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');
const FacebookStrategy = require("passport-facebook")

//Google OAuth Strategy

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

// // Facebook OAuth Strategy //

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//     profileFields: ['id', 'emails', 'name']
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             let user = await User.findOne({ facebookId: profile.id });
//             if (user) {
//                 return done(null, user);
//             } else {
//                 user = await User.create({
//                     facebookId: profile.id,
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     isLocal:false
//                 });
//                 return done(null, user);
//             }
//         } catch (error) {
//             return done(error, null);
//         }
//     }));


// //Serialize user into the session
// passport.serializeUser(( user, done) => {
//     done(null, user.id);
// });

// // Deserialize user from the sessions

// passport.deserializeUser(async(id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (err) {
//         done(err, null);
//         }
// });
    
// module.exports = passport;
