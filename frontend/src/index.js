import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase/app';
import App from './components/App';
import reducers from './reducers';
import refreshCredentialsMiddleware from './middleware/refreshCredentials';
import './styles/css/index.css';
import { signInCurrentStudent } from './actions/studentAuthActions';
import { getSignedInAdmin } from './actions/adminAuthActions';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk, refreshCredentialsMiddleware));

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
});

firebase.auth().onAuthStateChanged(user => {
  const action = user ? signInCurrentStudent() : getSignedInAdmin();

  store.dispatch(action);
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>, document.getElementById('root'));
