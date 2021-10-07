import { LOAD_LANDLORD, SIGN_IN, SIGN_OUT } from './types';
import { signOut } from '../../auth/helpers';

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

export const loadLandlord = (landlord) => dispatch => {
    dispatch({
        type: LOAD_LANDLORD,
        payload: landlord
    });
}

export const createRentalProperty = (property) => dispatch => {
    console.log('DISPATCHING CREATE_RENTAL_PROPERTY', property);
    return {
        type: 'CREATE_RENTAL_PROPERTY'
    }
}