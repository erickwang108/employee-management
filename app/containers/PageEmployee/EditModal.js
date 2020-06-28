import React from 'react';
import moment from 'moment';
import { useObserver } from 'mobx-react';
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
} from 'antd';

import { appStores } from 'stores';
import {
  DATE_FORMAT,
  ITEM_DUTY,
  ITEM_WORK_TYPE,
  ITEM_EDUCATION,
  ITEM_GRADUATE,
  ITEM_MAJOR,
  ITEM_NATION,
  ITEM_PARTY,
  ITEM_EMPLOYMENT_FORM,
} from 'constants';
import SelectBaseData from './SelectBaseData';
import { ModalContainer } from './styles';

const { Option } = Select;
const { TextArea } = Input;

function appState() {
  const {
    employeeStore,
  } = appStores();

  return useObserver(() => ({
    deptList: employeeStore.deptList,
    companyList: employeeStore.companyList,
    tmpData: employeeStore.tmpData,
    onUpdateTmpData: employeeStore.onUpdateTmpData,
    onSaveData: employeeStore.onSaveData,
    selectOptions: employeeStore.selectOptions,
    onChangeCompany: employeeStore.onChangeCompany,
    onResetTmpData: employeeStore.onResetTmpData,
  }));
}

export default function EditModal() {
  const {
    tmpData,
    deptList,
    companyList,
    onUpdateTmpData,
    onSaveData,
    onChangeCompany,
    onResetTmpData,
  } = appState();

  if (!tmpData) {
    return null;
  }

  return (
    <Modal
      visible
      title="创建或编辑员工信息"
      okText="保存"
      cancelText="取消"
      width="800px"
      onOk={onSaveData}
      onCancel={onResetTmpData}
    >
      <ModalContainer>
        <Row>
          <Col span={12}>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="姓名">
                <Input
                  value={tmpData.employeeName}
                  onChange={(e) => { onUpdateTmpData('employeeName', e.target.value); }}
                />
              </Form.Item>
              <Form.Item label="性别">
                <Radio.Group onChange={(e) => { onUpdateTmpData('sex', e.target.value); }} value={tmpData.sex}>
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="婚姻状况">
                <Radio.Group
                  onChange={(e) => { onUpdateTmpData('maritalStatus', e.target.value); }}
                  value={tmpData.maritalStatus}
                >
                  <Radio value={1}>已婚</Radio>
                  <Radio value={2}>未婚</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="出生日期">
                <DatePicker
                  format={DATE_FORMAT}
                  value={tmpData.birthday ? moment(tmpData.birthday) : moment()}
                  onChange={(md, date) => { onUpdateTmpData('birthday', date); }}
                />
              </Form.Item>
              <Form.Item label="入职日期">
                <DatePicker
                  format={DATE_FORMAT}
                  value={tmpData.hireDate ? moment(tmpData.hireDate) : moment()}
                  onChange={(md, date) => { onUpdateTmpData('hireDate', date); }}
                />
              </Form.Item>
              <SelectBaseData id="nationId" type={ITEM_NATION} formLabel="民族" />
              <SelectBaseData id="partyId" type={ITEM_PARTY} formLabel="政治面貌" />
              <SelectBaseData id="workTypeId" type={ITEM_WORK_TYPE} formLabel="工时制" />
              <SelectBaseData id="employmentFormId" type={ITEM_EMPLOYMENT_FORM} formLabel="用工方式" />
            </Form>
          </Col>
          <Col span={12}>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="公司">
                <Select
                  showSearch
                  placeholder="请选择..."
                  value={tmpData.companyId > 0 ? [tmpData.companyId] : []}
                  onChange={(value) => { onChangeCompany(value); }}
                >
                  {companyList.map((c) => (
                    <Option key={c.id} value={c.id}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="部门">
                <Select
                  placeholder="请选择..."
                  value={tmpData.deptId > 0 ? [tmpData.deptId] : []}
                  onChange={(value) => { onUpdateTmpData('deptId', value); }}
                >
                  {deptList.map((c) => (
                    <Option key={c.id} value={c.id}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <SelectBaseData id="dutyId" type={ITEM_DUTY} formLabel="职务" />
              <SelectBaseData id="educationId" type={ITEM_EDUCATION} formLabel="学历" />
              <SelectBaseData id="graduateId" type={ITEM_GRADUATE} formLabel="毕业院校" />
              <SelectBaseData id="majorId" type={ITEM_MAJOR} formLabel="专业" />
              <Form.Item label="联系方式">
                <Input
                  value={tmpData.contact}
                  onChange={(e) => { onUpdateTmpData('contact', e.target.value); }}
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
          </Col>
        </Row>
      </ModalContainer>
    </Modal>
  );
}
