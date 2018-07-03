# Bamazon

## Overview
Bamazon is CLI app use in conjunction with MySQL that runs as a simple storefront. The app displays products from the database, take in orders from customers and deplete stock from the store's inventory.

### Customer View
* The product are populated from the database table with contains:

    * item_id (unique id for each product)
    * product_name (Name of product)
    * department_name
    * price (cost to customer)  
    * stock_quantity (how much of the product is available in stores)

* Running the app will ask the customer if they wish to make a purchase.
* If the customer wished to make a purchase a table of products will be displayed and the customer will be prompted to select the name of the item they wish to purchase, followed by the quantity, then purchase confirmation.

* After placing the order the application will check if enough stock is available.
    * If there is enough stock available, the application will update database with new stock then confirm purchase and display price.
    * If there is NOT enough stock available the application will prevent purchase and display an error.

* After placing an order (successfully or unsuccessfully) the user will be asked if they would like to make another purchase.
    * If the user does not wish to make another purchase the application will quit.