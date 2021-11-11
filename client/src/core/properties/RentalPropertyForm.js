import React from 'react';
import { Field, Form } from 'react-final-form';
import { TextInput, NumberInput, SelectInput } from '../shared components/forms/FormInputs';
import propertyTypes from './propertyTypes';

const RentalPropertyForm = (props) => {

    const handleSubmit = (formValues) => {
        props.onSubmit(formValues);
    }

    return (
        <Form
            initialValues={props.initialValues}
            onSubmit={handleSubmit}
            validate={validate}
            showSubmitButton={false}
            formId={props.formId}
            formRef={props.formRef}
            render={({ handleSubmit, form, formRef, showSubmitButton }) => {
                formRef.current = form;
                return (
                    <form className="" id={props.formId} onSubmit={handleSubmit}>
                        <Field name="name" component={TextInput} label="Address Name" required />
                        <Field name="line1" component={TextInput} label="Address Line 1" required />
                        <Field name="line2" component={TextInput} label="Address Line 2" />
                        <Field name="line3" component={TextInput} label="Address Line 3" />
                        <Field name="city" component={TextInput} label="City" required />
                        <Field name="postcode" component={TextInput} label="Post Code" required />
                        <div className="row">
                            <div className="col-sm-7">
                                <Field name="propertyType" component={SelectInput} label="Property Type" values={propertyTypes} required />
                            </div>
                            <div className="col-sm-5">
                                <Field name="percentOwned" component={NumberInput} label="Percent Owned" required />
                            </div>
                        </div>
                        {showSubmitButton && <button className="btn btn-primary" type="submit">Add</button>}
                    </form>
                )}
            }
        />
    );
}

const validate = (formValues) => {
    const errors = {};

    if (!formValues.name) {
        errors.name = "Name is required";
    }

    if (!formValues.postcode) {
        errors.postcode = "Post Code is required";
    }

    if (!formValues.line1) {
        errors.line1 = "Address line 1 is required";
    }

    if (!formValues.city) {
        errors.city = "City is required";
    }

    if (!formValues.propertyType) {
        errors.propertyType = "Property Type is required";
    }

    if (!formValues.percentOwned) {
        errors.percentOwned = "Percent Owned is required";
    }

    if (formValues.percentOwned < 1 || formValues.percentOwned > 100) {
        errors.percentOwned = "Must be between 1 and 100%";
    }
    return errors;
}

export default RentalPropertyForm;
