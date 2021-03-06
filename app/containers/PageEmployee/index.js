import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import moment from 'moment';
import {
  Tooltip,
  Button,
  Input,
  notification,
} from 'antd';
import {
  FileSearchOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { appStores } from 'stores';
import EditModal from './EditModal';
import TableData from './TableData';
import DeleteButton from './DeleteButton';
import PopoverFilter from './PopoverFilter';
import {
  Container,
  TableHeaderContainer,
  ListTitleContainer,
  TableCenterContainer,
  TableContentContainer,
  TableHeaderRightContainer,
  TableHeaderLeftContainer,
  Splitter,
} from './styles';

const { app, dialog } = require('electron').remote;

function appState() {
  const {
    employeeStore,
  } = appStores();

  return useObserver(() => ({
    filterData: employeeStore.filterData,
    pagination: employeeStore.pagination,
    getList: employeeStore.getList,
    notifiContent: employeeStore.notifiContent,
    selectedIdList: employeeStore.selectedIdList,
    onAddItem: employeeStore.onAddItem,
    onSaveFile: employeeStore.onSaveFile,
    onClearNotifi: employeeStore.onClearNotifi,
    onFilterData: employeeStore.onFilterData,
    onDeleteItems: employeeStore.onDeleteItems,
    onFilterList: employeeStore.onFilterList,
    onResetFilterData: employeeStore.onResetFilterData,
    onUpdateFilterData: employeeStore.onUpdateFilterData,
  }));
}

export default function PageEmployee() {
  const {
    getList,
    filterData,
    pagination,
    selectedIdList,
    onSaveFile,
    notifiContent,
    onAddItem,
    onClearNotifi,
    onFilterList,
    onDeleteItems,
    onResetFilterData,
    onUpdateFilterData,
  } = appState();

  useEffect(() => {
    onResetFilterData();
    getList();
  }, []);

  useEffect(() => {
    if (notifiContent) {
      notification.open({
        duration: 2,
        message: '消息',
        description: notifiContent,
        onClose: onClearNotifi,
      });
    }
  }, [notifiContent]);

  return (
    <Container>
      <TableHeaderContainer>
        <TableHeaderLeftContainer>
          <ListTitleContainer>
            员工列表 - 共计
            {pagination.total}
            人
          </ListTitleContainer>
        </TableHeaderLeftContainer>
        <TableCenterContainer>
          关键字：
          <Input
            allowClear
            value={filterData.employeeName}
            style={{ width: '320px' }}
            placeholder="请输入员工姓名"
            addonAfter={(
              <Button
                icon={<FileSearchOutlined />}
                type="link"
                size="small"
                onClick={onFilterList}
              >
                查询
              </Button>
            )}
            onChange={(e) => { onUpdateFilterData('employeeName', e.target.value); }}
            onPressEnter={(d) => {
              if (d.keyCode === 13) {
                onFilterList();
              }
            }}
          />
          <Splitter width="8px" />
          <PopoverFilter />
        </TableCenterContainer>
        <TableHeaderRightContainer>
          <Tooltip placement="bottom" title="点击添加员工">
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={onAddItem}>新增</Button>
          </Tooltip>
          <Tooltip placement="bottom" title="下载/导出查询结果">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const filename = dialog.showSaveDialogSync(null, {
                  defaultPath: `${app.getPath('documents')}/${moment().format('YYYYMMDDHHMM')}.xlsx`,
                  filters: [
                    { name: 'Excel workbook (.xlsx)', extensions: ['xlsx'] },
                    { name: 'Excel 97-2004 workbook (.xls)', extensions: ['xls'] },
                    { name: 'All', extensions: ['*'] },
                  ],
                });
                onSaveFile(filename);
              }}
            >
              下载
            </Button>
          </Tooltip>
          {selectedIdList.length > 0 && (
            <DeleteButton onConfirm={() => { onDeleteItems(); }}>
              已选中
              {selectedIdList.length}
            </DeleteButton>
          )}
          <Tooltip placement="bottom" title="刷新列表">
            <Button icon={<ReloadOutlined />} onClick={getList}>刷新</Button>
          </Tooltip>
        </TableHeaderRightContainer>
      </TableHeaderContainer>
      <TableContentContainer>
        <TableData />
      </TableContentContainer>
      <EditModal />
    </Container>
  );
}
