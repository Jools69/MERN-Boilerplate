import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuth } from '../auth/helpers';

const Layout = ({ location, children }) => {

    const nav = () => (
        <div>
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark py-3 bg-primary" >
                <div className="container-fluid">
                    <a className="navbar-brand ms-2 fw-bold" href="/"><img src="/images/icon-small.png" width="30" alt="Logo" /><span className="ms-3">RENTrackr</span></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav"></div>
                        <div className="navbar-nav ms-auto">
                            <Link className={"nav-link mx-4 fw-bold " + (location && location.pathname === '/' ? 'active border-bottom border-3 border-white' : '')} to="/">Home</Link>
                            {isAuth() ? '' : <Link className={"nav-link mx-4 fw-bold " + (location && location.pathname === '/signup' ? 'active border-bottom border-3 border-white' : '')} to="/signup">Sign Up</Link>}
                            {isAuth() ? null : <Link className={"nav-link mx-4 fw-bold " + (location && location.pathname === '/signin' ? 'active border-bottom border-3 border-white' : '')} to="/signin">Sign In</Link>}
                            {isAuth() ? <Link className={"nav-link mx-4 fw-bold " + (location && location.pathname === '/dashboard' ? 'active border-bottom border-3 border-white' : '')} to="/dashboard">Dashboard</Link> : null}
                            {isAuth() ? <Link className={"nav-link mx-4 fw-bold " + (location && location.pathname === '/signout' ? 'active border-bottom border-3 border-white' : '')} to="/signout">Sign Out</Link> : null}
                            {isAuth() && <Link className="nav-link mx-4 fw-bold text-white" to="/profile">
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                    </svg>
                                    <span className="text-white px-2">{isAuth().name}</span>
                                </div>
                            </Link>}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );

    return (
        <Fragment>
            {nav()}
            <div className="container">
                {children}
            </div>
        </Fragment>
    );
}

export default withRouter(Layout);