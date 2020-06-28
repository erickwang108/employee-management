import React from 'react';
import { useObserver } from 'mobx-react';

import {
  Modal,
  Form,
  Input,
} from 'antd';

import { appStores } from 'stores';

const { TextArea } = Input;

function appState() {
  const {
    deptStore,
  } = appStores();

  return useObserver(() => ({
    tmpData: deptStore.tmpData,
    onUpdateTmpData: deptStore.onUpdateTmpData,
    onSaveData: deptStore.onSaveData,
    onResetTmpData: deptStore.onResetTmpData,
  }));
}

export default function EditModal() {
  const {
    tmpData,
    onUpdateTmpData,
    onSaveData,
    onResetTmpData,
  } = appState();

  if (!tmpData) {
    return null;
  }

  return (
    <Modal
      visible
      title="创建或编辑公司的部门信息"
      okText="保存"
      cancelText="取消"
      onOk={onSaveData}
      onCancel={onResetTmpData}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="部门名称">
          <Input
            value={tmpData.name}
            onChange={(e) => { onUpdateTmpData('name', e.target.value); }}
          />
        </Form.Item>
        <Form.Item label="备注">
          <TextArea
            rows={4}
            value={tmpData.remark}
            onChange={(e) => { onUpdateTmpData('remark', e.target.value); }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
