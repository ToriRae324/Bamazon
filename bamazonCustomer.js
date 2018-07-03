// Require inquirer
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
    start();
});



// Functions that happen during connection ~~~~~~~~~

// start flow
function start() {
    inquirer
    .prompt([
        {
            name: "newPurchase",
            type: "confirm",
            message: "Would you like to make a purchase?",
            default: true
        }
        
    ]).then(function(answ) {
        if (answ.newPurchase) {
            showProducts();
        } else {
            console.log("\n\nCome Again Soon!\n\n");
            connection.end();
        }

    }).catch(function (err) {
        // log any errors that occurred in the .then() callback
        console.log(err);
    });
}

// show table of all products
function showProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nAll Products:\n")
        var table = new Table({
            head: ['Product Name'.cyan, 'Department'.cyan, 'Price'.cyan]
          , colWidths: [25, 15, 7]
        });
        res.forEach(row => {
            table.push(
                [row.product_name, row.department_name, "$"+row.price],
            );
        });
        console.log(table.toString());
        console.log("\n~~~~~~~~~~~~~~~~~\n\n");
        purchaseItem();
    });
}


// purchase an item
function purchaseItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "product",
                type: "list",
                choices: function () {
                    var choiceArr = [];
                    res.forEach(row => {
                        var product = { name: row.product_name, value: row.item_id }
                        choiceArr.push(product);
                    });
                    return choiceArr;
                },
                message: "Select the item you wish to purchase:"
            },
            {
                name: "quantity",
                type: "text",
                message: "Enter the quantity you would like to purchase:",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "order",
                type: "confirm",
                message: "Would you like to make this purchase?",
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
                    if (row.item_id === answ.product) {
                        chosenItem = row;
                    }
                });

                // Is product in stock?
                if (chosenItem.stock_quantity > parseInt(answ.quantity)) {
                    var newStock = chosenItem.stock_quantity - parseInt(answ.quantity);
                    var purchasePrice = parseInt(answ.quantity) * chosenItem.price;
                    connection.query(
                        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                        [
                            parseInt(newStock), parseInt(chosenItem.item_id)
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("\n\nOrder Placed!");
                            console.log("Purchase Price: $" + purchasePrice+ "\n\n");
                            start()
                        }
                    )
                    ;
                } else {
                    console.log("Insufficient quantity!");
                    start();
                }


            };

        }).catch(function (err) {
            // log any errors that occurred in the .then() callback
            console.log(err);
        });

    })
}

