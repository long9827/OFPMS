-- �������ݿ�
CREATE DATABASE ofpms2 CHARACTER SET utf8 COLLATE utf8_general_ci;

USE ofpms2;

-- ����user��
create table user
(
user_id BIGINT(20) PRIMARY KEY auto_increment COMMENT '�û�id',
username VARCHAR(50) COMMENT '�û���',
password VARCHAR(100) COMMENT '����MD5',
identity TINYINT(4) COMMENT '�û���ݣ�1-ũ������2-������Ա��3-�г���Ա��4-�ÿ�'
);

-- �����û�
INSERT INTO user(username, password, identity)
VALUES ('admin', MD5(20181225), 1), 
('tech', MD5(20181225), 2), 
('tech2', MD5(20181225), 2),
('market', MD5(20181225), 3),
('guest', MD5(''), 4)