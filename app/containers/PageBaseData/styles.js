import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
`;

export const LeftContainer = styled.div`
  display: flex;
  width: 120px;
`;

export const RightContainer = styled.div`
  display: flex;
  display: block;
  margin: 0 12px;
  width: calc(100% - 120px);
`;

export const ButtonsContainer = styled.div`
  .ant-btn {
    margin-left: 6px;
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
  flex: 1;
  display: flex;
`;

export const ListTitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
  align-items: center;
`;

export const TableHeaderRightContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  > button {
    margin-left: 12px;
  }
`;

export const TableContentContainer = styled.div`

`;

export const FilterPanel = styled.div`
  margin-right: 24px;
  width: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const FilterLabel = styled.div`
  display: flex;
  margin: 0 12px;
  font-weight: bold;
  font-size: 14px;
  flex: 1;
`;

export const FIlterItem = styled.div`
  display: flex;
  flex: 3;
`;
