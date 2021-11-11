import axios from 'axios';
import { signOut, getCookie } from '../../auth/helpers';
import { 
    LOAD_LANDLORD, 
    SIGN_IN, 
    SIGN_OUT,
    CREATE_PROPERTY,
    DELETE_PROPERTY,
    LOG_ERROR,
    CLEAR_ERROR,
    LOG_SUCCESS,
    CLEAR_SUCCESS,
    CSRF_TOKEN } from './types';


export const signin = (user) => async dispatch => {
    dispatch({
        type: SIGN_IN,
        payload: user
    });
};

export const signout = () => dispatch => {
    signOut();
    dispatch({
        type: SIGN_OUT
    });
};

export const saveCSRFToken = (csrfToken) => {
    return {
        type: CSRF_TOKEN,
        payload: csrfToken
    };
};

export const loadLandlord = (landlord) => dispatch => {
    dispatch({
        type: LOAD_LANDLORD,
        payload: landlord
    });
}

export const createRentalProperty = (property) => dispatch => {
    // perform an axios POST to the properties url
    axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API}/properties`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}` },
        data: property
    })
    .then(response => {
        dispatch({
            type: CREATE_PROPERTY,
            payload: response.data.newProperty
        });
        dispatch({
            type: LOG_ERROR,
            payload: ''
        })
    })
    .catch(err => {
        const errMsg = err.response.data.error;
        dispatch({
            type: LOG_ERROR,
            payload: errMsg
        });
    });
}

export const deleteRentalProperty = (propertyId) => (dispatch, getState) => {

    const csrfToken = getState().user.csrfToken;

    // perform an axios DELETE to the properties url
    axios({
        method: 'DELETE',
        url: `${process.env.REACT_APP_API}/properties/${propertyId}`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}`,
                   "csrf-token": csrfToken },
        withCredentials: true
    })
    .then(response => {
        dispatch({
            type: DELETE_PROPERTY,
            payload: propertyId
        });
        dispatch({
            type: LOG_ERROR,
            payload: ''
        })
    })
    .catch(err => {
        const errMsg = err.response.data.error;
        dispatch({
            type: LOG_ERROR,
            payload: errMsg
        });
    });
}

export const logError = (error)  => {
    return {
        type: LOG_ERROR, 
        payload: error
    };
}

export const clearError = ()  => {
    return {
        type: CLEAR_ERROR
    };
}

export const logSuccess = (success)  => {
    return {
        type: LOG_SUCCESS, 
        payload: success
    };
}

export const clearSuccess = ()  => {
    return {
        type: CLEAR_SUCCESS
    };
}