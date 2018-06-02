require("dotenv").config();

var password = require("./password.js");

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");
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
     

// run the displayProducts function after the connection is made to prompt the user

displayProducts();    


});

function displayProducts() {
    
    connection.query("SELECT * FROM products", function(err, res){
        if(err) console.log(err);

    // create table to display items for purchase to the user
        var table = new Table({
            head: [" Item Id ", "   Product Name   ", " Price "," Quantity "],
            
            style: {
                head: ["blue"],
                compact: false,
                colAligns: ["center"],
            }
         
        }); 
        // create rows for each item, product, price and qty to populate table
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

// function which prompts the user for what action user should take
function start() {

    inquirer
        .prompt({
            name: "purchaseOrQuit",
            type: "list",
            choices: ["purchase","exit"],
            message: "Would you like to make a purchase or exit the system?",
            
            validate: function(value) { 
             
            }
        
        })
        .then(function(answer) {
        //based on user's answer, run purchase or exit function
        if (answer.purchaseOrQuit == "purchase") {
            postPurchase();
        }
        else {
            (answer.purchaseOrQuit == "exit");
            console.log("Good-bye. Have a nice day!");
            connection.end();
        
        }
    });

}
// Prompt user to enter item and quantity to be purchased
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
                 

        // console.log(itemNumber);
        
        var userSelection = "SELECT * FROM products WHERE ?";   
            connection.query(userSelection,[{id :itemNumber}], function(err,data){
        // check to make sure there is sufficient quantity on-hand        
                if (err) throw err;
                //console.log(data[0]);
                if(parseInt(data[0].stock_quantity) <numberofItems) {
                console.log("Sorry, we do not have enough " + data[0].product_name);
                connection.end();
                }
                        
        // If there is sufficient quantity available, fullfill the purchase and reduce quantity from inventory
            if(parseInt(data[0].stock_quantity) >= numberofItems) {
                
            connection.query("UPDATE products SET ? WHERE ?", [
            {stock_quantity: (data[0].stock_quantity - numberofItems)},
            {id: answer.itemNumber}],
         
        // Provide total cost of purchase 
            function(err, result) {
                if(err) throw err;
                console.log("Your purchase has been confirmed! Total cost is $ " + ( numberofItems*data[0].price).toFixed(2));
                // console.log(answer.itemNumber);

                connection.end();
                });

            }
       });
    }); 

}