import React, { useEffect, useState } from 'react';
import Layout from '../core/Layout';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Activate = ({ match }) => {

    const [activated, setActivated] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Get the token from the URL
    const { token } = match.params;

    // Decode the token to get the user's name
    const { name } = jwt.decode(token);

    useEffect(() => {

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/auth/activate`,
            data: { token }
        })
            .then(response => {
                setActivated(true);
                //toast.success(response.data.message);
            })
            .catch((err) => {
                setActivated(false);
                setError(true);
                setErrorMsg(err.response.data.error);
            });

    }, []);

    return (
        <Layout>
            <div className="col-md-6 offset-md-3 text-center">
                <ToastContainer position="top-center" />
                <h1 className="py-5">Account Activation</h1>
                {!activated && !error && <h2 className="py-5">Hi {name}, activating your account now....</h2>}
                {error && <div class="col-6 offset-3">
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        {errorMsg}
                        {/* <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
                    </div>
                </div>}
                {activated && <div class="col-6 offset-3">
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Awesome! Your account has been successfully activated - please sign in {name}!
                        {/* <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
                    </div>
                </div>}
                {activated && <a href="/signin" className="btn btn-outline-primary">Sign In</a>}
            </div>
        </Layout>
    )
};

export default Activate;