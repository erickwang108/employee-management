import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import {
  DeleteOutlined,
} from '@ant-design/icons';

export default function DeleteButton({ children, onConfirm }) {
  return (
    <Popconfirm
      title="确定删除该员工信息,删除后无法恢复?"
      onConfirm={onConfirm}
      placement="bottomRight"
      okText="是"
      cancelText="否"
    >
      <Button type="danger" icon={<DeleteOutlined />}>
        {children}
      </Button>
    </Popconfirm>
  );
}

DeleteButton.propTypes = {
  children: PropTypes.element,
  onConfirm: PropTypes.func.isRequired,
};
