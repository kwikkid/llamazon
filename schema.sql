/* Schema for SQL database/table */
DROP DATABASE IF EXISTS llamazon;

/* Create database */
CREATE DATABASE llamazon;
USE llamazon;

/* Create a new table with a primary key that auto-increments */
CREATE TABLE products (
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INT,
stock_quantity INT default 10,
PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price) values ("Alpaca Sweater", "Apparel", 50);
INSERT INTO products (product_name, department_name, price) values ("Alpaca Bag", "Accessories", 30);
INSERT INTO products (product_name, department_name, price) values ("Llama Barn", "Supplies", 1000);
INSERT INTO products (product_name, department_name, price) values ("Llama Socks", "Apparel", 20);
INSERT INTO products (product_name, department_name, price) values ("Alpaca Pinata", "Accessories", 50);
INSERT INTO products (product_name, department_name, price) values ("Hay", "Supplies", 10);
INSERT INTO products (product_name, department_name, price) values ("Feeder", "Supplies", 20);
INSERT INTO products (product_name, department_name, price) values ("Brush", "Apparel", 5);
INSERT INTO products (product_name, department_name, price) values ("Lead Ropes", "Supplies", 50);
INSERT INTO products (product_name, department_name, price) values ("Shampoo", "Supplies", 30);

SELECT * FROM products;