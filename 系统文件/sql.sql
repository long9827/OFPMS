-- 创建数据库
CREATE DATABASE ofpms2 CHARACTER SET utf8 COLLATE utf8_general_ci;

USE ofpms2;

-- 创建user表
create table user
(
user_id BIGINT(20) PRIMARY KEY auto_increment COMMENT '用户id',
username VARCHAR(50) COMMENT '用户名',
password VARCHAR(100) COMMENT '密码MD5',
identity TINYINT(4) COMMENT '用户身份，1-农场主，2-技术人员，3-市场人员，4-访客'
);

-- 创建用户
INSERT INTO user(username, password, identity)
VALUES ('admin', MD5(20181225), 1), 
('tech', MD5(20181225), 2), 
('tech2', MD5(20181225), 2),
('market', MD5(20181225), 3),
('guest', MD5(''), 4)