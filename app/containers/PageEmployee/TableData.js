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
    dataIndex: 'index',
    render: (text, item, index) => {
      return (pagination.pageSize * (pagination.current - 1)) + index + 1;
    },
  }, {
    title: '姓名',
    key: 'employeeName',
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
    title: '性别',
    key: 'sex',
    dataIndex: 'sex',
    render: (text = '') => {
      return text === 1 ? '男' : '女';
    },
  }, {
    title: '民族',
    key: 'nationId',
    dataIndex: 'nationId',
    render: (text, row) => {
      return row.nationName;
    },
  }, {
    title: '婚姻状况',
    key: 'maritalStatus',
    dataIndex: 'maritalStatus',
    render: (text = '') => {
      return text === 1 ? '已婚' : '未婚';
    },
  }, {
    title: '政治面貌',
    align: 'left',
    key: 'partyName',
    dataIndex: 'partyName',
  }, {
    title: '工时制',
    align: 'left',
    dataIndex: 'workTypeName',
  }, {
    title: '用工方式',
    align: 'left',
    dataIndex: 'employmentFormName',
  }, {
    title: '公司',
    align: 'left',
    render: (text, row) => {
      return row.companyName;
    },
  }, {
    title: '更新时间',
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
