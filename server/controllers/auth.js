const User = require('../models/user');
const UserStaging = require('../models/userStaging');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');

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

        // save it to the DB.
        await stagedUser.save();

        // Generate a JWT to send in the activation link.
        const token = jwt.sign({ name, email }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: parseInt(process.env.TOKEN_EXPIRATION) });
        console.log(token);

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
        next(err);
    }
}

exports.activate = async (req, res, next) => {
    const { token } = req.body;
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, signupDetails) => {
        if (err) {
            let msg = err.message;
            if(err.name === 'TokenExpiredError')
                msg = "Activation Link expired, please sign-up again."
            return res.status(400).json({
                error: msg
            });
        }
        // Pull the verified user email out of the token and search for it in the staging table.
        const { name, email } = signupDetails;

        try {
            // First check to see if somehow the link is sent again (i.e. in via a browser session that is refreshed with an old token)
            const existingUser = await User.findOne({email});
            if(existingUser) {
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
            const { hashedPassword, salt } = stagedUser;
            const newUser = new User({ name, email, hashedPassword, salt });

            await newUser.save();

            // Now we've saved the new user, delete the staged user entry
            await UserStaging.deleteOne({ email });

            return res.json({
                message: `${name}, your account was activated successfully! Please sign in.`
            });
        } catch (err) {
            console.dir(err);
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
    const user = await User.findOne({ email }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        if (!user || !user.authenticate(password)) {
            return res.status(511).json({
                error: 'The email address or password was invalid - please try again'
            });
        }

        //return res.json({user});
        // if we get here, the user exists and the provided password is correct.
        // So we need to create a token to send back to the client for future
        // route authorisations.

        const { _id, name, email, role } = user;
        const token = jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { _id, name, email, role },
            message: `Welcome back ${name}`
        });
    });

}