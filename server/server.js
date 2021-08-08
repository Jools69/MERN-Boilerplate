const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

// Import auth router
const authRoutes = require('./routes/auth');

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
    app.use(cors({origin: `http://localhost:3000`}));    // allows specified origin.
}

// use the mongo sanitizer to stop sql injections
app.use(mongoSanitize({
    replaceWith: '_',
}));

// Use the auth router to handle auth routes.
app.use('/api', authRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`serving on port ${port} - ${process.env.NODE_ENV}`);
});