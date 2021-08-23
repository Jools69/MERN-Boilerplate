const User = require('../models/user');
const UserStaging = require('../models/userStaging');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

const timeOut = 2000;

exports.signup = async (req, res, next) => {
    // Pull out the sign up details from the request body.
    const { name, email, password } = req.body;

    // Check to see if the provided email is already registered.
    try {
        const existingUser = await User.findOne({ email });

        // If the user exists, send back an error message
        if (existingUser) {
            return res.status(400).json({
                error: 'Email is already in use'
            });
        }

        // Check to see if the user has already signed up but not activated
        const existingStagedUser = await UserStaging.findOne({ email });

        // If the user has signed up but not activated, we should check to see if the token has expired.
        if (existingStagedUser) {
            const nowUTC = Date.parse(new Date().toUTCString());
            const stagedAtUTC = Date.parse(existingStagedUser.stagedAt);
            if ((nowUTC - stagedAtUTC) > process.env.TOKEN_EXPIRATION * 1000) {
                // The existing signup token has expired, so we need to remove the current
                // document from the staging table, as the user is re-signing up.
                await existingStagedUser.remove();
            }
            else {
                return res.status(400).json({
                    error: 'Email is already signed up - please click the link in your verification email'
                });
            }
        }

        // Create a new staged user
        const stagedUser = new UserStaging({
            email,
            name,
            password
        })
        console.log(stagedUser);

        // save it to the DB.
        await stagedUser.save();

        // Generate a JWT to send in the activation link.
        const token = jwt.sign({ name, email }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: parseInt(process.env.TOKEN_EXPIRATION) });

        // Set the sendgrid API Key.
        sgMail.setApiKey(process.env.MAIL_API_KEY);

        // Build the verification email.
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Please verify your email address',
            text: 'Thank you for signing up - please click the link below to verify your email address',
            html: `
            <h1>Activate your account</h1>
            <p>Thank you for signing up - please click the link below to activate your account.</p>
            <a href="${process.env.CLIENT_URL}/activate/${token}">Verify Email Address</a>
            <hr>
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>`,
        }

        sgMail.send(msg).then(() => {
            console.log(`Email send to ${email}`);
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account`
            });
        }).catch((err) => {
            console.log(`Error sending email to ${email}:`, err);
            res.status(500).json({
                error: err.message
            })
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.activate = async (req, res, next) => {
    const { token } = req.body;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, signupDetails) => {
        if (err) {
            let msg = err.message;
            if (err.name === 'TokenExpiredError')
                msg = "Activation Link expired, please sign-up again."
            return res.status(400).json({
                error: msg
            });
        }
        // Pull the verified user email out of the token and search for it in the staging table.
        const { name, email } = signupDetails;

        try {
            // First check to see if somehow the link is sent again (i.e. in via a browser session that is refreshed with an old token)
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    error: `A user with email ${email} has already been activated, please sign in.`
                });
            }

            // Look for the email in the staging table.
            const stagedUser = await UserStaging.findOne({ email })

            // If the email can't be found in the staging table, let the user know they need to sign up.
            if (!stagedUser) {
                return res.status(400).json({
                    error: `A user with email ${email} has not signed up - please sign up.`
                });
            }

            // The staged user was found - we now need to create permanent user from their saved details.
            const { password } = stagedUser;
            const newUser = new User({ name, email, password });

            await newUser.save();

            // Now we've saved the new user, delete the staged user entry
            await UserStaging.deleteOne({ email });

            return res.json({
                message: `${name}, your account was activated successfully! Please sign in.`
            });
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    });
}

exports.signin = async (req, res) => {
    // Pull sign in parameters from request body.
    const { email, password } = req.body;

    // Check to see if we have the provided email address registered in the database
    const user = await User.findOne({ email }).exec(async (err, user) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        if (!user || !await user.authenticate(password)) {
            return res.status(511).json({
                error: 'The email address or password was invalid - please try again'
            });
        }

        // if we get here, the user exists and the provided password is correct.
        // So we need to create a token to send back to the client for future
        // route authorisations.

        const { _id, name, email, role } = user;
        const token = jwt.sign({ id: _id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        setTimeout(() => {
            res.json({
                token,
                user: { _id, name, email, role },
                message: `Welcome back ${name}`
            });
        }, timeOut);
    });
};

exports.isAdmin = async (req, res, next) => {
    const { user } = req.body;
    setTimeout(() => {
        if (user.role === 'admin')
            return res.json({ message: 'admin' });
        return res.json({ message: 'notadmin' });
    }, timeOut);
}

exports.authenticate = async (req, res, next) => {
    // This is a middleware that will extract the Bearer token from the 
    // Authentication Header and validate it. This token will have been
    // created by the signin route handler, and sent back to the client previously.
    // If the token is valid, the user object that is decoded from it will be
    // added to the request object for use during subsequent middlewares/handlers.

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Sorry, but you are not authorised to do this.'
        });
    }

    // Extract the token portion of the auth header (i.e. after the "Bearer " part);
    const token = authHeader.split(' ')[1];

    // Now verify the token.
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            let msg = err.message;
            let status = 400;
            if (err.name === 'TokenExpiredError') {
                msg = "Refresh Token";
                status = 499;   // Custom response for client to look out for.
            }
            return res.status(status).json({
                error: msg
            });
        }
        // The user object decoded from the token is valid here so add it to the req object.
        req.user = user;

        // Continue on our merry way, handling stuff.
        return next();
    });
}

exports.adminOnly = (req, res, next) => {
    // This middleware checks the req.user object to ensure that the role is = 'admin'. This means that
    // this middleware has to be called *after* the authenticate middleware, which populates the req.user object.
    // If the authenticated user is an admin, next() is called, else an error is sent back on the response.
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            err: 'Sorry, but you are not authorised to do this.'
        });
    }
    // User is admin so continue with the route handling.
    return next();
}

exports.deliverCsrfToken = (req, res) => {
    const csrfToken = req.csrfToken();
    return res.send({ csrfToken: csrfToken });
}

exports.showCookies = (req, res, next) => {
    try {
        console.log(req.cookies);
        return next();
    }
    catch (err) {
        return res.status(403).json({
            err: err.message
        });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        user.password = password;
        await user.save();
        return res.json({
            message: 'Password updated successfully'
        });
    }
    catch(err) {
        return res.status(400).json({
            error: err.message
        });
    }
}