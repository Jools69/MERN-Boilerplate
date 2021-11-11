import React, { useState } from 'react';
import { connect } from 'react-redux';
import Property from './Property';
import { deleteRentalProperty } from '../../redux/actions';
import Modal from '../shared components/Modal';

const PropertiesList = (props) => {

    const { properties, onAdd } = props;

    const [showModal, setShowModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const performDelete = () => {
        props.deleteRentalProperty(idToDelete);
        setShowModal(false);
    } 

    const handleDeleteClick = (id) => {
        setIdToDelete(id);
        setShowModal(true);
    }

    const getNameFor = (propertyId) => {
        if(propertyId) {
            const property = properties.find(el => el._id === propertyId);
            return property?.property.name || '';
        }
    }

    const renderProperties = () => {
        return (
            <React.Fragment>
            <ul className="list-group-flush ps-0">
                {
                    properties.map((property) => {
                        return (
                            <li className="list-group-item" key={property._id}>
                                <Property 
                                    property={property.property} 
                                    percentOwned={property.percentOwned} 
                                    onDelete={() => handleDeleteClick(property._id)}/>
                            </li>
                        );
                    })
                }
            </ul>
            <Modal
                show={showModal}
                title={<h3>Delete Property</h3>}
                content={<p className="fs-4">{`Are you sure you want to delete ${getNameFor(idToDelete)}?`}</p>}
                actions={
                    <React.Fragment>
                        <button className="btn btn-success" onClick={() => {setShowModal(false)}}>Cancel</button>
                        <button className="btn btn-danger" onClick={performDelete}>Delete</button>
                    </React.Fragment>
                }
            />
            </React.Fragment>
        )
    }

    const renderPropertiesCard = () => {
        return (
            <div className="card shadow">
                <div className="card-body">
                    <h4 className="card-title mb-3 mx-2">Property Portfolio</h4>
                    {properties?.length > 0 &&
                        <React.Fragment>
                            {renderProperties()}
                        </React.Fragment>
                    }
                    {(!properties || properties?.length === 0) &&
                        <p className="card-text">You have not yet added any properties</p>
                    }
                </div>
                <div className="card-body d-flex justify-content-end pt-0">
                    <button className="btn btn-primary shadow" onClick={onAdd}>Add Property</button>
                </div>
            </div>
        );
    }

    return renderPropertiesCard();
}

const mapStateToProps = (state) => {
    return {
        properties: state.landlord.landlord.properties
    };
}

export default connect(mapStateToProps, { deleteRentalProperty })(PropertiesList);