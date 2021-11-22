import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Layout from '../core/Layout';
import Error from '../core/Error';
import Success from '../core/Success';
import axios from 'axios';
import { connect } from 'react-redux';
import { authenticate } from './helpers';
import { signin, logError, clearError, clearSuccess, saveCSRFToken } from '../redux/actions';

const Signin = (props) => {

    const [state, setState] = useState({
        email: "",
        password: "",
        submitting: false,
    });

    const history = useHistory();

    const { email, password, submitting } = state;

    const handleChange = (attr) => (e) => {
        setState({ ...state, [attr]: e.target.value });
    }

    const getCSRFToken = async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_API}/protect`
        }).then(response => {
            // setState({ ...state, csrfToken: response.data.csrfToken });
            props.saveCSRFToken(response.data.csrfToken);
        })
        .catch((err) => {
            const errorMsg = err.response ? err.response.data.error : err.message;
            props.logError(errorMsg);
            props.saveCSRFToken('');
        });
    }
    // Call the endpoint to get the CSRF token
    useEffect(() => {
        getCSRFToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e) => {
        // Stop the form refreshing
        e.preventDefault();

        setState({ ...state, submitting: true });
        props.clearError();
        props.clearSuccess();
        // Build an axios call to the sign up end point.
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            withCredentials: true,
            headers: {
                'csrf-token': props.csrfToken
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
                    // Update User State in Redux Store
                    props.signin(response.data.user);
                    // Redirect user based on role.
                    history.push(response.data.user.role === 'admin' ? '/admin' : '/dashboard');
                });
            })
            .catch((err) => {
                setState({
                    ...state,
                    submitting: false
                });
                const errorMsg = err.response ? err.response.data.error : err.message;
                props.logError(errorMsg);
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
                    {submitting ? <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Signing in... </> : 'Sign in'}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <Error showClose />
                <Success showClose />
                <h1 className="py-5 text-center">Sign In</h1>
                {form}
                <div className="py-3">
                    <Link to="/password/forgot">Forgot your password?</Link>
                </div>
            </div>
        </Layout>
    )
};

const mapStateToProps = (state) => {
    return {
        csrfToken: state.user.csrfToken
    };
}

export default connect(mapStateToProps, { signin, logError, clearError, clearSuccess, saveCSRFToken })(Signin);