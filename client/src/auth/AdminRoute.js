import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { isAuth } from './helpers';
import Busy from '../core/Busy';

const AdminRoute = ({ component: Component, ...rest }) => {

  const [admin, setAdmin] = useState(false);
  const [authorisationComplete, setAuthorisationComplete] = useState(false);

  useEffect(() => {

    const user = { ...isAuth() };

    console.log('Admin Route: user = ', user);

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/isAdmin`,
      data: { user }
    })
      .then(response => {
        if (response.data.message === "admin") {
          setAdmin(true);
          setAuthorisationComplete(true);
        }
        else {
          setAdmin(false);
          setAuthorisationComplete(true);
        }
      })
      .catch((err) => {
        setAdmin(false);
      });

  }, []);

  return (
    (!authorisationComplete && <Busy />)
    || (
      <Route
        {...rest}
        render={routeProps =>
          (isAuth() && admin) ? (
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
      />)
  );
}

export default AdminRoute;
