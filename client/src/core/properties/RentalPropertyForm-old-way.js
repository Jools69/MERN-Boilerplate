import React from 'react';
import { Field, Form } from 'react-final-form';
import propertyTypes from './propertyTypes';

const RentalPropertyForm = (props) => {

    const renderError = ({ touched, invalid, error }) => {
        return touched &&
            invalid &&
            <div className="text-danger form-control-sm">{error}</div>;
    }

    // Props that are sent to this renderInput function include the input object, meta object and
    // our own label prop that we added when creating the Field instance. We destructure them
    // directly here in the function prototype.
    const renderTextInput = ({ input, label, meta, required }) => {
        const labelText = required ? <>{label} <span style={{ color: "red" }}>*</span></> : <>{label}</>;
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
                    style={meta.touched && meta.invalid ? { borderColor: "red" } : null} />
                {renderError(meta)}
            </div>
        );
    };

    const renderNumberInput = ({ input, label, meta, required }) => {
        const labelText = required ? <>{label} <span style={{ color: "red" }}>*</span></> : <>{label}</>;
        return (
            <div className="text-start mb-2">
                <label
                    className="form-label form-control-sm mb-0 text-muted"
                    htmlFor={input.name}>
                    {labelText}
                </label>
                <input
                    className="form-control form-control-sm"
                    type="number"
                    id={input.name}
                    {...input}
                    autoComplete="off"
                    style={meta.touched && meta.invalid ? { borderColor: "red" } : null} />
                {renderError(meta)}
            </div>
        );
    };

    const renderSelectInput = ({ input, label, meta, required, values }) => {
        const labelText = required ? <>{label} <span style={{ color: "red" }}>*</span></> : <>{label}</>;
        const renderOptions = () => {
            return values.map(value => <option key={value} value={value}>{value}</option>);
        }
        return (
            <div className="text-start mb-2">
                <label
                    className="form-label form-control-sm mb-0 text-muted"
                    htmlFor={input.name}>
                    {labelText}
                </label>
                <select
                    className="form-select form-select-sm"
                    id={input.name}
                    {...input}
                    autoComplete="off"
                    style={meta.touched && meta.invalid ? { borderColor: "red" } : null}>
                    <option value="" hidden ></option>
                    {renderOptions()}
                </select>
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
            showSubmitButton={false}
            formId={props.formId}
            formRef={props.formRef}
        >
            {(props) => {
                return (
                    <form className="" id={props.formId} ref={props.formRef} onSubmit={props.handleSubmit}>
                        <Field name="name" component={renderTextInput} label="Address Name" required />
                        <Field name="line1" component={renderTextInput} label="Address Line 1" required />
                        <Field name="line2" component={renderTextInput} label="Address Line 2" />
                        <Field name="line3" component={renderTextInput} label="Address Line 3" />
                        <Field name="city" component={renderTextInput} label="City" required />
                        <Field name="postcode" component={renderTextInput} label="Post Code" required />
                        <div className="row">
                            <div className="col-sm-7">
                                <Field name="propertyType" component={renderSelectInput} label="Property Type" values={propertyTypes} required />
                            </div>
                            <div className="col-sm-5">
                                <Field name="percentOwned" component={renderNumberInput} label="Percent Owned" required />
                            </div>
                        </div>
                        {props.showSubmitButton && <button className="btn btn-primary" type="submit">Add</button>}
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

    if (!formValues.city) {
        errors.city = "City is required";
    }

    if (!formValues.propertyType) {
        errors.propertyType = "Property Type is required";
    }

    if (!formValues.percentOwned) {
        errors.percentOwned = "Percent Owned is required";
    }

    if(formValues.percentOwned < 1 || formValues.percentOwned > 100 ) {
        errors.percentOwned = "Must be between 1 and 100%";
    }
    return errors;
}

export default RentalPropertyForm;
