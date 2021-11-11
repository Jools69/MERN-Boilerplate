import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';
import Error from './Error';
import { getCookie } from '../auth/helpers';
import { connect } from 'react-redux';
import { loadLandlord, logError } from '../redux/actions';
import RentalPropertyCreate from './properties/RentalPropertyCreate';
import { Modal } from 'bootstrap';

const Dashboard = (props) => {

  const [loaded, setLoaded] = useState(false);
  const modalId = "addPropertyModal";

  const [modal, setModal] = useState(null);
  const modalInstance = useRef();

  useEffect(() => {
    setModal(new Modal(modalInstance.current));
  }, []);

  // Call the API on mount to get the overview data for the logged in user.
  useEffect(() => {
    //const user = isAuth();

    if (props.userLoggedIn) {
      axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/users/${props.user._id}`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}` }
      })
        .then(response => {
          const landlordDetails = response.data.landlord;
          setLoaded(true);
          // setError(false);
          props.logError('');
          // Save the landlord details in the store
          props.loadLandlord(landlordDetails);
        })
        .catch((err) => {
          props.logError(err.response ? err.response.data.error : err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const { name, email, _id } = props.user;
  const { name } = props.user;

  const renderProperties = () => {
    if (props.landlord.properties) {
      const { properties } = props.landlord;
      return (
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title">Properties</h4>
            {properties.length > 0 &&
              <p className="card-text">You currently have {props.landlord.properties.length} properties</p>
            }
            {properties.length === 0 &&
              <p className="card-text">You have not yet added any properties</p>
            }
          </div>
          <div className="card-body d-flex justify-content-end">
            <button className="btn btn-success shadow-sm" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>+</button>
          </div>
        </div>
      );
    }
  }

  const title = "Add Property";
  const closeModal = () => {
    modal.hide();
  }

  const myModal = ReactDOM.createPortal(
    <div className="modal fade" id={modalId} ref={modalInstance} tabindex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}Label`}>{title}</h5>
            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* <RentalPropertyCreate /> */}
            This is test content
          </div>
          <div className="modal-footer">
            <>
              <button className="btn btn-secondary" onClick={() => { modal.hide() }}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { modal.hide() }}>OK</button>
            </>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('#modal'));

  return (
    <Layout>
      <div className="container text-center py-5">
        <Error showClose />
        {loaded &&
          <div>
            <h1>Dashboard</h1>
            <h2 className="py-3">Welcome back {name}</h2>
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  {renderProperties()}
                </div>

                {/* <ModalContainer
                  title="Add Property"
                  content={<RentalPropertyCreate />}
                  actions={
                    <>
                      <button className="btn btn-secondary" onClick={() => { modal.hide() }}>Cancel</button>
                      <button className="btn btn-primary" onClick={() => { { modal.hide() } }}>OK</button>
                    </>
                  }
                  closeModal={() => { modal.hide() }}
                  id={modalId}
                  modalRef={modalInstance}
                /> */}

                {myModal}

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
    landlord: state.landlord.landlord,
    error: state.error.error
  };
}

export default connect(mapStateToProps, { loadLandlord, logError })(Dashboard);