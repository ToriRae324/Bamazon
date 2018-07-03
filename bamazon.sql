-- Create a MySQL Database called bamazon.
-- Then create a Table inside of that database called products.
-- The products table should have each of the following columns:
	-- item_id (unique id for each product)
	-- product_name (Name of product)
	-- department_name
	-- price (cost to customer)
	-- stock_quantity (how much of the product is available in stores)

-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).--

CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

DROP TABLE products;

CREATE TABLE IF NOT EXISTS products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR (30) NOT NULL,
price DECIMAL (5, 2) NOT NULL,
stock_quantity INT(3),
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kitty Litter", "Pets", 10.10, 25) , 
("Bacon", "Food", 5.25, 50), 
("Asstd Pool Toys", "Outdoors", 3.33, 125),
("Doggie Boots", "Pets", 19.99, 10),
("Five Course Meal", "Food", 125.99, 10),
("Wall Art", "Home", 50.75 , 50),
("Pond Plants", "Outdoors", 7.15, 20),
("Scented Oils", "Home", 9.99 , 75),
("Cat Condo", "Pets", 250.50, 10),
("Dresser Set", "Home", 499.99, 5),
("Outdoor Lights", "Outdoors", 25.25, 15),
("Hunter", "Outdoors", 500.00, 1);

SELECT * FROM products;