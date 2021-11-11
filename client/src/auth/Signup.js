import React, { useState } from 'react';
import Layout from '../core/Layout';
import Error from '../core/Error';
import axios from 'axios';
import { connect } from 'react-redux';
import { logError } from '../redux/actions';

const Signup = (props) => {

    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        submitting: false,
        signedUp: false,
        msg: ''
    });

    const { name, email, password, submitting, signedUp, msg } = state;

    const handleChange = (attr) => (e) => {
        setState({...state, [attr]: e.target.value, error: false});
    }

    const handleSubmit = (e) => {
        // Stop the form refreshing
        e.preventDefault();

        setState({...state, submitting:true, error: false, msg: '', signedUp: false});
        props.logError();

        // Build an axios call to the sign up end point.
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signup`,
            data: { name: name.trim(), email: email.trim().toLowerCase(), password }
        })
        .then(response => {
            console.log('SIGNUP SUCCESS', response);
            setState({
                name: "",
                email: "",
                password: "",
                submitting: false
            });
            setState({...state, signedUp: true, msg: response.data.message});
        })
        .catch((err) => {
            setState({...state, submitting: false, signedUp: false, error: true, msg: err.response.data.error });
            props.logError(err.response.data.error);
        });
    }

    const form = (
        <form>
            <div className="form-group">
                <label className="text-muted pt-3" htmlFor="name">Name</label>
                <input type="text" id="name" className="form-control" onChange={handleChange('name')} value={name}/>
            </div>
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
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1 className="py-5 text-center">Sign Up</h1>
                <Error showClose />
                {signedUp && <div>
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        {msg}
                    </div>
                </div>}
                {form}
            </div>
        </Layout>
    )
};

export default connect(null, { logError })(Signup);