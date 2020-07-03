import React from 'react';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';

import { appStores } from 'stores';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
`;

function appState() {
  const {
    employeeStore,
  } = appStores();

  return useObserver(() => ({
    sorter: employeeStore.sorter,
    onSorter: employeeStore.onSorter,
  }));
}

export default function SortItem({ column, children }) {
  const {
    sorter,
    onSorter,
  } = appState();

  return (
    <Container onClick={() => { onSorter(column); }}>
      {children}
      {column === sorter.field && (
        <IconContainer>
          {sorter.order === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined /> }
        </IconContainer>
      )}
    </Container>
  );
}

SortItem.propTypes = {
  children: PropTypes.any,
  column: PropTypes.string,
};

SortItem.defaultProps = {
  column: '',
};
