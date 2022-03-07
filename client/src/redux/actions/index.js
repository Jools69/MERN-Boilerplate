import axios from 'axios';
import { signOut, getCookie } from '../../auth/helpers';
import { 
    LOAD_LANDLORD, 
    UPDATE_LANDLORD_DATES, 
    SIGN_IN, 
    SIGN_OUT,
    CREATE_PROPERTY,
    UPDATE_PROPERTY,
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

export const loadLandlord = (userId) => dispatch => {

    axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API}/users/${userId}`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}` }
    })
    .then(response => {
        const landlordDetails = response.data.landlord;
        dispatch({
            type: CLEAR_SUCCESS
        });
        // Save the landlord details in the store
        dispatch({
            type: LOAD_LANDLORD,
            payload: landlordDetails
        });
    })
    .catch((err) => {
        const errMsg = err.response ? err.response.data.error : err.message;
        dispatch({
            type: LOG_ERROR,
            payload: errMsg
        });
    });
}

// export const loadLandlord = (landlord) => dispatch => {
//     dispatch({
//         type: LOAD_LANDLORD,
//         payload: landlord
//     });
// }

export const createRentalProperty = (property) => (dispatch, getState) => {

    const csrfToken = getState().user.csrfToken;

    // perform an axios POST to the properties url
    axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API}/properties`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}`,
        "csrf-token": csrfToken },
        withCredentials: true,
        data: { property }
    })
    .then(response => {
        dispatch({
            type: CREATE_PROPERTY,
            payload: response.data.newProperty
        });
        dispatch({
            type: CLEAR_ERROR
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

export const updateRentalProperty = (id, property) => (dispatch, getState) => {

    const csrfToken = getState().user.csrfToken;
    
    // perform an axios PUT to the properties url
    axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API}/properties/${id}`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}`,
                   "csrf-token": csrfToken },
        withCredentials: true,
        data: { id, property }
    })
    .then(response => {
        console.log("Response object: ", response);
        dispatch({
            type: UPDATE_PROPERTY,
            payload: response.data.updatedProperty
        });
        dispatch({
            type: CLEAR_ERROR
        });
        dispatch({
            type: LOG_SUCCESS,
            payload: response.data.message
        });
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
            type: CLEAR_ERROR
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

export const updateReportingRange = (startDate, endDate) => (dispatch, getState) => {

    console.log(startDate, endDate);

    const csrfToken = getState().user.csrfToken;

    // perform an axios PUT to the income/updateDateRange url
    axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API}/income/dateRange`,
        headers: { "Authorization": `Bearer ${getCookie('sessionToken')}`,
                   "csrf-token": csrfToken },
        withCredentials: true,
        data: { startDate, endDate }
    })
    .then(response => {
        console.log("Response object: ", response);
        dispatch({
            type: UPDATE_LANDLORD_DATES,
            payload: response.data
        });
        dispatch({
            type: CLEAR_ERROR
        });
        dispatch({
            type: LOG_SUCCESS,
            payload: response.data.message
        });
    })
    .catch(err => {
        const errMsg = err.response.data.error;
        dispatch({
            type: LOG_ERROR,
            payload: errMsg
        });
    });

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