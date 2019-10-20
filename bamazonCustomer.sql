DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INTEGER(10.2) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Avocado Peeler", "Kitchen", 3.00, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tubshroom", "Home", 12.00, 450);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Banana Slicer", "Kitchen", 2.49, 800);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rubber Horse Mask", "Novelty", 15.00, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microwave for One", "Books", 12.00, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Whoopi Cushion", "Novelty", 8.00, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Retro Bowling Shoes (blue)", "Shoes", 44.00, 120);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Garlic Press", "Kitchen", 5.59, 347);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Orelay Winter Jacket (hot pink)", "Outerwear", 109.99, 52);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Denim Jacket", "Outerwear", 64.00, 88);

DROP TABLE IF EXISTS shopping_cart;
 
CREATE TABLE shopping_cart (
  id INTEGER(5) NOT NULL,
  quantity_wanted INTEGER(10) NOT NULL
)