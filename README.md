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


To run this app, from the command line type `node bamazonCustomer.js`

Walkthrough Video: ![Alt][1]

[1]: /Bamazon-Walkthrough.gif "Walkthrough Video"