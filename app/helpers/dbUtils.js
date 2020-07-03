import fs from 'fs';
import moment from 'moment';

import { getConfig, getDefaultDbPath } from './configUtils';

const { app } = require('electron').remote;
const sqlite3 = require('sqlite3').verbose();

export function getDb() {
  const dbPath = getConfig('dbPath', getDefaultDbPath());

  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
}

export function createDb(dbPath) {
  if (!dbPath) {
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      fs.accessSync(dbPath, fs.constants.F_OK | fs.constants.W_OK);
    } catch (e) {
      fs.openSync(dbPath, 'w');
    }

    // open database to create tables
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

    fs.readFile(`${app.getAppPath()}/init.sql`, 'utf8', (ferr, sql) => {
      if (ferr) {
        reject(ferr);
      } else {
        db.exec(sql, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });

        db.close();
      }
    });
  });
}

export function getDate() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function queryList(sql, params = {}) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    const list = [];

    db.each(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        list.push(row);
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
}

export function queryGet(sql, params = {}) {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.get(sql, params, (e, row) => {
      if (e) {
        reject(e);
      } else {
        resolve(row);
      }
    });

    db.close();
  });
}

export function exec(sql, params = {}) {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.run(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });

    db.close();
  });
}

export function getCompanyList() {
  return queryList('SELECT id,name FROM company ORDER BY name ASC');
}

export function getDeptsByCompany(companyId) {
  if (companyId > 0) {
    return queryList(`
      SELECT
        d.id,
        d.name,
        c.name as companyName
      FROM department d
        LEFT JOIN company c
          ON d.deptCompanyId = c.id
      WHERE d.deptCompanyId=?
      ORDER BY d.name ASC
    `, companyId);
  }

  return queryList(`
    SELECT
      d.id,
      d.name,
      c.name as companyName
    FROM department d
      LEFT JOIN company c
        ON d.deptCompanyId = c.id
    ORDER BY d.name ASC
  `);
}
