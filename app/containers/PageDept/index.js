import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Tooltip,
  Button,
  Table,
  Popconfirm,
  PageHeader,
} from 'antd';
import {
  PlusCircleFilled,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { appStores } from 'stores';
import EditModal from './EditModal';
import {
  Container,
  ButtonsContainer,
  TableContentContainer,
} from './styles';

function appState() {
  const {
    deptStore,
  } = appStores();

  return useObserver(() => ({
    getCompany: deptStore.getCompany,
    company: deptStore.company,
    onAddItem: deptStore.onAddItem,
    onDeleteItem: deptStore.onDeleteItem,
    onEditItem: deptStore.onEditItem,
    pagination: deptStore.pagination,
    onChangeData: deptStore.onChangeData,
    dataState: toJS(deptStore.dataState),
  }));
}

export default function PageCompany() {
  const {
    company,
    dataState,
    getCompany,
    onEditItem,
    onChangeData,
    pagination,
    onAddItem,
    onDeleteItem,
  } = appState();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    getCompany(params.cid);
  }, []);

  if (!company) {
    return null;
  }

  const columns = [{
    title: '索引号',
    dataIndex: 'index',
    render: (text, item, index) => {
      return (pagination.pageSize * (pagination.current - 1)) + index + 1;
    },
  }, {
    title: '部门名称',
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
        <Tooltip placement="bottom" title="编辑已存的部门">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditItem(record.id)}
          />
        </Tooltip>
        <Popconfirm
          title="确定删除该部门?"
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
      <PageHeader
        onBack={() => { history.push(`/company`); }}
        title="返回"
        subTitle={`${company.name} - 部门列表`}
        extra={[
          <Tooltip key="addItem" placement="bottom" title="点击添加部门">
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={onAddItem}
            >
              添加
            </Button>
          </Tooltip>,
        ]}
      />
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
