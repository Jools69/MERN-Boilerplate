import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import Layout from '../core/layout';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { pipelinePrimaryTopicReference } from '@babel/types';

const Activate = ({ match }) => {

    const [state, setState] = useState({
        activated: false,
        error: false,
        errorMsg: ''
    });

    // Get the token from the URL
    const { token } = match.params;
    console.log(token, typeof token);

    // Decode the token to get the user's name
    const { name } = jwt.decode(token);

    const { activated, error, errorMsg } = state;

    useEffect(() => {

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/auth/activate`,
            data: { token }
        })
            .then(response => {
                setState({ ...state, activated: true });
                //toast.success(response.data.message);
            })
            .catch((err) => {
                setState({ ...state, activated: false, error: true, errorMsg: err.response.data.error });
                //toast.error(err.response.data.error);
            });

    }, []);

    return (
        <Layout>
            <div className="col-md-6 offset-md-3 text-center">
                <ToastContainer position="top-center" />
                <h1 className="py-5">Account Activation</h1>
                {!activated && !error && <h2 className="py-5">Hi {name}, activating your account now....</h2>}
                {/* {error && <h2 className="py-5">Sorry {name}, something went wrong - {errorMsg}</h2>} */}
                {error && <div class="col-6 offset-3">
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        {errorMsg}
                        {/* <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
                    </div>
                </div>}
                {/* {activated && <h2>Awesome! Your account has been successfully activated - please sign in!</h2>} */}
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