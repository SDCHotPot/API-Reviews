CREATE DATABASE test;

\c test;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'rtest'
--
-- ---

DROP TABLE IF EXISTS rtest;

CREATE TABLE rtest (
  id SERIAL PRIMARY KEY,
  name VARCHAR ,
  summary VARCHAR
);

-- ---
-- Table 'ptest'
--
-- ---

DROP TABLE IF EXISTS ptest;

CREATE TABLE ptest (
  id SERIAL PRIMARY KEY,
  url VARCHAR ,
  r_id INTEGER

);

-- ---
-- Table 'ctest'
--
-- ---

DROP TABLE IF EXISTS ctest;

CREATE TABLE ctest (
  id SERIAL PRIMARY KEY,
  name VARCHAR NULL DEFAULT NULL
);

-- ---
-- Table 'crtest'
--
-- ---

DROP TABLE IF EXISTS crtest;

CREATE TABLE crtest (
  id SERIAL PRIMARY KEY,
  c_id INTEGER ,
  r_id INTEGER
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE ptest ADD FOREIGN KEY (r_id) REFERENCES rtest (id);
ALTER TABLE crtest ADD FOREIGN KEY (c_id) REFERENCES ctest (id);
ALTER TABLE crtest ADD FOREIGN KEY (r_id) REFERENCES rtest (id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `rtest` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `ptest` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `ctest` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `crtest` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `rtest` (`id`,`name`,`summary`) VALUES
-- ('','','');
-- INSERT INTO `ptest` (`id`,`url`,`r_id`) VALUES
-- ('','','');
-- INSERT INTO `ctest` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `crtest` (`id`,`c_id`,`r_id`) VALUES
-- ('','','');