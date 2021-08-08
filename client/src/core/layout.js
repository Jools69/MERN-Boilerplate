import React, { Fragment } from 'react';

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
                            <a className={"nav-link px-4 fw-bold " + (location.pathname === '/' ? 'active' : '')} href="/">Home</a>
                            <a className={"nav-link px-4 fw-bold " + (location.pathname === '/signup' ? 'active' : '')} href="/signup">Sign Up</a>
                            <a className={"nav-link px-4 fw-bold " + (location.pathname === '/signin' ? 'active' : '')} href="/signin">Sign In</a>
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

export default Layout;