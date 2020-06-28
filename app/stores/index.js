import React from 'react';
import 'mobx-react-lite/batchingOptOut';
import { MobXProviderContext } from 'mobx-react';

import BaseDataStore from './BaseDataStore';
import ConfigStore from './ConfigStore';
import EmployeeStore from './EmployeeStore';
import CompanyStore from './CompanyStore';
import DeptStore from './DeptStore';

export default class AppStore {
  constructor() {
    this.configStore = new ConfigStore(this);
    this.baseDataStore = new BaseDataStore(this);
    this.companyStore = new CompanyStore(this);
    this.deptStore = new DeptStore(this);
    this.employeeStore = new EmployeeStore(this);
  }

  getStores() {
    return {
      configStore: this.configStore,
      baseDataStore: this.baseDataStore,
      companyStore: this.companyStore,
      deptStore: this.deptStore,
      employeeStore: this.employeeStore,
    };
  }

  getStore(name = '') {
    if (name !== '') {
      return this[name];
    }

    return null;
  }
}

export function appStores() {
  return React.useContext(MobXProviderContext);
}
