import React from 'react';
import { connect } from 'react-redux';
import Layout from '../core/Layout';
import { isAuth } from '../auth/helpers';
import { signout } from '../redux/actions';

const Signout = (props) => {

    const user = isAuth();
    // update local storage and remove the session cookie.
    // NOTE: MOVE THIS TO THE ACTION CREATOR WHEN REFACTORING!!!!!!!
    props.signout();

    return (
        <Layout>
            <div className="col-md-6 offset-md-3 text-center">
                <h1 className="py-5 text-center">Signed Out</h1>
                <div>
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <h4>Goodbye{user && ' ' + user.name.charAt(0).toUpperCase() + user.name.slice(1)}! We look forward to seeing you again soon.</h4>
                    </div>
                </div>
                <a href="/signin" className="btn btn-outline-primary my-5">Sign In</a>
            </div>
        </Layout>
    )
};

export default connect(null, { signout })(Signout);