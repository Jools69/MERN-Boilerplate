import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import Error from '../core/Error';
import ResetPasswordForm from './ResetPasswordForm';
import axios from 'axios';
import { connect } from 'react-redux';
import { logError, clearError, logSuccess, saveCSRFToken } from '../redux/actions';
// import getCSRFToken from './csrf';

const ResetPassword = (props) => {

    const [state, setState] = useState({
        submitting: false
    });

    const { submitting } = state;

    const getCSRFToken = async () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${process.env.REACT_APP_API}/protect`
        }).then(response => {
            props.clearError();
            props.saveCSRFToken(response.data.csrfToken);
        })
        .catch((err) => {
            const errorMsg = err.response ? err.response.data.error : err.message;
            props.logError(errorMsg);
            props.saveCSRFToken('');
        });
    };

    // Call the endpoint to get the CSRF token
    useEffect(() => {
        getCSRFToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = ({ password }) => {

        const { token } = props.match.params;

        // set submitting state.
        setState({ ...state, submitting: true });
        props.clearError();

        // Build an axios call to the reset password end point.
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/changePassword`,
            data: { token, password },
            withCredentials: true,
            headers: {
                'csrf-token': props.csrfToken
            }
        })
            .then(response => {
                console.log('RESET PASSWORD SUCCESS', response);
                setState({
                    password: "",
                    submitting: false
                });
                props.logSuccess(response.data.message);
                props.history.push('/signin');
            })
            .catch((err) => {
                setState({ ...state, submitting: false });
                props.logError(err.response ? err.response.data.error : err.message);
            });
    }

    const form = (

        <ResetPasswordForm
            onSubmit={handleSubmit}
            submitButtonText={submitting ? "Resetting" : "Reset"}
            submitting={submitting}
        />
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <Error showClose />
                <h1 className="py-5 text-center">Reset Your Password</h1>
                <p className="py-3 text-muted fs-6">Please enter your new password below:</p>
                {form}
            </div>
        </Layout>
    )
};

const mapStateToProps = (state) => {
    return {
        csrfToken: state.user.csrfToken
    };
}

export default connect(mapStateToProps, { logError, clearError, logSuccess, saveCSRFToken })(ResetPassword);

