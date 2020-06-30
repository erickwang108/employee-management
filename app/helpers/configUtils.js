import Store from 'electron-store';

const { app } = require('electron').remote;

const store = new Store();

store.clear();

export function getDefaultDbPath() {
  return `${app.getAppPath()}/employee-database.sqlite`;
}

const DEF_CONFIG = {
  dbPath: '',
};

export function readConfig() {
  return {
    ...DEF_CONFIG,
    ...store.store,
  };
}

export function getConfig(key = '', defVal) {
  return store.get(key) || defVal;
}

export function saveConfig(configData) {
  store.store = {
    ...DEF_CONFIG,
    ...configData,
  };
}
