import { LOG_ERROR, CLEAR_ERROR, LOG_SUCCESS, CLEAR_SUCCESS } from '../actions/types';

// Check to see if a user is already signed in, and if so, use as the initial state.
let initialState = {
    error: {
        message: ''
    },
    success: {
        message: ''
    }
};

const feedbackReducer = (state = initialState, action) => {
    switch(action.type) {
        // An error was returned from the API during the creation of a new property
        case LOG_ERROR:
            return { ...state, error: { message: action.payload } };
        case CLEAR_ERROR:
            return { ...state, error: { message: '' } };
        case LOG_SUCCESS:
            return { ...state, success: { message: action.payload } };
        case CLEAR_SUCCESS:
            return { ...state, success: { message: '' } };
        default:
            return state;
    };
};

export default feedbackReducer;