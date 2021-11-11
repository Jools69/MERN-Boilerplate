import { FormError } from './FormError';

// Props that are sent to this renderInput function include the input object, meta object and
// our own label prop that we added when creating the Field instance. We destructure them
// directly here in the function prototype.
export const TextInput = ({ input, label, meta, required }) => {
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
            {FormError(meta)}
        </div>
    );
};

export const NumberInput = ({ input, label, meta, required }) => {
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
            {FormError(meta)}
        </div>
    );
};

export const SelectInput = ({ input, label, meta, required, values }) => {
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
            {FormError(meta)}
        </div>
    );
};