import React, { useState } from 'react';
import Layout from '../core/Layout';
import Error from '../core/Error';
import axios from 'axios';
import { connect } from 'react-redux';
import { logError, clearError, logSuccess } from '../redux/actions';

const ForgotPassword = (props) => {

    const [state, setState] = useState({
        email: "",
        submitting: false
    });

    const { email, submitting } = state;

    const handleChange = (attr) => (e) => {
        setState({...state, [attr]: e.target.value, error: false});
    }

    const handleSubmit = (e) => {
        // Stop the form refreshing
        e.preventDefault();

        // set submitting state.
        setState({...state, submitting:true });
        props.clearError();

        // Build an axios call to the forgot password end point.
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/forgotPassword`,
            data: { email: email.trim().toLowerCase() }
        })
        .then(response => {
            console.log('FORGOTTEN PASSWORD SUCCESS', response);
            setState({  email: "",
                        submitting: false
                     });
            props.logSuccess(response.data.message);
            props.history.push('/signin');
        })
        .catch((err) => {
            setState({...state, submitting: false });
            props.logError(err.response.data.error);
        });
    }

    const form = (
        <form>
            <div className="form-group">
                <label className="text-muted pt-3" htmlFor="email">Email</label>
                <input type="text" id="email" className="form-control" onChange={handleChange('email')} value={email}/>
            </div>
            <div>
                <button className="btn btn-primary mt-4" onClick={handleSubmit} disabled={submitting ? true : false}>{submitting ? 'Submitting...' : 'Reset Password'}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1 className="py-5 text-center">Forgot Your Password?</h1>
                <p className="py-3 text-muted fs-6">Please enter your email address below to receive a password reset link.</p>
                <Error showClose />
                {form}
            </div>
        </Layout>
    )
};

export default connect(null, { logError, clearError, logSuccess })(ForgotPassword);