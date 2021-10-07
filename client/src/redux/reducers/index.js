import { combineReducers } from 'redux';
import userReducer from './userReducer';
import landlordReducer from './landlordReducer';

export default combineReducers({
    user: userReducer,
    landlord: landlordReducer
});
