import { observable, action } from 'mobx';

import { hasProps } from 'helpers';
import {
  getDate,
  exec,
  queryGet,
  queryList,
} from 'helpers/dbUtils';

const DEF_COMPANY = {
  id: '',
  name: '',
  remark: '',
  deptCompanyId: 0,
};
const DEF_PAGINATION = {
  current: 1,
  pageSize: 8,
  total: 0,
};

export default class DeptStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable tmpData = null;

  @observable company = null;

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
    field: 'createDate',
    order: 'descend',
  };

  @action
  onUpdateTmpData = (key = '', value) => {
    if (hasProps(this.tmpData, key)) {
      this.tmpData = { ...this.tmpData, [key]: value };
    }
  };

  @action
  onResetTmpData = () => {
    this.tmpData = null;
  };

  @action
  getCompany = async (companyId) => {
    this.dataState = {
      list: [],
      loading: false,
    };
    this.company = await queryGet('SELECT * from company WHERE id = $id', { $id: companyId });
    this.getList();
  };

  @action
  getList = async () => {
    if (!this.company) {
      return;
    }

    this.dataState = {
      ...this.dataState,
      loading: true,
    };

    const { field, order } = this.sorter;
    const { current, pageSize } = this.pagination;
    const offset = pageSize * (current - 1);
    const listSql = `
      SELECT
        *
      FROM
        department
      WHERE
        deptCompanyId=$companyId
      ORDER BY
        $sorter
      LIMIT $limit OFFSET $offset
    `;

    const list = await queryList(listSql, {
      $companyId: this.company.id,
      $limit: pageSize,
      $offset: offset,
      $sorter: `${field} ${order === 'ascend' ? 'ASC' : 'DESC'}`,
    });
    const totalData = await queryGet('SELECT COUNT(id) as total FROM department WHERE deptCompanyId = $companyId', {
      $companyId: this.company.id,
    });

    setTimeout(async () => {
      this.dataState = {
        loading: false,
        list: list.map((item) => ({
          key: item.id,
          ...item,
        })),
      };
      this.pagination = {
        ...this.pagination,
        total: totalData.total,
      };
    }, 600);
  };

  @action
  onSaveData = async () => {
    if (!this.company) {
      return;
    }

    const {
      id,
      name,
      remark,
    } = this.tmpData;
    const tm = getDate();
    const companyId = this.company.id;

    if (id) {
      await queryGet(`
        UPDATE department
        SET name=$name,
            remark=$remark,
            deptCompanyId=$companyId,
            updateDate=$tm
        WHERE id=$id
      `, {
        $name: name,
        $remark: remark,
        $companyId: companyId,
        $tm: tm,
        $id: id,
      });
    } else {
      await queryGet(`
        INSERT INTO department (name, remark, deptCompanyId, createDate)
        VALUES ($name,$remark,$companyId,$tm)
      `, {
        $name: name,
        $remark: remark,
        $companyId: companyId,
        $tm: tm,
      });
    }

    this.getList();

    this.tmpData = null;
  };

  @action
  onChangeData = (pagination, filters, sorter) => {
    this.pagination = pagination;
    this.filters = filters;
    this.sorter = sorter;

    this.getList();
  };

  @action
  onAddItem = async () => {
    this.tmpData = { ...DEF_COMPANY, companyId: this.companyId };
  };

  @action
  onEditItem = async (id) => {
    this.tmpData = await queryGet('SELECT * from department WHERE id = $id', { $id: id });
  };

  @action
  onDeleteItem = async (id) => {
    await exec('DELETE from department WHERE id = $id', { $id: id });
    this.getList();
  };

  @action
  onChangeCompany = (cid) => {
    this.pagination = {
      ...DEF_PAGINATION,
    };

    this.companyId = cid;
    this.getList();
  };
}
