import '@babel/polyfill';
import '@fortawesome/fontawesome-free/css/all.css';
import 'antd/dist/antd.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { MobXProviderContext } from 'mobx-react';
import { HashRouter } from 'react-router-dom';

import AppStore from 'stores';
import App from './containers/App';

const appStore = new AppStore();
const stores = appStore.getStores();

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render((
    <MobXProviderContext.Provider value={{ ...stores }}>
      <HashRouter>
        <App />
      </HashRouter>
    </MobXProviderContext.Provider>
  ), document.getElementById('root'));
});
