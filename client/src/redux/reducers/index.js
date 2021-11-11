import { combineReducers } from 'redux';
import userReducer from './userReducer';
import feedbackReducer from './feedbackReducer';
import landlordReducer from './landlordReducer';

export default combineReducers({
    user: userReducer,
    feedback: feedbackReducer,
    landlord: landlordReducer
});
