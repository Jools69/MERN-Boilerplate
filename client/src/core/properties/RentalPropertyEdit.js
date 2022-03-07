import React, { useRef } from 'react';
import { connect } from 'react-redux';
import Layout from '../Layout';
import Error from '../Error';
import { updateRentalProperty } from '../../redux/actions';
import RentalPropertyEditForm from './RentalPropertyEditForm';

const RentalPropertyEdit = (props) => {

    const onSubmit = (formValues) => {
        // window.alert("Updating the state and DB");
        props.updateRentalProperty(propertyId, formValues);
        if(!props.feedback.error.message) {
            props.history.push('/dashboard');
        }
    }

    const onCancel = () => {
        props.history.push('/dashboard');
    }

    // check to see if the specified property is in the store.

    const formRef = useRef(null);

    const { propertyId } = props.match.params;

    const initialValues = { ...props.rentalProperty.property, percentOwned: props.rentalProperty.percentOwned };

    return (
        <Layout>
            <div className="container py-5">
                <Error showClose />
                <div className="col-lg-6 offset-lg-3 card p-4 shadow">
                    <div className="card-title"><h2 className="text-center text-muted">Properties</h2></div>
                    <div className="card-body">
                        <RentalPropertyEditForm
                            onSubmit={onSubmit}
                            onCancel={onCancel}
                            formId={"RentalPropertyEdit"}
                            formRef={formRef}
                            initialValues={initialValues}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const mapStateToProps = (state, ownProps) => {
    const rentalProperty = state.landlord.landlord.portfolio.find(p => p.property._id.toString() === ownProps.match.params.propertyId);
    return {
        rentalProperty: rentalProperty,
        feedback: state.feedback
    }
}

export default connect(mapStateToProps, {updateRentalProperty })(RentalPropertyEdit);