import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import {
  Menu,
  Tooltip,
  Button,
  Table,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { appStores } from 'stores';
import {
  Container,
  LeftContainer,
  RightContainer,
  ButtonsContainer,
  TableHeaderContainer,
  ListTitleContainer,
  TableContentContainer,
  TableHeaderRightContainer,
  TableHeaderLeftContainer,
} from './styles';
import EditModal from './EditModal';

function appState() {
  const {
    baseDataStore,
  } = appStores();

  return useObserver(() => ({
    sidebar: baseDataStore.sidebar,
    onClickMenu: baseDataStore.onClickMenu,
    getList: baseDataStore.getList,
    onAddItem: baseDataStore.onAddItem,
    onDeleteItem: baseDataStore.onDeleteItem,
    onEditItem: baseDataStore.onEditItem,
    pagination: baseDataStore.pagination,
    onChangeData: baseDataStore.onChangeData,
    dataState: toJS(baseDataStore.dataState),
  }));
}

export default function PageBaseData() {
  const {
    sidebar,
    onClickMenu,
    dataState,
    getList,
    onEditItem,
    onChangeData,
    pagination,
    onAddItem,
    onDeleteItem,
  } = appState();

  useEffect(() => {
    getList(true);
  }, []);

  const columns = [{
    title: '索引号',
    dataIndex: 'index',
    render: (text, item, index) => {
      return (pagination.pageSize * (pagination.current - 1)) + index + 1;
    },
  }, {
    title: '名称',
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
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <ButtonsContainer>
        <Tooltip placement="bottom" title="编辑">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditItem(record.id)}
          />
        </Tooltip>
        <Popconfirm
          title="确定删除?"
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

  const activeItem = sidebar.list.find(({ id }) => id === sidebar.activeItemId);

  return (
    <Container>
      <LeftContainer>
        <Menu
          mode="inline"
          style={{ width: 120 }}
          defaultSelectedKeys={[sidebar.activeItemId]}
          onClick={onClickMenu}
        >
          {sidebar.list.map(({ id, name }) => (
            <Menu.Item key={id}>{name}</Menu.Item>
          ))}
        </Menu>
      </LeftContainer>
      <RightContainer>
        <TableHeaderContainer>
          <TableHeaderLeftContainer>
            <ListTitleContainer>
              {activeItem.name}
              列表
            </ListTitleContainer>
          </TableHeaderLeftContainer>
          <TableHeaderRightContainer>
            <Tooltip placement="bottom" title="点击添加基础数据类型">
              <Button icon={<PlusOutlined />} type="primary" onClick={onAddItem}>添加</Button>
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
      </RightContainer>
    </Container>
  );
}
