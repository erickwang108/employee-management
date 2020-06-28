import { observable, reaction, action } from 'mobx';

import { mergeValue } from 'helpers';
import {
  readConfig,
  saveConfig,
} from 'helpers/configUtils';

export default class ConfigStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.configData,
      (configData) => {
        this.validateConfigData(configData);
      },
    );
  }

  @observable configData = null;

  @observable errors = [];

  @action
  initConfig = () => {
    this.configData = readConfig();
  };

  @action
  getConfigData = () => {
    const configData = readConfig();

    this.validateConfigData(configData);

    return this.errors.length > 0 ? null : configData;
  };

  @action
  validateConfigData = (configData) => {
    const { dbPath } = configData;
    this.errors = [];

    if (!dbPath || !/.db$/.test(dbPath)) {
      this.errors = [{
        key: 'dbPath',
        msg: '数据库路径不正确,请检查!',
      }];
    }
  };

  @action
  onUpdateData = (key, value) => {
    this.configData = mergeValue(this.configData, key, value);
    console.log(this.configData.dbPath)
  };

  @action
  onSaveConfig = async () => {
    saveConfig(this.configData);
  };
}
