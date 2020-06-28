import { observable, action } from 'mobx';

import { hasProps } from 'helpers';
import {
  getDate,
  queryGet,
  queryList,
} from 'helpers/dbUtils';

const DEF_COMPANY = {
  id: '',
  name: '',
  remark: '',
};

export default class CompanyStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable tmpData = null;

  @observable dataState = {
    loading: true,
    list: [],
  };

  @observable pagination = {
    current: 1,
    pageSize: 8,
    total: 0,
  };

  @observable filters = {
    keyword: '',
  };

  @observable sorter = {
    field: 'name',
    order: 'ascend',
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
  onAddItem = () => {
    this.tmpData = { ...DEF_COMPANY };
  };

  @action
  getList = async () => {
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
        company
      ORDER BY
        $field ${order === 'ascend' ? 'ASC' : 'DESC'}
      LIMIT $limit OFFSET $offset
    `;

    const list = await queryList(listSql, { $field: field, $limit: pageSize, $offset: offset });
    const totalData = await queryGet('SELECT COUNT(id) as total FROM company');

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
    const { id, name, remark } = this.tmpData;
    const tm = getDate();

    if (id) {
      await queryGet(`
        UPDATE
          company
        SET
          name=$name,
          remark=$remark,
          updateDate=$tm
        WHERE id=$id
      `, {
        $name: name,
        $remark: remark,
        $tm: tm,
        $id: id,
      });
    } else {
      await queryGet(`
        INSERT INTO company (name, remark, createDate)
        VALUES ($name,$remark,$tm)
      `, {
        $name: name,
        $remark: remark,
        $tm: tm,
      });
    }

    await this.getList();

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
  onEditItem = async (id) => {
    this.tmpData = await queryGet('SELECT * from company WHERE id = $id', { $id: id });
  };

  @action
  onDeleteItem = async (id) => {
    await queryGet('DELETE from company WHERE id = $id', { $id: id });

    this.getList();
  };
}
