var mysql = require("mysql");
var inquirer = require("inquirer");

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
//run the start function after the connection is made to prompt  the user
    start();

});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "purchaseOrQuit",
            type: "rawlist",
            message: "What is the item ID you would like to [PURCHASE] or [EXIT]?",
            choices:["PURCHASE","EXIT"]

        })
        .then(function(answer) {
        //based on user's answer, either call the purchase or exit functions
        if (answer.purchaseOrQuit.toUpperCase() === "PURCHASE") {
            postPurchase();
        }
        else {
            exitSystem();
        }
        });

    }
