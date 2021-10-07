import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { isAuth, getCookie } from '../auth/helpers';
import { connect } from 'react-redux';
import { loadLandlord } from '../redux/actions';
import RentalPropertyCreate from './properties/RentalPropertyCreate';

const Dashboard = (props) => {

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Call the API on mount to get the overview data for the logged in user.
  useEffect(() => {
    //const user = isAuth();

    if (props.userLoggedIn) {
      axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/user/${props.user._id}`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}` }
      })
        .then(response => {
          const landlordDetails = response.data.landlord;
          setLoaded(true);
          setError(false);
          // Save the landlord details in the store
          props.loadLandlord(landlordDetails);
        })
        .catch((err) => {
          setError(true);
          setErrorMsg(err.response ? err.response.data.error : err);
        });
    }
  }, []);

  const { name, email, _id } = props.user;

  const renderProperties = () => {
    if (props.landlord.properties) {
      const { properties } = props.landlord;
      return (
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title">Properties</h4>
            { properties.length > 0 && 
            <p className="card-text">You currently have {props.landlord.properties.length} properties</p>
            }
            { properties.length === 0 && 
            <p className="card-text">You have not yet added any properties</p>
            }
          </div>
          <div className="card-body d-flex justify-content-end">
            <button className="btn btn-success shadow-sm">+</button>
          </div>
        </div>
      );
    }
  }

  return (
    <Layout>
      <div className="container text-center py-5">
        {error && <div>
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMsg}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>}
        {loaded &&
          <div>
            <h1>Dashboard</h1>
            <h2 className="py-3">Hi {name}</h2>
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  {renderProperties()}
                </div>
                <div className="col-sm-6">
                  <div className="card p-3 shadow">
                    <div className="card-body">
                      <RentalPropertyCreate />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    userLoggedIn: state.user.userLoggedIn,
    user: state.user.user,
    landlord: state.landlord.landlord
  };
}

export default connect(mapStateToProps, { loadLandlord })(Dashboard);