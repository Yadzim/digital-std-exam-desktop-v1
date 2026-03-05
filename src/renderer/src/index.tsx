import * as React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.css';
import 'assets/scss_css/index.scss';
import 'assets/scss_css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import store from './store/index';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);
root.render(
  <Router
    getUserConfirmation={(message, callback) => {
      const allowTransition = window.confirm(message);
      callback(allowTransition);
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);
