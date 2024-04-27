//server.js

//Change secure to true lower down for app session when ready for prod

const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

// Enable CORS for all requests


//Load env variables
dotenv.config();

// Route handlers
const passportSetup = require('./middleware/passportSetup');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const packageRoute = require('./routes/packageRoute');
const testRoute = require('./routes/testRoute');
const timeSlotRoute = require('./routes/timeSlotRoute')

const app = express();
require ('./db/connection')
const PORT = process.env.port || 3200;


//Database config


app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json()); 

//Session middleware for OAuth
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // make sure to set to true when actually using prod. VVV
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

//Initialize passport and sessions for authentication
app.use(passport.initialize());
app.use(passport.session());

//API routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/packages', packageRoute);
app.use('/api/appointments', appointmentRoute);
app.use('/api/timeslots', timeSlotRoute);

//Test route
app.use('api/test', testRoute);

//Default route
app.get('/', (req, res) => {
    res.send('Port is up and running!');
})

//Start server
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})