import React from 'react';
import { connect } from 'react-redux';
import { createRentalProperty } from '../../redux/actions';
import RentalPropertyForm from './RentalPropertyForm';

const RentalPropertyCreate = (props) => {

    const onSubmit = (formValues) => {
        // console.log(formValues);
        props.createRentalProperty(formValues);
    }

    return (
        <div>
            <h2>Add a new Property</h2>
            <RentalPropertyForm 
                onSubmit={onSubmit} 
                initialValues={{
                    name: "Test"
                }}
            />
        </div>
    );
}

export default connect(null, {createRentalProperty})(RentalPropertyCreate);