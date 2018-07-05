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
    console.log("Accessing Supervisor Protocols\n".bold.cyan)
    start();
});


function start() {
    inquirer
        .prompt([
            {
                name: "superOptions",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department"]
            }

        ]).then(function (answ) {
            if (answ.superOptions === "View Product Sales by Department") {
                showDepartments();
            }
            if (answ.superOptions === "Create New Department") {
                newDepartment();
            }
            

        }).catch(function (err) {
            // log any errors that occurred in the .then() callback
            console.log(err);
        });
}






// show table of all products
function showDepartments() {
    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales,  SUM(p.product_sales) - d.over_head_costs AS total_profit FROM bamazon.departments AS d LEFT JOIN bamazon.products AS p ON d.department_name = p.department_name GROUP BY d.department_name ORDER BY d.department_id;", function (err, res) {
        if (err) throw err;
        console.log("\nProduct Sales by Department:\n")
        var table = new Table({
            head: ['ID'.cyan, 'Department'.cyan, 'Over Head Costs'.cyan, 'Product Sales'.cyan, 'Total Profit'.cyan]
            , colWidths: [5, 15, 20, 20, 20]
        });
        res.forEach(row => {
            table.push(
                [row.department_id, row.department_name, "$" + row.over_head_costs, "$" + row.product_sales, "$" + row.total_profit],
            );
        });
        console.log(table.toString());
        console.log("\n~~~~~~~~~~~~~~~~~\n\n");
        start();
    });
}





// add new product to database
function newDepartment() {

    console.log("\nAdding new department\n".bold.cyan)
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Enter new department name"
        },
        {
            name: "overhead",
            type: "text",
            message: "Enter overhead costs of this department",
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
            message: "Add new department?",
            default: true
        }
    ]).then(function (answ) {
        // if confirm order is false rerun purchaseItem
        if (answ.confirm === false) {
            start();
        } else {
           
            // Update Stock

            connection.query(
               
                "INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)",
                    [
                     answ.department,
                     answ.overhead  
                    ],

                function (err) {
                    if (err) throw err;
                    console.log("\n\nNew Department Added\n\n".bold.cyan);

                    start()
                }
            );
        };

    }).catch(function (err) {
        // log any errors that occurred in the .then() callback
        console.log(err);
    });

}