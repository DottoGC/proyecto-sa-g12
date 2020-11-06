-- to create a new database
CREATE DATABASE usuarios_bd;

-- to use database
use usuarios_bd;

-- creating a new table
drop table usuario;
CREATE TABLE usuario (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  password VARCHAR(200) NOT NULL,
  administrador VARCHAR(50) NOT NULL
);

-- to show all tables
show tables;

-- to describe table
describe customer;




CREATE TABLE prueba (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(50) NOT NULL,  
  funciona BOOLEAN
  
);