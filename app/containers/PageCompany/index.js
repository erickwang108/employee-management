import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import {
  Tooltip,
  Button,
  Table,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';

import { appStores } from 'stores';
import EditModal from './EditModal';
import {
  Container,
  ButtonsContainer,
  TableHeaderContainer,
  ListTitleContainer,
  TableContentContainer,
  TableHeaderRightContainer,
  TableHeaderLeftContainer,
} from './styles';

function appState() {
  const {
    companyStore,
  } = appStores();

  return useObserver(() => ({
    getList: companyStore.getList,
    onAddItem: companyStore.onAddItem,
    onDeleteItem: companyStore.onDeleteItem,
    onEditItem: companyStore.onEditItem,
    pagination: companyStore.pagination,
    onChangeData: companyStore.onChangeData,
    dataState: toJS(companyStore.dataState),
  }));
}

export default function PageCompany() {
  const {
    dataState,
    getList,
    onEditItem,
    onChangeData,
    pagination,
    onAddItem,
    onDeleteItem,
  } = appState();
  const history = useHistory();

  useEffect(() => {
    getList();
  }, []);

  const columns = [{
    title: '索引号',
    dataIndex: 'index',
    render: (text, item, index) => {
      return (pagination.pageSize * (pagination.current - 1)) + index + 1;
    },
  }, {
    title: '公司名称',
    dataIndex: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
  }, {
    title: '更新时间',
    dataIndex: 'updateDate',
    key: 'updateDate',
    render: (text = '') => {
      return text || '-';
    },
  }, {
    title: '部门',
    render: (text, record) => {
      return (
        <Button
          icon={<ReconciliationOutlined />}
          onClick={() => history.push(`/dept/${record.id}`)}
        >
          列表
        </Button>
      );
    },
  }, {
    title: '操作',
    align: 'center',
    key: 'action',
    render: (text, record) => (
      <ButtonsContainer>
        <Tooltip placement="bottom" title="编辑已存的公司">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditItem(record.id)}
          />
        </Tooltip>
        <Popconfirm
          title="确定删除该公司?"
          onConfirm={() => onDeleteItem(record.id)}
          placement="bottomRight"
          okText="是"
          cancelText="否"
        >
          <Button type="danger" icon={<DeleteOutlined />} />
        </Popconfirm>
      </ButtonsContainer>
    ),
  }];

  return (
    <Container>
      <TableHeaderContainer>
        <TableHeaderLeftContainer>
          <ListTitleContainer>
            公司列表
          </ListTitleContainer>
        </TableHeaderLeftContainer>
        <TableHeaderRightContainer>
          <Tooltip placement="bottom" title="点击添加公司">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddItem}
            >
              添加
            </Button>
          </Tooltip>
        </TableHeaderRightContainer>
      </TableHeaderContainer>
      <TableContentContainer>
        <Table
          columns={columns}
          pagination={pagination}
          loading={dataState.loading}
          dataSource={dataState.list}
          onChange={onChangeData}
        />
      </TableContentContainer>
      <EditModal />
    </Container>
  );
}
