const User = require('../models/user');
const UserStaging = require('../models/userStaging');
const Landlord = require('../models/landlord');
const ExpressError = require('../utils/ExpressError');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

// This is to emulate API delay during local host testing
const timeOut = 2000;

exports.signup = async (req, res, next) => {
    // Pull out the sign up details from the request body.
    const { name, email, password } = req.body;

    // Check to see if the provided email is already registered.
    try {
        const existingUser = await User.findOne({ email });

        // If the user exists, send back an error message
        if (existingUser) {
            return next(new ExpressError('Email is already in use', 400));
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
                return next(new ExpressError('Email is already signed up - please click the link in your verification email', 400));
            }
        }

        // Create a new staged user
        const stagedUser = new UserStaging({
            email,
            name,
            password
        })

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
            return next(new ExpressError(err.message, 500));
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
            return next(new ExpressError(msg, 400));
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

            // The staged user was found - we now need to create a permanent user from their saved details.
            const { password } = stagedUser;
            const newUser = new User({ name, email, password });

            const savedUser = await newUser.save();

            // Create a new lanbdlord instance
            const newLandlord = new Landlord({
                userId: savedUser._id
            });

            const savedLandlord = await newLandlord.save();

            // Now we've saved the new user, delete the staged user entry
            await UserStaging.deleteOne({ email });

            return res.json({
                message: `${name}, your account was activated successfully! Please sign in.`
            });
        } catch (err) {
            return next(new ExpressError(err.message, 400));
        }
    });
}

exports.signin = async (req, res, next) => {
    // Pull sign in parameters from request body.
    const { email, password } = req.body;

    // Check to see if we have the provided email address registered in the database
    const user = await User.findOne({ email }).exec(async (err, user) => {
        if (err) {
            return next(new ExpressError(err.message, 400));
            // return res.status(400).json({
            //     error: err.message
            // });
        }
        if (!user || !await user.authenticate(password)) {
            return next(new ExpressError('The email address or password was invalid - please try again', 511));
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
        return next(new ExpressError('Sorry, but you are not authorised to do this.', 401));
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
            return next(new ExpressError(msg, status));
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
        return next(new ExpressError('Sorry, but you are not authorised to do this.', 403));
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
        return next();
    }
    catch (err) {
        return next(new ExpressError(err.message, 403));
    }
}

exports.forgotPassword = async (req, res, next) => {

    // Retrieve the user's email address from the request body.
    const { email } = req.body;

    try {
        // Find the user registered to that email address (if one exists)
        const user = await User.findOne({ email });

        if (user) {
            console.log(user.resetPasswordLink);
            // Generate a token containing the user ID of the registered user.
            const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

            // Add the token to the user's DB record for checking against later.
            // await User.findOneAndUpdate({ _id: user._id }, { resetPasswordLink: token });
            user.resetPasswordLink = token;
            await user.save();

            // Now create and send the email, including the link and token for resetting the password.
            // Set the sendgrid API Key.
            sgMail.setApiKey(process.env.MAIL_API_KEY);

            // Build the Password Reset link email.
            const msg = {
                to: email,
                from: process.env.EMAIL_FROM,
                subject: 'RENTrackr Password Reset',
                text: 'Please click the link below to reset your password. If you didn\'t request a password reset, please contact us.',
                html: `
                    <h1>Reset your password</h1>
                    <p>Please click the link below to reset your password. </p>
                    <p>If you didn't request a password reset, please contact us.</p>
                    <a href="${process.env.CLIENT_URL}/password/reset/${token}">Reset Password</a>
                    <hr>
                    <p>This email may contain sensitive information</p>
                    <p>${process.env.CLIENT_URL}</p>`,
            }

            sgMail.send(msg).then().catch((err) => {
                return next(new ExpressError(err.message, 500));
            });
        }

        return res.json({
            message: `If an account exists for ${email}, you will be sent a password reset link.`
        });

    } catch (err) {
        return next(new ExpressError(err.message, 400));
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        // validate the token received from the request body - it should just contain the user'd _id
        jwt.verify(token, process.env.JWT_RESET_PASSWORD, async (err, payload) => {
            if (err) {
                let msg = err.message;
                if (err.name === 'TokenExpiredError')
                    msg = "Password Reset Link expired, please click on forgot password again."
                return next(new ExpressError(msg, 400));
            }
        
            // The token is valid, so get the user from the DB associated with the password reset request
            const user = await User.findById(payload.id);
            if (!user) {
                return next(new ExpressError("The requesting user account cannot be found", 404));
            }

            // Check that the user's DB record contains the provided token too (to ensure they did request the change)
            if (user.resetPasswordLink !== token) {
                return next(new ExpressError("The specified user did not request a password reset", 400));
            }

            // Everything's valid by here, so update the user's password, and clear the resetPassworkLink in the DB.
            user.password = password;
            user.resetPasswordLink = "";
            await user.save();
            return res.json({
                message: 'Password updated successfully'
            });
        });
    }
    catch (err) {
        return next(new ExpressError(err.message, 400));
    }
}