import React from 'react';
import { Link } from 'react-router-dom';

const Property = (props) => {
    const { percentOwned, property, onDelete } = props;

    return (
        <div className="row">
            <div className="col-5 propertyName">
                <Link className="text-decoration-none" to={`/properties/${property._id}`}>{property.name}</Link>
            </div>
            <div className="col-4 percentOwned text-secondary">
                You own {percentOwned}%
            </div>
            <div className="col-3 d-flex justify-content-end" >
                <Link to={`/properties/edit/${property._id}`} className="me-3"><i className="bi bi-pencil-fill text-success" /></Link>
                <Link to='#' onClick={onDelete}><i className="bi bi-trash-fill text-danger" /></Link>
            </div>
        </div>
    );
}

export default Property;