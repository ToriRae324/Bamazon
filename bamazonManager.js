var inquirer = require("inquirer");

// Require cli-table
var Table = require('cli-table');
// table colors
var colors = require('colors');

// Require mysql
var mysql = require("mysql");

// Link Database
var connection = mysql.createConnection({
    host: "localhost",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    user: "root",
    password: "root",
    database: "bamazon"
});

// Run Connection
connection.connect(function (err) {
    if (err) throw err;
    console.log(("Connected to database as id " + connection.threadId + "\n\n").dim);
    console.log("Accessing Manager Protocols\n".bold.cyan)
    start();
});

function start() {
    inquirer
        .prompt([
            {
                name: "mgrOptions",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }

        ]).then(function (answ) {
            if (answ.mgrOptions === "View Products for Sale") {
                showProducts();
            }
            if (answ.mgrOptions === "View Low Inventory") {
                showLowInventory();
            }
            if (answ.mgrOptions === "Add to Inventory") {
                addInventory();
            }
            if (answ.mgrOptions === "Add New Product") {
                addNewProduct();
            }

        }).catch(function (err) {
            // log any errors that occurred in the .then() callback
            console.log(err);
        });
}

// show table of all products
function showProducts() {
    connection.query("SELECT * FROM products ORDER BY 3", function (err, res) {
        if (err) throw err;
        console.log("\nAll Products:\n")
        var table = new Table({
            head: ['ID'.cyan, 'Product Name'.cyan, 'Department'.cyan, 'Price'.cyan, 'Stock'.cyan]
            , colWidths: [5, 25, 15, 10, 7]
        });
        res.forEach(row => {
            table.push(
                [row.item_id, row.product_name, row.department_name, "$" + row.price, row.stock_quantity],
            );
        });
        console.log(table.toString());
        console.log("\n~~~~~~~~~~~~~~~~~\n\n");
        start();
    });
}

// show items with <5 stock
function showLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY 5", function (err, res) {
        if (err) throw err;
        console.log("\nShowing Low Inventory:\n")
        var table = new Table({
            head: ['ID'.cyan, 'Product Name'.cyan, 'Department'.cyan, 'Price'.cyan, 'Stock'.magenta]
            , colWidths: [5, 25, 15, 10, 7]
        });
        res.forEach(row => {
            table.push(
                [row.item_id, row.product_name, row.department_name, "$" + row.price, row.stock_quantity],
            );
        });
        console.log(table.toString());
        console.log("\n~~~~~~~~~~~~~~~~~\n\n");
        start();
    });
}

// add more stock to item
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nAdding Inventory\n".bold.cyan)
        inquirer.prompt([
            {
                name: "addInventory",
                type: "list",
                choices: function () {
                    var choiceArr = [];
                    res.forEach(row => {
                        var product = { name: row.product_name, value: row.item_id }
                        choiceArr.push(product);
                    });
                    return choiceArr;
                },
                message: "Select the item to add stock to:"
            },
            {
                name: "quantity",
                type: "text",
                message: "Enter the stock quantity you would like to add:",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "update",
                type: "confirm",
                message: "Update this stock?",
                default: true
            }
        ]).then(function (answ) {
            // if confirm order is false rerun purchaseItem
            if (answ.order === false) {
                start();
            } else {
                // Identify chosen item
                var chosenItem;
                res.forEach(row => {
                    if (row.item_id === answ.addInventory) {
                        chosenItem = row;
                    }
                });

                // Update Stock

                var newStock = chosenItem.stock_quantity + parseInt(answ.quantity);

                connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                    [
                        parseInt(newStock), parseInt(chosenItem.item_id)
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("\n\nStock Repleated\n\n".bold.cyan);

                        start()
                    }
                );
            };

        }).catch(function (err) {
            // log any errors that occurred in the .then() callback
            console.log(err);
        });

    })
}

// add new product to database
function addNewProduct() {

    console.log("\nAdding new product\n".bold.cyan)
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "Enter new product name"
        },
        {
            name: "department",
            type: "input",
            message: "Enter department of this product"
        },
        {
            name: "price",
            type: "text",
            message: "Enter price of product",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "text",
            message: "Enter the stock quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "confirm",
            type: "confirm",
            message: "Add new product?",
            default: true
        }
    ]).then(function (answ) {
        // if confirm order is false rerun purchaseItem
        if (answ.confirm === false) {
            start();
        } else {
           
            // Update Stock

            connection.query(
                // "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                // [
                //     parseInt(newStock), parseInt(chosenItem.item_id)
                // ],

                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",
                    [
                     answ.product,
                     answ.department,
                     answ.price,
                     answ.quantity   
                    ],

                function (err) {
                    if (err) throw err;
                    console.log("\n\nNew Product Added\n\n".bold.cyan);

                    start()
                }
            );
        };

    }).catch(function (err) {
        // log any errors that occurred in the .then() callback
        console.log(err);
    });

}