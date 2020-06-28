import { observable, action } from 'mobx';

import { hasProps } from 'helpers';
import {
  getDb,
  getDate,
} from 'helpers/dbUtils';
import { SIDEBAR } from 'constants';

const DEF_DATA = {
  id: '',
  name: '',
  remark: '',
  type: -1,
};
const DEF_PAGINATION = {
  current: 1,
  pageSize: 8,
  total: 0,
};

export default class SettingStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable sidebar = SIDEBAR;

  @observable tmpData = null;

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
  onClickMenu = ({ key }) => {
    this.sidebar = {
      ...this.sidebar,
      activeItemId: key,
    };
    this.pagination = {
      ...DEF_PAGINATION,
    };
    this.getList();
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
  onAddItem = async () => {
    this.tmpData = { ...DEF_DATA };
  };

  queryTotal = () => {
    return new Promise((resolve, reject) => {
      const db = getDb();

      db.get('SELECT COUNT(id) as total FROM baseData WHERE type = ?', [this.sidebar.activeItemId], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.total);
        }
      });

      db.close();
    });
  };

  queryList = async () => {
    const { field, order } = this.sorter;
    const { current, pageSize } = this.pagination;

    return new Promise((resolve, reject) => {
      const db = getDb();
      const list = [];

      const sql = `
        SELECT
          *
        FROM
          baseData
        WHERE
          type=?
        ORDER BY
          ? ${order === 'ascend' ? 'ASC' : 'DESC'}
        LIMIT ? OFFSET ?
      `;
      const offset = pageSize * (current - 1);

      db.each(sql, [this.sidebar.activeItemId, field, pageSize, offset], (err, row) => {
        if (err) {
          reject(err);
        } else {
          list.push({
            key: row.id,
            ...row,
          });
        }
      }, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve(list);
        }
      });

      db.close();
    });
  };

  @action
  getList = async () => {
    this.dataState = {
      ...this.dataState,
      loading: true,
    };

    setTimeout(async () => {
      const list = await this.queryList();
      const total = await this.queryTotal();

      this.dataState = {
        loading: false,
        list,
      };
      this.pagination = {
        ...this.pagination,
        total,
      };
    }, 600);
  };

  @action
  onSaveData = () => {
    const db = getDb();

    db.serialize(() => {
      const { id, name, remark } = this.tmpData;
      const type = this.sidebar.activeItemId;
      const tm = getDate();

      if (id) {
        db.run("UPDATE baseData SET name=?, remark=?, type=?, updateDate=? WHERE id=?", name, remark, type, tm, id);
      } else {
        db.run("INSERT INTO baseData (name, remark, type, createDate) VALUES (?,?,?,?)", name, remark, type, tm);
      }
      this.getList();
    });

    db.close();
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
    const db = getDb();

    db.get('SELECT * from baseData WHERE id = ?', [id], (err, res) => {
      this.tmpData = res;
    });

    db.close();
  };

  @action
  onDeleteItem = (id) => {
    const db = getDb();

    db.get('DELETE from baseData WHERE id = ?', [id], () => {
      this.getList();
    });

    db.close();
  };
}
