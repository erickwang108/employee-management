import styled from 'styled-components';

export const Container = styled.div`
  display: block;
  padding: 12px 24px;
  width: 100%;
`;

export const ButtonsContainer = styled.div`
  .ant-btn {
    margin-left: 6px;
  }
`;

export const ModalContainer = styled.div`
  .ant-form-item {
    margin-bottom: 8px;
  }
`;

export const TableContainer = styled.div`
`;

export const TableHeaderContainer = styled.div`
  margin: 12px 0px;
  display: flex;
  padding-bottom: 12px;
  border-bottom: 1px solid #fff;
`;

export const TableHeaderLeftContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
`;

export const TableCenterContainer = styled.div`
  flex: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ListTitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
  align-items: center;
  display: flex;
`;

export const TableHeaderRightContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  > button {
    margin-left: 12px;
  }
`;

export const TableContentContainer = styled.div`
`;

export const Splitter = styled.div`
  width: ${({ width = '2px' }) => parseInt(width, 10)}px;
`;
