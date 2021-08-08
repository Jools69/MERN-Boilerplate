import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from '../core/layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signin = (props) => {

    const [state, setState] = useState({
        email: "",
        password: "",
        submitting: false
    });

    const { email, password, submitting } = state;

    const handleChange = (attr) => (e) => {
        setState({...state, [attr]: e.target.value});
    }

    const handleSubmit = (e) => {
        // Stop the form refreshing
        e.preventDefault();

        setState({...state, submitting:true});

        // Build an axios call to the sign up end point.
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email: email.trim().toLowerCase(), password }
        })
        .then(response => {

            // save the response (user and token) in localstorage/cookie
            setState({
                email: "",
                password: "",
                submitting: false
            });
            toast.success(response.data.message);
        })
        .catch((err) => {
            setState({...state, submitting: false });
            toast.error(err.response.data.error);
        });
    }

    const form = (
        <form>
            <div className="form-group">
                <label className="text-muted pt-3" htmlFor="email">Email</label>
                <input type="text" id="email" className="form-control" onChange={handleChange('email')} value={email}/>
            </div>
            <div className="form-group">
                <label className="text-muted pt-3" htmlFor="password">Password</label>
                <input type="password" id="password" className="form-control" onChange={handleChange('password')} value={password}/>
            </div>
            <div>
                <button className="btn btn-primary mt-4" onClick={handleSubmit} disabled={submitting ? true : false}>{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
        </form>
    );

    return (
        <Layout location={props.location}>
            <div className="col-md-6 offset-md-3">
                <ToastContainer position="top-center"/>
                <h1 className="py-5 text-center">Sign In</h1>
                {form}
            </div>
        </Layout>
    )
};

export default Signin;