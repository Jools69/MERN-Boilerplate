import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './helpers';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={routeProps =>
          isAuth() ? (
            <Component {...routeProps} />
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: rest.location }
              }}
            />
          )
        }
      />
    );
  }
  
  export default PrivateRoute;
  