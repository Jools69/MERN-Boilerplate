import React from 'react';
import { Field, Form } from 'react-final-form';
import { TextInput } from '../core/shared components/forms/FormInputs';

const ResetPasswordForm = (props) => {

    const handleSubmit = (formValues) => {

        props.onSubmit(formValues);
    }

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validate}
            // formId={props.formId}
            submitButtonText={props.submitButtonText}
            render={(props) => {
                return (
                    <form className="" onSubmit={props.handleSubmit}>
                        <Field name="password" type="password" component={TextInput} label="Password" required />
                        <Field name="passwordValidation" type="password" component={TextInput} label="Re-enter Password" required />
                        <button className="btn btn-primary mt-3" type="submit">{props.submitButtonText}</button>
                    </form>
                );
            }
            }
        />
    );
}

const validate = (formValues) => {
    const errors = {};
    console.log(formValues);

    if (!formValues.password) {
        errors.password = "Password is required";
    }

    if (formValues.password?.toString() !== formValues.passwordValidation?.toString()) {
        errors.passwordValidation = "Must match password above";
    }

    return errors;
}

export default ResetPasswordForm;