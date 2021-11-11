import { LOAD_LANDLORD, CREATE_PROPERTY, DELETE_PROPERTY, SIGN_OUT } from '../actions/types';

// Check to see if a user is already signed in, and if so, use as the initial state.
let initialState = {
    landlord: {}
};

let properties;

const landlordReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_LANDLORD:
            return { ...state, landlord: action.payload };
        case CREATE_PROPERTY:
            properties = [...state.landlord.properties, action.payload];
            return { ...state, landlord: { ...state.landlord, properties } };
        case DELETE_PROPERTY:
            properties = state.landlord.properties.filter(property => property._id !== action.payload);
            return { ...state, landlord: { ...state.landlord, properties } }; 
        case SIGN_OUT:
            return initialState;
        default:
            return state;
    };
};

export default landlordReducer;