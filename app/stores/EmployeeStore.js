import fs from 'fs';
import XLSX from 'xlsx';
import moment from 'moment';
import {
  observable,
  reaction,
  action,
  toJS,
} from 'mobx';
import isEqual from 'lodash/isEqual';

import { hasProps, calAge } from 'helpers';
import { DATE_FORMAT, AGE_OPTIONS } from 'constants';
import {
  exec,
  getDate,
  queryGet,
  queryList,
  getCompanyList,
  getDeptsByCompany,
} from 'helpers/dbUtils';

const DEF_DATA = {
  id: '',
  employeeName: '', // 姓名
  contact: '', // 联系方式
  remark: '', // 备注
  sex: 0, // 性别: 0 - 全部, 1 - 男, 2 - 女
  maritalStatus: 0, // 婚姻状况 0 - 全部, 1 - 已婚, 2 - 未婚

  hireDate: moment().subtract(10, 'years').format(DATE_FORMAT), // 入职日期
  birthday: moment().subtract(18, 'years').format(DATE_FORMAT), // 出生日期
  age: 0, // 年龄
  deptId: 0, // 部门
  companyId: 0, // 企业
  dutyId: 0, // 职务
  partyId: 0, // 政治面貌

  educationId: 0, // 学历
  graduateId: 0, // 毕业院校
  majorId: 0, // 专业

  workTypeId: 0, // 工时制
  employmentFormId: 0, // 用工方式
  nationId: 0, // 民族
};

const DEF_FILTER_DATA = {
  ...DEF_DATA,
  birthdayRange: ['1950-01-01', moment().format(DATE_FORMAT)], // 出生日期
  hireDateRange: ['2009-01-01', moment().format(DATE_FORMAT)], // 入职日期
};

const DEF_PAGINATION = {
  current: 1,
  pageSize: 8,
  total: 0,
};

export default class EmployeeStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.filterData,
      (data) => {
        this.isFilterChanged = !isEqual(toJS(data), DEF_FILTER_DATA);
      },
    );
  }

  @observable tmpData = null;

  @observable filterData = { ...DEF_FILTER_DATA };

  @observable isFilterChanged = false;

  @observable selectedIdList = [];

  @observable showFilter = false;

  @observable companyList = [];

  @observable deptList = [];

  @observable baseDataMap = {};

  @observable notifiContent = null;

  @observable dataState = {
    loading: true,
    list: [],
  };

  @observable pagination = {
    ...DEF_PAGINATION,
  };

  @observable filters = {
    keyword: '',
  };

  @observable sorter = {
    field: 'employeeUpdateDate',
    order: 'descent',
  };

  @observable selectOptions = {
    sex: AGE_OPTIONS,
  };

  @action
  onSelectTableRows = (rows) => {
    this.selectedIdList = rows.map(({ employeeId }) => employeeId);
  };

  @action
  onUpdateTmpData = async (key = '', value) => {
    if (hasProps(this.tmpData, key)) {
      this.tmpData = { ...this.tmpData, [key]: value };
    }
  };

  @action
  onUpdateFilterData = async (key = '', value) => {
    if (hasProps(this.filterData, key)) {
      this.filterData = { ...this.filterData, [key]: value };

      if (key === 'companyId') {
        this.deptList = await getDeptsByCompany(value);
        this.onUpdateFilterData('deptId', 0);
      }
    }
  };

  @action
  onToggleShowFilter = async () => {
    if (!this.showFilter) {
      await this.getBaseDataList();
      this.companyList = await getCompanyList();
    }

    this.showFilter = !this.showFilter;
  };

  @action
  onResetFilterData = async () => {
    this.filterData = { ...DEF_FILTER_DATA };
    this.getBaseDataList();
    this.deptList = await getDeptsByCompany();
    this.companyList = await getCompanyList();
  };

  @action
  onResetTmpData = () => {
    this.tmpData = null;
  };

  @action
  onClearNotifi = () => {
    this.notifiContent = null;
  };

  @action
  getBaseDataList = async () => {
    const baseDataList = await queryList('SELECT id,name,type from baseData ORDER BY name ASC');

    this.baseDataMap = baseDataList.reduce((obj, { id, type, name }) => {
      obj[type] = obj[type] || [];
      obj[type].push({ id, type, name });

      return obj;
    }, {});
  };

  @action
  onAddItem = async () => {
    await this.getBaseDataList();
    this.companyList = await getCompanyList();
    this.tmpData = { ...DEF_DATA, sex: 1, maritalStatus: 1 };
  };

  @action
  onSaveFile = async (fileName) => {
    if (!fileName) {
      return;
    }

    const listQuery = this.getFilterQuery(true, false);
    const list = await queryList(listQuery.sql, listQuery.params);

    // headers
    const xlsDataList = [[
      '员工姓名',
      '民族',
      '性别',
      '年龄',
      '婚姻状况',
      '政治面貌',
      '工时制',
      '用工方式',
      '所属公司',
      '部门',
      '职务',
      '最高学历',
      '毕业院校',
      '专业名称',
      '出生年月',
      '入职日期',
      '创建时间',
      '更新时间',
      '联系方式',
      '备注',
    ]];

    list.forEach((data) => {
      xlsDataList.push([
        data.employeeName,
        data.nationName,
        data.sex === 1 ? '男' : '女',
        data.age,
        data.maritalStatus === 1 ? '已婚' : '未婚',
        data.partyName,
        data.workTypeName,
        data.employmentFormName,
        data.companyName,
        data.deptName,
        data.dutyName,
        data.educationName,
        data.graduateName,
        data.majorName,
        data.birthday,
        data.hireDate,
        data.employeeCreateDate,
        data.employeeUpdateDate,
        data.contact,
        data.employeeRemark,
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(xlsDataList);
    XLSX.utils.book_append_sheet(wb, ws);

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    fs.writeFile(fileName, buffer, (err) => {
      if (err) {
        alert('保存文件失败!');
      }
    });
  };

  onFilterList = () => {
    this.pagination = {
      ...DEF_PAGINATION,
    };
    this.showFilter = false;
    this.getList();
  };

  @action
  onSaveData = async () => {
    const {
      employeeId,
      employeeName,
      contact,
      remark,
      sex,
      maritalStatus,
      hireDate,
      birthday,
      deptId,
      dutyId,
      companyId,
      partyId,
      educationId,
      graduateId,
      majorId,
      workTypeId,
      employmentFormId,
      nationId,
    } = this.tmpData;

    try {
      const age = calAge(birthday);
      const tm = getDate();

      if (employeeId) {
        await exec(
          `UPDATE
            employee
          SET
            employeeName=$employeeName,
            contact=$contact,
            remark=$remark,
            sex=$sex,
            maritalStatus=$maritalStatus,
            hireDate=$hireDate,
            birthday=$birthday,
            age=$age,
            deptId=$deptId,
            companyId=$companyId,
            dutyId=$dutyId,
            partyId=$partyId,
            educationId=$educationId,
            graduateId=$graduateId,
            majorId=$majorId,
            workTypeId=$workTypeId,
            employmentFormId=$employmentFormId,
            nationId=$nationId,
            updateDate=$updateDate
          WHERE employeeId=$employeeId
        `,
          {
            $employeeName: employeeName,
            $contact: contact,
            $remark: remark,
            $sex: sex,
            $maritalStatus: maritalStatus,
            $hireDate: hireDate,
            $birthday: birthday,
            $age: age,
            $deptId: deptId,
            $companyId: companyId,
            $dutyId: dutyId,
            $partyId: partyId,
            $educationId: educationId,
            $graduateId: graduateId,
            $majorId: majorId,
            $workTypeId: workTypeId,
            $employmentFormId: employmentFormId,
            $nationId: nationId,
            $updateDate: tm,
            $employeeId: employeeId,
          },
        );
      } else {
        await exec(
          `INSERT INTO
            employee (
              employeeName,
              contact,
              remark,
              sex,
              maritalStatus,
              hireDate,
              birthday,
              age,
              deptId,
              companyId,
              dutyId,
              partyId,
              educationId,
              graduateId,
              majorId,
              workTypeId,
              employmentFormId,
              nationId,
              createDate,
              updateDate
            )
          VALUES (
            $employeeName,
            $contact,
            $remark,
            $sex,
            $maritalStatus,
            $hireDate,
            $birthday,
            $age,
            $deptId,
            $companyId,
            $dutyId,
            $partyId,
            $educationId,
            $graduateId,
            $majorId,
            $workTypeId,
            $employmentFormId,
            $nationId,
            $createDate,
            $updateDate
          )
        `,
          {
            $employeeName: employeeName,
            $contact: contact,
            $remark: remark,
            $sex: sex,
            $maritalStatus: maritalStatus,
            $hireDate: hireDate,
            $birthday: birthday,
            $age: age,
            $deptId: deptId,
            $companyId: companyId,
            $dutyId: dutyId,
            $partyId: partyId,
            $educationId: educationId,
            $graduateId: graduateId,
            $majorId: majorId,
            $workTypeId: workTypeId,
            $employmentFormId: employmentFormId,
            $nationId: nationId,
            $createDate: tm,
            $updateDate: tm,
          },
        );
      }
    } catch (err) {
      console.log(err);
      this.notifiContent = employeeId ? '更新失败' : '创建失败';
    }

    this.getList();
    this.tmpData = null;
  };

  @action
  onChangeData = (pagination, filters) => {
    this.pagination = pagination;
    this.filters = filters;

    this.getList();
  };

  @action
  onSorter = (field) => {
    if (field === this.sorter.field) {
      this.sorter = {
        ...this.sorter,
        order: this.sorter.order === 'ascend' ? 'descent' : 'ascend',
      };
    } else {
      this.sorter = {
        field,
        order: 'ascend',
      };
    }

    this.pagination = { ...DEF_PAGINATION };

    this.getList();
  };

  @action
  onChangeCompany = async (cid) => {
    this.onUpdateTmpData('companyId', cid);
    this.deptList = await getDeptsByCompany(cid);
    this.onUpdateTmpData('deptId', 0);
  };

  @action
  onEditItem = async (employeeId) => {
    await this.getBaseDataList();
    this.companyList = await getCompanyList();
    this.tmpData = await queryGet('SELECT * from employee WHERE employeeId = ?', employeeId);
    this.deptList = await getDeptsByCompany(this.tmpData.companyId);
  };

  @action
  onDeleteItem = async (employeeId) => {
    await queryGet('DELETE from employee WHERE employeeId = ?', employeeId);
    this.getList();
  };

  @action
  onDeleteItems = async () => {
    if (this.selectedIdList.length > 0) {
      await exec(`DELETE from employee WHERE employeeId in (${this.selectedIdList.join()})`);
      this.selectedIdList = [];
      this.getList();
    }
  };

  @action
  getList = async () => {
    this.dataState = {
      ...this.dataState,
      loading: true,
    };

    const listQuery = this.getFilterQuery();
    const totalQuery = this.getFilterQuery(false);

    setTimeout(async () => {
      try {
        const list = await queryList(listQuery.sql, listQuery.params);
        const totalData = await queryGet(totalQuery.sql, totalQuery.params);

        this.dataState = {
          loading: false,
          list: list.map((item) => ({
            key: item.employeeId,
            ...item,
          })),
        };
        this.pagination = {
          ...this.pagination,
          total: totalData.total,
        };
      } catch (err) {
        console.log(err);
        this.dataState = {
          loading: false,
          list: [],
        };
      }
    }, 200);
  };

  getFilterQuery = (isListQuery = true, usePagination = true) => {
    const {
      companyId,
      employeeName,
      hireDateRange,
      birthdayRange,
    } = this.filterData;

    const payload = Object.keys(this.filterData).reduce((obj, key) => {
      const value = this.filterData[key];

      // ignore keys
      if (['hireDate', 'birthday'].includes(key)) {
        return obj;
      }

      switch (key) {
        case 'employeeName': {
          if (employeeName) {
            obj.fields.push(`employeeName LIKE $employeeName`);
            obj.params.$employeeName = `%${employeeName}%`;
          }
          break;
        }
        case 'hireDateRange': {
          if (hireDateRange.length === 2) {
            obj.fields.push('hireDate BETWEEN $hireDateFrom AND $hireDateTo');

            const [fromDate, toDate] = hireDateRange;
            obj.params.$hireDateFrom = fromDate;
            obj.params.$hireDateTo = toDate;
          }
          break;
        }
        case 'birthdayRange': {
          if (birthdayRange.length === 2) {
            obj.fields.push('birthday BETWEEN $birthdayFrom AND $birthdayTo');

            const [fromDate, toDate] = birthdayRange;
            obj.params.$birthdayFrom = fromDate;
            obj.params.$birthdayTo = toDate;
          }
          break;
        }
        case 'companyId': {
          if (companyId) {
            obj.fields.push('companyId=$companyId');
            obj.params.$companyId = companyId;
          }
          break;
        }
        default: { // eauals
          if (this.filterData[key]) {
            obj.fields.push(`${key}=$${key}`);
            obj.params[`$${key}`] = value;
          }
          break;
        }
      }
      return obj;
    }, {
      fields: [],
      params: {},
    });

    const { field, order } = this.sorter;
    const { current, pageSize } = this.pagination;
    const offset = pageSize * (current - 1);

    const params = {
      ...payload.params,
    };

    if (usePagination) {
      params.$limit = pageSize;
      params.$offset = offset;
    }

    if (isListQuery) {
      return ({
        sql: `
          SELECT
            *,
            e.remark as employeeRemark,
            e.createDate as employeeCreateDate,
            e.updateDate as employeeUpdateDate,
            c.name as companyName,
            d.name as deptName,
            b1.name as dutyName,
            b2.name as partyName,
            b3.name as educationName,
            b4.name as graduateName,
            b5.name as majorName,
            b6.name as workTypeName,
            b7.name as employmentFormName,
            b8.name as nationName
          FROM employee e
            LEFT JOIN company c ON e.companyId = c.id
            LEFT JOIN department d ON e.deptId = d.id
            LEFT JOIN baseData b1 ON e.dutyId = b1.id
            LEFT JOIN baseData b2 ON e.partyId = b2.id
            LEFT JOIN baseData b3 ON e.educationId = b3.id
            LEFT JOIN baseData b4 ON e.graduateId = b4.id
            LEFT JOIN baseData b5 ON e.majorId = b5.id
            LEFT JOIN baseData b6 ON e.workTypeId = b6.id
            LEFT JOIN baseData b7 ON e.employmentFormId = b7.id
            LEFT JOIN baseData b8 ON e.nationId = b8.id
          ${payload.fields.length > 0 ? `WHERE ${payload.fields.join(' AND ')}` : ''}
          ORDER BY ${field} ${order === 'ascend' ? 'ASC' : 'DESC'}
          ${usePagination ? `LIMIT $limit OFFSET $offset` : ''}
        `,
        params,
      });
    }

    return ({
      sql: `
        SELECT
          COUNT(*) as total
        FROM employee
        ${payload.fields.length > 0 ? `WHERE ${payload.fields.join(' AND ')}` : ''}
      `,
      params: payload.params,
    });
  };
}
