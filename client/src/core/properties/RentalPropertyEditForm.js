import React from 'react';
// import { connect } from 'react-redux';
// import { updateRentalProperty } from '../../redux/actions';
import RentalPropertyForm from './RentalPropertyForm';

const RentalPropertyEditForm = (props) => {

    // const onSubmit = (formValues) => {
    //     props.createRentalProperty(formValues);
    //     props.postAction();
    // }

    return (
        <div>
            <h3>Update Property</h3>
            <RentalPropertyForm 
                onSubmit={props.onSubmit}
                onCancel={props.onCancel}
                formId={props.formId}
                formRef={props.formRef}
                initialValues={props.initialValues}
                showButtons={true}
                submitButtonText="Update"
            />
        </div>
    );
}

// export default connect(null, {createRentalProperty})(RentalPropertyEditForm);
export default RentalPropertyEditForm;
