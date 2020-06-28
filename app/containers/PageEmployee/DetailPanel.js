import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  min-width: 200px;
  max-width: 300px;
  .label {
    text-align: left;
    font-weight: bold;
    font-size: 12px;
  }
  .text {
    overflow: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-size: 12px;
  }
  .boldText {
    overflow: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
    font-size: 12px;
    font-weight: bold;
  }
`;

export default function DetailPanel({ data }) {
  const {
    employeeName,
    contact,
    employeeRemark,
    sex,
    maritalStatus,
    hireDate,
    birthday,
    age,
    dutyName,
    companyName,
    deptName,
    partyName,
    educationName,
    graduateName,
    majorName,
    workTypeName,
    employmentFormName,
    nationName,
    employeeCreateDate,
    employeeUpdateDate,
  } = data;

  return (
    <Container>
      <Row>
        <Col span={8} className="label">
          员工姓名
        </Col>
        <Col span={16} className="boldText">
          {employeeName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          出生年月
        </Col>
        <Col span={16} className="text">
          {birthday}
          {' '}
          /
          {age}
          岁
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          入职日期
        </Col>
        <Col span={16} className="text">
          {hireDate || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          性别
        </Col>
        <Col span={16} className="text">
          {sex === 1 ? '男' : '女'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          婚姻状况
        </Col>
        <Col span={16} className="text">
          {maritalStatus === 1 ? '已婚' : '未婚'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          政治面貌
        </Col>
        <Col span={16} className="text">
          {partyName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          民族
        </Col>
        <Col span={16} className="text">
          {nationName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          工时制
        </Col>
        <Col span={16} className="text">
          {workTypeName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          用工方式
        </Col>
        <Col span={16} className="text">
          {employmentFormName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          所属公司
        </Col>
        <Col span={16} className="text">
          {companyName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          部门
        </Col>
        <Col span={16} className="text">
          {deptName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          职务
        </Col>
        <Col span={16} className="text">
          {dutyName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          最高学历
        </Col>
        <Col span={16} className="text">
          {educationName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          毕业院校
        </Col>
        <Col span={16} className="text">
          {graduateName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          专业名称
        </Col>
        <Col span={16} className="text">
          {majorName || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          联系方式
        </Col>
        <Col span={16} className="text">
          {contact || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          备注
        </Col>
        <Col span={16} className="text">
          {employeeRemark || '-'}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          创建时间
        </Col>
        <Col span={16} className="text">
          {employeeCreateDate}
        </Col>
      </Row>
      <Row>
        <Col span={8} className="label">
          更新时间
        </Col>
        <Col span={16} className="text">
          {employeeUpdateDate}
        </Col>
      </Row>
    </Container>
  );
}

DetailPanel.propTypes = {
  data: PropTypes.shape({
    employeeName: PropTypes.string,
    sex: PropTypes.number,
    maritalStatus: PropTypes.number,
    contact: PropTypes.string,
    employeeRemark: PropTypes.string,
    partyName: PropTypes.string,
    deptName: PropTypes.string,
    dutyName: PropTypes.string,
    companyName: PropTypes.string,
    educationName: PropTypes.string,
    graduateName: PropTypes.string,
    majorName: PropTypes.string,
    nationName: PropTypes.string,
    workTypeName: PropTypes.string,
    employmentFormName: PropTypes.string,
    hireDate: PropTypes.string,
    birthday: PropTypes.string,
    age: PropTypes.number,
    employeeCreateDate: PropTypes.string,
    employeeUpdateDate: PropTypes.string,
  }),
};
