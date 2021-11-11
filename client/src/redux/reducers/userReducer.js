import { isAuth } from '../../auth/helpers';
import { SIGN_IN, SIGN_OUT, CSRF_TOKEN } from '../actions/types';

// Check to see if a user is already signed in, and if so, use as the initial state.
let initialState = {
    user: {},
    userLoggedIn: false,
    csrfToken: null
};

const user = isAuth();

if(user) {
        initialState = { 
            user: { ...user },
            userLoggedIn: true
        };
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case SIGN_IN:
            return { ...state, user: action.payload, userLoggedIn: true };
        case SIGN_OUT:
            return { ...state, user: undefined, userLoggedIn: false };
        case CSRF_TOKEN:
            return { ...state, csrfToken: action.payload };
        default:
            return state;
    };
};

export default userReducer;