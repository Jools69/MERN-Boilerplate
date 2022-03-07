import { LOAD_LANDLORD, UPDATE_LANDLORD_DATES, CREATE_PROPERTY, DELETE_PROPERTY, SIGN_OUT } from '../actions/types';

// Check to see if a user is already signed in, and if so, use as the initial state.
let initialState = {
    landlord: {},
    landlordLoaded: false
};

let portfolio;

const landlordReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_LANDLORD:
            return { ...state, landlord: action.payload, landlordLoaded: true };
        case UPDATE_LANDLORD_DATES:
            return { ...state };
        case CREATE_PROPERTY:
            portfolio = [...state.landlord.portfolio, action.payload];
            return { ...state, landlord: { ...state.landlord, portfolio } };
        case DELETE_PROPERTY:
            portfolio = state.landlord.portfolio.filter(property => property._id !== action.payload);
            return { ...state, landlord: { ...state.landlord, portfolio } }; 
        case SIGN_OUT:
            return initialState;
        default:
            return state;
    };
};

export default landlordReducer;