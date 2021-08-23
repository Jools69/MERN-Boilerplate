import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import { authenticate } from './helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signin = (props) => {

    const [state, setState] = useState({
        email: "",
        password: "",
        csrfToken: "",
        submitting: false,
        error: false,
        errorMsg: ''
    });

    const history = useHistory();

    const { email, password, csrfToken, submitting, error, errorMsg } = state;

    const handleChange = (attr) => (e) => {
        setState({ ...state, [attr]: e.target.value });
    }

    const getCSRFToken = async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_API}/protect`
        }).then(response => {
            setState({ ...state, csrfToken: response.data.csrfToken });
        })
            .catch((err) => {
                setState({
                    ...state,
                    error: true,
                    errorMsg: err.response.data.error
                });
            });
    }
    // Call the endpoint to get the CSRF token
    useEffect(() => {
        getCSRFToken();
    }, []);

    const handleSubmit = (e) => {
        // Stop the form refreshing
        e.preventDefault();

        setState({ ...state, submitting: true, error:false, errorMsg: '' });

        // Build an axios call to the sign up end point.
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            withCredentials: true,
            headers: {
                'csrf-token': csrfToken
            },
            data: { email: email.trim().toLowerCase(), password }
        })
            .then(response => {
                authenticate(response, () => {
                    setState({
                        email: "",
                        password: "",
                        submitting: false
                    });
                    // Redirect user based on role.
                    history.push(response.data.user.role === 'admin' ? '/admin' : '/private');
                });
            })
            .catch((err) => {
                setState({
                    ...state,
                    submitting: false,
                    error: true,
                    errorMsg: err.response.data.error
                });
            });
    }

    const form = (
        <form>
            <div className="form-group">
                <label className="text-muted pt-3" htmlFor="email">Email</label>
                <input type="text" id="email" className="form-control" onChange={handleChange('email')} value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted pt-3" htmlFor="password">Password</label>
                <input type="password" id="password" className="form-control" onChange={handleChange('password')} value={password} />
            </div>
            <div>
                <button className="btn btn-primary mt-4" onClick={handleSubmit} disabled={submitting ? true : false}>
                    {submitting ? <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Submitting... </> : 'Submit'}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                {error && <div class="mt-5">
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        {errorMsg}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </div>}
                <h1 className="py-5 text-center">Sign In</h1>
                {form}
            </div>
        </Layout>
    )
};

export default Signin;