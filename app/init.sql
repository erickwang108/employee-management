PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for baseData
-- ----------------------------
DROP TABLE IF EXISTS "baseData";
CREATE TABLE "baseData" (
  "id" integer PRIMARY KEY AUTOINCREMENT,
  "name" varchar NOT NULL,
  "type" text,
  "createDate" text,
  "updateDate" text
, "remark" varchar);

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS "company";
CREATE TABLE "company" (
  "id" integer PRIMARY KEY AUTOINCREMENT,
  "name" varchar NOT NULL,
  "createDate" text,
  "updateDate" text
, "remark" varchar);

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS "department";
CREATE TABLE "department" (
  "id" integer,
  "name" varchar,
  "deptCompanyId" int,
  "createDate" text,
  "updateDate" text, "remark" varchar,
  PRIMARY KEY ("id"),
  CONSTRAINT "companyId" FOREIGN KEY ("deptCompanyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- ----------------------------
-- Table structure for employee
-- ----------------------------
DROP TABLE IF EXISTS "employee";
CREATE TABLE "employee" (
  "employeeId" integer PRIMARY KEY AUTOINCREMENT,
  "employeeName" varchar NOT NULL,
  "sex" int,
  "maritalStatus" int,
  "age" int,
  "hireDate" text,
  "birthday" text,
  "companyId" bigint,
  "partyId" bigint,
  "deptId" bigint,
  "dutyId" bigint,
  "educationId" bigint,
  "employmentFormId" bigint,
  "graduateId" bigint,
  "workTypeId" bigint DEFAULT '',
  "majorId" bigint,
  "nationId" bigint,
  "createDate" text,
  "updateDate" text,
  "contact" varchar,
  "remark" varchar,
  CONSTRAINT "companyId" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "deptId" FOREIGN KEY ("deptId") REFERENCES "department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "workTypeId" FOREIGN KEY ("workTypeId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "educationId" FOREIGN KEY ("educationId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "graduateId" FOREIGN KEY ("graduateId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "majorId" FOREIGN KEY ("majorId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "employTypeId" FOREIGN KEY ("employmentFormId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "nationId" FOREIGN KEY ("nationId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "partyId" FOREIGN KEY ("partyId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "dutyId" FOREIGN KEY ("dutyId") REFERENCES "baseData" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);


PRAGMA foreign_keys = true;
