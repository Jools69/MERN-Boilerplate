import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import Error from './Error';
import Success from './Success';
import { getCookie } from '../auth/helpers';
import { connect } from 'react-redux';
import { loadLandlord, logError, clearError, clearSuccess } from '../redux/actions';
import Modal from './shared components/Modal';
import RentalPropertyCreateForm from './properties/RentalPropertyCreateForm';
import PropertiesList from './properties/PropertiesList';

const Dashboard = (props) => {

  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Call the API on mount to get the overview data for the logged in user.
  useEffect(() => {

    if (props.userLoggedIn) {
      axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/users/${props.user._id}`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}` }
      })
        .then(response => {
          const landlordDetails = response.data.landlord;
          setLoaded(true);
          props.clearSuccess();
          // Save the landlord details in the store
          props.loadLandlord(landlordDetails);
        })
        .catch((err) => {
          props.logError(err.response ? err.response.data.error : err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { name } = props.user;

  const newformId = "newPropertyForm";

  const formRef = useRef(null);

  const closeForm = () => {
    setShowModal(false);
    // The following it required to clear the property form if the user clicks the cancel button
    // in the owning parent Modal component.
    if(formRef.current) {
      formRef.current.restart();
    }
  }

  return (
    <Layout>
      <div className="container py-5">
        <Error showClose />
        <Success showClose />
        {loaded &&
          <div>
            <h1 className="text-primary">Dashboard</h1>
            <h2 className="text-muted py-3">Welcome back {name}</h2>
            <div>
              <div className="row">
                <div className="col-lg-6">
                  <PropertiesList onAdd={() => {setShowModal(true)}}/>
                </div>
              </div>
            </div>
          </div>}
      </div>
      <Modal
        show={showModal}
        title={<span className="text-muted">Portfolio</span>}
        content={showModal && <RentalPropertyCreateForm formId={newformId} formRef={formRef} postAction={closeForm}/>}
        actions={showModal &&
          <React.Fragment>
            <button className="btn btn-secondary" onClick={closeForm}>Cancel</button>
            <button className="btn btn-primary" type="submit" form={newformId}>Add</button>
          </React.Fragment>
        }
      />
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    userLoggedIn: state.user.userLoggedIn,
    user: state.user.user,
    landlord: state.landlord.landlord,
    error: state.feedback.error
  };
}

export default connect(mapStateToProps, { loadLandlord, logError, clearError, clearSuccess })(Dashboard);