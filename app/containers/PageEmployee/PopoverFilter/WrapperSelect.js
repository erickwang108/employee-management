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
    onUpdateFilterData: employeeStore.onUpdateFilterData,
  }));
}

export default function WrapperSelect({ id, type, formLabel }) {
  const {
    filterData,
    baseDataMap,
    onUpdateFilterData,
  } = appState();
  const srcDataList = baseDataMap[type] || [];
  const [filterList, setFilterList] = useState(srcDataList);

  const component = (
    <Select
      showSearch
      placeholder="请选择..."
      optionFilterProp="name"
      value={[filterData[id]]}
      onChange={(val) => { onUpdateFilterData(id, val); }}
      filterOption={false}
      onSearch={(val) => {
        const nextList = val ? srcDataList.filter(({ name }) => name.includes(val)) : srcDataList;
        setFilterList(nextList);
      }}
    >
      <Option value={0}>全部</Option>
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

WrapperSelect.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(ITEM_KEYS).isRequired,
  formLabel: PropTypes.string,
};
