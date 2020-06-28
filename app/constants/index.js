export const AGE_OPTIONS = {
  defaultValue: "1",
  list: [{
    value: "1",
    text: '男',
  }, {
    value: "2",
    text: '女',
  }],
};

export const DATE_FORMAT = 'YYYY-MM-DD';

export const ITEM_DUTY = 'm1';
export const ITEM_WORK_TYPE = 'm2';
export const ITEM_EDUCATION = 'm3';
export const ITEM_GRADUATE = 'm4';
export const ITEM_MAJOR = 'm5';
export const ITEM_NATION = 'm6';
export const ITEM_PARTY = 'm7';
export const ITEM_EMPLOYMENT_FORM = 'm8';

export const ITEM_KEYS = [
  ITEM_DUTY,
  ITEM_WORK_TYPE,
  ITEM_EDUCATION,
  ITEM_GRADUATE,
  ITEM_MAJOR,
  ITEM_NATION,
  ITEM_PARTY,
  ITEM_EMPLOYMENT_FORM,
];

export const SIDEBAR = {
  activeItemId: ITEM_DUTY,
  list: [{
    id: ITEM_NATION,
    name: '民族',
  }, {
    id: ITEM_DUTY,
    name: '职务',
  }, {
    id: ITEM_EDUCATION,
    name: '学历',
  }, {
    id: ITEM_GRADUATE,
    name: '毕业院校',
  }, {
    id: ITEM_MAJOR,
    name: '专业',
  }, {
    id: ITEM_PARTY,
    name: '政治面貌',
  }, {
    id: ITEM_WORK_TYPE,
    name: '工时制',
  }, {
    id: ITEM_EMPLOYMENT_FORM,
    name: '用工形式',
  }],
};
