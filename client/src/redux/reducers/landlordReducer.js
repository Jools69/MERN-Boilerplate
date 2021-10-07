import { LOAD_LANDLORD, SIGN_OUT } from '../actions/types';

// Check to see if a user is already signed in, and if so, use as the initial state.
let initialState = {
    landlord: {}
};

const landlordReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_LANDLORD:
            return { ...state, landlord: action.payload };
        case SIGN_OUT:
            return initialState;
        default:
            return state;
    };
};

export default landlordReducer;