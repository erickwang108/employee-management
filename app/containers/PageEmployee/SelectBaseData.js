import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import { Form, Select } from 'antd';

import { appStores } from 'stores';
import { ITEM_KEYS } from 'constants';

const { Option } = Select;

function appState() {
  const {
    employeeStore,
  } = appStores();

  return useObserver(() => ({
    tmpData: employeeStore.tmpData,
    filterData: employeeStore.filterData,
    baseDataMap: employeeStore.baseDataMap,
    onUpdateTmpData: employeeStore.onUpdateTmpData,
    onUpdateFilterData: employeeStore.onUpdateFilterData,
  }));
}

export default function SelectBaseData({ id, type, formLabel }) {
  const {
    tmpData,
    baseDataMap,
    onUpdateTmpData,
  } = appState();
  const srcDataList = baseDataMap[type] || [];
  const [filterList, setFilterList] = useState(srcDataList);

  if (!tmpData) {
    return null;
  }

  const selectValue = tmpData[id] > 0 ? [tmpData[id]] : [];

  const component = (
    <Select
      showSearch
      placeholder="请选择..."
      optionFilterProp="name"
      filterOption={false}
      value={selectValue}
      onChange={(val) => { onUpdateTmpData(id, val); }}
      onSearch={(val) => {
        const nextList = val ? srcDataList.filter(({ name }) => name.includes(val)) : srcDataList;
        setFilterList(nextList);
      }}
    >
      {filterList.map((item) => (
        <Option key={item.id} value={item.id}>{item.name}</Option>
      ))}
    </Select>
  );

  if (formLabel) {
    return (
      <Form.Item label={formLabel}>
        {component}
      </Form.Item>
    );
  }

  return component;
}

SelectBaseData.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(ITEM_KEYS).isRequired,
  formLabel: PropTypes.string,
};
