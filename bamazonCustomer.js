require("dotenv").config();

var password = require("./password.js");

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require("colors/safe");

//create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon_DB"

});

//connect to the mysql server and sql database
connection.connect(function(err) {
    if(err) throw err;
    // console.log("connected as id " + connection.threadId);
    // connection.end();
   

// run the start function after the connection is made to prompt  the user

displayProducts();    
start();

});

function displayProducts() {
    
    connection.query("SELECT * FROM products", function(err, res){
        if(err) console.log(err);

    // create table to display items for purchase to the user
        var table = new Table({
            head: ["Item Id", "Product_Name", "Price"],
            // colWidths: [10, 200, 10],
            style: {
                head: ["blue"],
                compact: false,
                colAligns: ["center"],
                
                }
                
        });console.log("table is working!")
            { 
            
                for (var i = 0; i < res.length; i++){
                table.push(
                [res[i].id, res[i].product_name, res[i].price]

            );
            
            console.log(table.toString());
           
            }
              
            }
    }); 
}

// function which prompts the user for what action they should take
function start() {

    inquirer
        .prompt({
            name: "purchaseOrQuit",
            type: "input",
            message: "Enter the ID of the item you would like to purchase? [Quit with Q]",
            validate: function(value) { 

                var findProductQuery = "SELECT id from products WHERE id = 8"
                connection.query(findProductQuery);
                console.log(res.id);
                if (isNaN(value) == false && productExists != null) {
                    console.log("valid product");
                    return true;
                } else {
                    console.log("invalid product");
                    return false;
                }
            }
        
        })
        .then(function(answer) {
        //based on user's answer, either call the purchase or exit functions
        if (answer.purchaseOrQuit.toUpperCase() != "Q") {
            postPurchase();
        }
        else {
            exitSystem();
        }
    });

}

function postPurchase() {
    inquirer
        .prompt([
          {
            name: "itemCount",
            type: "input",
            message: "How many would you like to purchase?", 
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
          }
        
       ])
        .then(function(answer) {

            var numberofItems = parseInt(answer.itemCount);
        
            var userSelection = "SELECT * FROM products WHERE ID = ? AND stock_quantity >= ?"; 
             connection.query(userSelection,[answer.id, answer.stock_quantity]); 
             console.log("user selected!");
             console.log(res.userSelection);

            
            // check for quantity on hand is available
            if(res[answer.id].stock_quantity >= numberofItems) {
                
            // Update stock quantity in database to reflect purchase    
                connection.query("UPDATE products SET ? WHERE ?", [
                {stock_quantity: (res[userSelection].stock_quantity - numberofItems)},
                {id: answer.id}],
                function(err, result) {
                    if(err) throw err;
                    console.log("Your purchase has been confirmed!")
                });

            }
       });
        // //based on user's input, either call the purchase  or quit functions
        // if (answer.itemCountOrQuit.toUpperCase() != "Q") {
        //   connection.query("SELECT * FROM products", function(err, results) {
            // if (err) throw err;
            // console.log("Your purchase was created successfully!");

        // }

        // start();

}