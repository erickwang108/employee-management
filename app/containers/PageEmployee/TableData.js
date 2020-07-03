import React from 'react';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import {
  Tooltip,
  Button,
  Table,
  Popover,
} from 'antd';
import {
  EditOutlined,
} from '@ant-design/icons';

import { appStores } from 'stores';
import SortItem from './SortItem';
import DetailPanel from './DetailPanel';
import DeleteButton from './DeleteButton';
import { ButtonsContainer } from './styles';

function appState() {
  const {
    employeeStore,
  } = appStores();

  return useObserver(() => ({
    dataState: toJS(employeeStore.dataState),
    pagination: employeeStore.pagination,
    onEditItem: employeeStore.onEditItem,
    onDeleteItem: employeeStore.onDeleteItem,
    onChangeData: employeeStore.onChangeData,
    onSelectTableRows: employeeStore.onSelectTableRows,
  }));
}

export default function TableData() {
  const {
    dataState,
    onEditItem,
    onChangeData,
    pagination,
    onDeleteItem,
    onSelectTableRows,
  } = appState();

  const columns = [{
    title: '索引',
    key: 'index',
    align: 'left',
    dataIndex: 'index',
    render: (text, item, index) => {
      return (pagination.pageSize * (pagination.current - 1)) + index + 1;
    },
  }, {
    title: <SortItem column="employeeName">姓名</SortItem>,
    key: 'employeeName',
    align: 'left',
    dataIndex: 'employeeName',
    render(text, record) {
      return (
        <Popover
          title="员工详细信息"
          content={<DetailPanel data={record} />}
          placement="right"
        >
          <a>{text}</a>
        </Popover>
      );
    },
  }, {
    title: <SortItem column="maritalStatus">婚姻状况</SortItem>,
    key: 'maritalStatus',
    align: 'left',
    dataIndex: 'maritalStatus',
    render: (text = '') => {
      return text === 1 ? '已婚' : '未婚';
    },
  }, {
    title: <SortItem column="partyName">政治面貌</SortItem>,
    align: 'left',
    key: 'partyName',
    dataIndex: 'partyName',
  }, {
    title: <SortItem column="workTypeName">工时制</SortItem>,
    align: 'left',
    dataIndex: 'workTypeName',
  }, {
    title: <SortItem column="employmentFormName">用工方式</SortItem>,
    align: 'left',
    dataIndex: 'employmentFormName',
  }, {
    title: <SortItem column="educationName">学历</SortItem>,
    key: 'educationName',
    dataIndex: 'educationName',
    align: 'left',
  }, {
    title: <SortItem column="companyName">公司</SortItem>,
    align: 'left',
    dataIndex: 'companyName',
    render: (text, row) => {
      return row.companyName;
    },
  }, {
    title: <SortItem column="employeeUpdateDate">更新时间</SortItem>,
    dataIndex: 'employeeUpdateDate',
    key: 'employeeUpdateDate',
    render: (text = '') => {
      return text || '-';
    },
  }, {
    title: '操作',
    align: 'right',
    render: (text, record) => (
      <ButtonsContainer>
        <Tooltip placement="bottom" title="编辑员工信息">
          <Button
            icon={<EditOutlined />}
            onClick={() => { onEditItem(record.employeeId); }}
          />
        </Tooltip>
        <DeleteButton onConfirm={() => { onDeleteItem(record.employeeId); }} />
      </ButtonsContainer>
    ),
  }];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      onSelectTableRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      columns={columns}
      pagination={pagination}
      loading={dataState.loading}
      dataSource={dataState.list}
      onChange={onChangeData}
    />
  );
}
