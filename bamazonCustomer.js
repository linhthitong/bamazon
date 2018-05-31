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

    password: process.env.PASSWORD_,
    database: "bamazon_DB"

});

//connect to the mysql server and sql database
connection.connect(function(err) {
    if(err) throw err;
    // console.log("connected as id " + connection.threadId);
    // connection.end();
   

// run the start function after the connection is made to prompt the user

displayProducts();    


});

function displayProducts() {
    
    connection.query("SELECT * FROM products", function(err, res){
        if(err) console.log(err);

    // create table to display items for purchase to the user
        var table = new Table({
            head: ["Item Id", "Product Name", "Price","Quantity"],
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
                [res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]
                );
   
            }
            console.log("\n", table.toString());
            start();              
            }
    }); 
}

// function which prompts the user for what action they should take
function start() {

    inquirer
        .prompt({
            name: "purchaseOrQuit",
            type: "list",
            choices: ["purchase","exit"],
            message: "Would you like to make a purchase or exit the system?",
            // [Quit with Q]
            validate: function(value) { 
                // console.log(res)
                // if (isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0) {
                //     return true;
                // } else {
                //     return false;
                // }
            }
        
        })
        .then(function(answer) {
        //based on user's answer, either call the purchase or exit functions
        if (answer.purchaseOrQuit == "purchase") {
            postPurchase();
        }
        else {
            (answer.purchaseOrQuit == "exit");
            console.log("Good-bye. Have a nice day!");
            connection.end();
        // }
        // else {
            // exitSystem();
        }
    });

}

function postPurchase() {
    inquirer
        .prompt([
            {
            name: "itemNumber",
            type: "input",
            message: "Enter the ID of the item you want to purchase.", 
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
            },
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

            var itemNumber = parseInt(answer.itemNumber);
            var numberofItems = parseInt(answer.itemCount);
            var totalCost = parseFloat(((answer.itemNumber.price)*numberofItems));

        console.log(itemNumber);
            var userSelection = "SELECT * FROM products WHERE ?";   // AND stock_quantity >= ?
             connection.query(userSelection,[{id :itemNumber}], function(err,data){
                if (err) throw err;
                console.log(data[0]);
                if(parseInt(data[0].stock_quantity <numberofItems )) 
                console.log("Sorry, we do not have enough " + data[0].product_name);
                connection.end();
            //  console.log("user selected!");
            //  console.log(res.userSelection);

            
            // check for quantity on hand is available
            if(parseInt(data[0].stock_quantity) >= numberofItems) {
                
            // Update stock quantity in database to reflect purchase    
                connection.query("UPDATE products SET ? WHERE ?", [
                {stock_quantity: (data[0].stock_quantity - numberofItems)},
                {id: answer.itemNumber}],
                function(err, result) {
                    if(err) throw err;
                    console.log("Your purchase has been confirmed! Total cost is $ " + (answer.itemNumber*numberofItems.toFixed(2)));
                    connection.end();
                });

            }
       });
    }); 

}