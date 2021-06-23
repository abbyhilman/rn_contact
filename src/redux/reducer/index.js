import {combineReducers} from 'redux';
import {globalReducer} from './global';
import {homeReducer} from './home';
import {contactReducer} from './newcontact';

const reducer = combineReducers({
  globalReducer,
  homeReducer,
  contactReducer,
});

export default reducer;
