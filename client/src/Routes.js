import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Signout from './auth/Signout';
import Private from './core/Private';
import Admin from './core/Admin';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={App}/>
                <Route path="/signup" component={Signup} />
                <Route path="/signin" component={Signin} />
                <Route path="/signout" component={Signout} />
                <Route path="/activate/:token" component={Activate} />
                <PrivateRoute path="/private" component={Private} />
                <AdminRoute path="/admin" component={Admin} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;