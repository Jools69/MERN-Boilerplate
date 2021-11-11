import React from 'react';
import { connect } from 'react-redux';
import { createRentalProperty } from '../../redux/actions';
import RentalPropertyForm from './RentalPropertyForm';

const RentalPropertyCreate = (props) => {

    const onSubmit = (formValues) => {
        props.createRentalProperty(formValues);
        props.postAction();
    }

    return (
        <div>
            <h2>Add a new Property</h2>
            <RentalPropertyForm 
                onSubmit={onSubmit}
                formId={props.formId}
                formRef={props.formRef}
                initialValues={{
                    name: "Test"
                }}
            />
        </div>
    );
}

export default connect(null, {createRentalProperty})(RentalPropertyCreate);