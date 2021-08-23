const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

// Import auth router
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Create instance of express.
const app = express();

// Setup and connect to MongoDB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mern';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

// catch and report connection errors, and log a successful connection
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database connected');
});


//------------------
// set up Middleware
//------------------

// Use morgan in dev mode.
app.use(morgan('dev'));

// Use the express built-in json body parser
app.use(express.json());


// Use CORS to allow React to communicate with the API
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `http://localhost:3000`, credentials: true }));    // allows specified origin, with cookies.
}

// use the mongo sanitizer to stop sql injections
app.use(mongoSanitize({
    replaceWith: '_',
}));

// Add in the cookie-parse middleware, which is required by the CSRF middleware
app.use(cookieParser());

// Use the auth router to handle auth routes.
app.use('/api', authRoutes);
// Use the user router to handle user routes.
app.use('/api', userRoutes);

// Handle any previously unhandled errors here - especially CSRF failures.
app.use(function (err, req, res, next) {
    if (err.code === 'EBADCSRFTOKEN') {
        // handle CSRF token errors here
        return res.status(403).json({
            error: 'Forged Request - denied.'
        });
    }
    return res.status(400).json({
        error: err.message
    });
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`serving on port ${port} - ${process.env.NODE_ENV}`);
});