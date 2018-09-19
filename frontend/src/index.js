import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase/app';
import App from './components/App';
import reducers from './reducers';
import './styles/css/index.css';
import { signInCurrentStudent } from './actions/studentAuthActions';
import { getSignedInAdmin } from './actions/adminAuthActions';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('student logged in');
    store.dispatch(signInCurrentStudent());
  } else {
    console.log('admin logged in?');
    store.dispatch(getSignedInAdmin());
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>, document.getElementById('root'));
