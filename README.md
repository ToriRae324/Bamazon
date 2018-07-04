# Bamazon

## Overview
Bamazon is a CLI app used in conjunction with MySQL that runs as a simple storefront. The app displays products from the database, takes in orders from customers and depletes stock from the store's inventory.

### Customer View

*  The products are populated from the database table that contains:
    * item_id (unique id for each product)
    * product_name (Name of product)
    * department_name
    * price (cost to customer)  
    * stock_quantity (how much of the product is available in stores)


1.  Running the app will inquire if the customer wishes to make a purchase.


2.  If the customer wishes to make a purchase a table of products will be displayed. The customer will then be prompted to select the name of the item they wish to purchase, followed by the quantity, then purchase confirmation.


3.  After placing the order, the application will check if enough stock is available.
    * If there is enough stock available, the application will update the database with depleted stock then confirm purchase and display price.
    * If there is NOT enough stock available the application will prevent the purchase and display an error.


4.  After placing an order, (successfully or unsuccessfully) the user will again be asked if they would like to make a purchase.
    * If the user does not wish to make another purchase the application will quit.


#### To run Customer View, from the command line type `node bamazonCustomer.js`

##### Walkthrough Video: ![Alt][1]
[1]: /Bamazon-Walkthrough.gif "Walkthrough Video"


### Manager View
* Manager View allows a user to perform manager level functions using the same products in the database that the Customer View uses.

* Managers have 4 functions they can perform within the app
    * View Products for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product


* If a manager selects View Products for Sale, the details for all products in the database are displayed including: the item IDs, names, departments, prices, and quantities.
* If a manager selects View Low Inventory, all products with an inventory quantity lower than five are displayed.
* If a manager selects Add to Inventory, they will be prompted to select which product to update and how much inventory to add. After confirming the update, the inventory will be updated in the database.
* If a manager selects Add New Product, they will be prompted to enter the following details to add a new product to the database: name, department, price, and quantity. After confirming the new product, it will be added to the database.

#### To run Manager View, from the command line type `node bamazonManager.js`