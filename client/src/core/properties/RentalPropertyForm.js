import React from 'react';
import { Field, Form } from 'react-final-form';

const RentalPropertyForm = (props) => {

    const renderError = ({ touched, invalid, error }) => {
        return touched &&
            invalid &&
            <div className="text-danger form-control-sm">{error}</div>;
    }

    // Props that are sent to this renderInput function include the input object, meta object and
    // our own label prop that we added when creating the Field instance. We destructure them
    // directly here in the function prototype.
    const renderInput = ({ input, label, meta, required }) => {
        const labelText = required ? <>{label} <span style={{color: "red"}}>*</span></> : <>{label}</>;
        return (
            <div className="text-start mb-2">
                <label 
                    className="form-label form-control-sm mb-0 text-muted" 
                    htmlFor={input.name}>
                    {labelText}
                </label>
                <input 
                    className="form-control form-control-sm" 
                    id={input.name} 
                    {...input} 
                    autoComplete="off" 
                    style={meta.touched && meta.invalid ? {borderColor: "red"} : null }/>
                {renderError(meta)}
            </div>
        );
    };

    const handleSubmit = (formValues) => {
        props.onSubmit(formValues);
    }

    return (
        <Form
            initialValues={props.initialValues}
            onSubmit={handleSubmit}
            validate={validate}
        >
            {(props) => {
                return (
                    <form className="" onSubmit={props.handleSubmit}>
                        <Field name="name" component={renderInput} label="Address Name" required/>
                        <Field name="line1" component={renderInput} label="Address Line 1" required/>
                        <Field name="line2" component={renderInput} label="Address Line 2" />
                        <Field name="line3" component={renderInput} label="Address Line 3" />
                        <Field name="city" component={renderInput} label="City" />
                        <Field name="county" component={renderInput} label="County" />
                        <Field name="country" component={renderInput} label="Country" />
                        <Field name="postcode" component={renderInput} label="Post Code" required/>
                        <button className="btn btn-primary" type="submit">Add</button>
                    </form>
                )
            }}
        </Form>
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
    return errors;
}

export default RentalPropertyForm;
