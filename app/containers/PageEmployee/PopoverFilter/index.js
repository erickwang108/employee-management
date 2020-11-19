import React from 'react';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import {
  Row,
  Col,
  Popover,
  Form,
  Input,
  Radio,
  Select,
  Button,
  DatePicker,
} from 'antd';
import {
  FilterOutlined,
} from '@ant-design/icons';

import { appStores } from 'stores';
import { toMoments } from 'helpers';
import {
  ITEM_DUTY,
  ITEM_WORK_TYPE,
  ITEM_EDUCATION,
  ITEM_GRADUATE,
  ITEM_MAJOR,
  ITEM_NATION,
  ITEM_PARTY,
  ITEM_EMPLOYMENT_FORM,
} from 'constants';
import WrapperSelect from './WrapperSelect';
import { FilterContainer, ButtonContainer } from './styles';

const { Option } = Select;
const { RangePicker } = DatePicker;

function appState() {
  const {
    employeeStore,
  } = appStores();

  return useObserver(() => ({
    deptList: employeeStore.deptList,
    companyList: employeeStore.companyList,
    filterData: toJS(employeeStore.filterData),
    showFilter: employeeStore.showFilter,
    selectOptions: employeeStore.selectOptions,
    onFilterList: employeeStore.onFilterList,
    onToggleShowFilter: employeeStore.onToggleShowFilter,
    onUpdateFilterData: employeeStore.onUpdateFilterData,
    onResetFilterData: employeeStore.onResetFilterData,
    isFilterChanged: employeeStore.isFilterChanged,
  }));
}

export default function PopoverFilter() {
  const {
    filterData,
    deptList,
    companyList,
    onUpdateFilterData,
    onFilterList,
    showFilter,
    isFilterChanged,
    onToggleShowFilter,
    onResetFilterData,
  } = appState();

  const filterPanel = showFilter && (
    <FilterContainer>
      <Row>
        <Col span={24}>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="关键字">
              <Input
                value={filterData.employeeName}
                placeholder="关键字"
                onChange={(e) => { onUpdateFilterData('employeeName', e.target.value); }}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="性别">
              <Radio.Group
                value={filterData.sex}
                onChange={(e) => { onUpdateFilterData('sex', e.target.value); }}
              >
                <Radio value={0}>全部</Radio>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="婚姻状况">
              <Radio.Group
                value={filterData.maritalStatus}
                onChange={(e) => { onUpdateFilterData('maritalStatus', e.target.value); }}
              >
                <Radio value={0}>全部</Radio>
                <Radio value={1}>已婚</Radio>
                <Radio value={2}>未婚</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="出生日期">
              <RangePicker
                value={toMoments(filterData.birthdayRange)}
                onChange={(m, ranges) => { onUpdateFilterData('birthdayRange', ranges); }}
              />
            </Form.Item>
            <Form.Item label="入职日期">
              <RangePicker
                value={toMoments(filterData.hireDateRange)}
                onChange={(m, ranges) => { onUpdateFilterData('hireDateRange', ranges); }}
              />
            </Form.Item>
            <WrapperSelect id="nationId" type={ITEM_NATION} formLabel="民族" />
            <WrapperSelect id="partyId" type={ITEM_PARTY} formLabel="政治面貌" />
            <WrapperSelect id="workTypeId" type={ITEM_WORK_TYPE} formLabel="工时制" />
          </Form>
        </Col>
        <Col span={12}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="公司">
              <Select
                showSearch
                placeholder="请选择..."
                value={[filterData.companyId]}
                onChange={(value) => { onUpdateFilterData('companyId', value); }}
              >
                <Option value={0}>全部</Option>
                {companyList.map((c) => (
                  <Option key={c.id} value={c.id}>{c.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="部门">
              <Select
                placeholder="请选择..."
                value={[filterData.deptId]}
                onChange={(value) => { onUpdateFilterData('deptId', value); }}
              >
                <Option value={0}>全部</Option>
                {deptList.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {filterData.companyId ? c.name : `${c.name} - ${c.companyName}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <WrapperSelect id="dutyId" type={ITEM_DUTY} formLabel="职务" />
            <WrapperSelect id="educationId" type={ITEM_EDUCATION} formLabel="学历" />
            <WrapperSelect id="graduateId" type={ITEM_GRADUATE} formLabel="毕业院校" />
            <WrapperSelect id="majorId" type={ITEM_MAJOR} formLabel="专业" />
            <WrapperSelect id="employmentFormId" type={ITEM_EMPLOYMENT_FORM} formLabel="用工方式" />
          </Form>
        </Col>
      </Row>
      <ButtonContainer>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={onFilterList}
            >
              查询
            </Button>
            &nbsp;&nbsp;
            <Button onClick={onResetFilterData}>重置</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={onToggleShowFilter}>
              关闭
            </Button>
          </Col>
        </Row>
      </ButtonContainer>
    </FilterContainer>
  );

  return (
    <Popover
      title="更多过滤条件"
      content={filterPanel}
      placement="bottom"
      visible={showFilter}
    >
      <Button
        icon={<FilterOutlined />}
        onClick={onToggleShowFilter}
        type={isFilterChanged ? 'primary' : 'dashed'}
      >
        更多
      </Button>
    </Popover>
  );
}
