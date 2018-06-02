# bamazon

Overview

This application is a simplied Amazon-like storefront that uses Node.js and MySQL. The application takes in orders from customers and removes the stock quantity from inventory.

Technologies Used

Javascript
mySQL
Node.js
npm packages: dot-env, cli-table2, colors/safe, inquirer, and mySQL

Customer View

The application presents a table of items for purchase which includes Item Id, Product Name, Price and Quantity. The application asks the customer if the customer wants to make a purchase. The customer enters the Item Id and quantity to be purchased. If there is sufficient quantity on-hand, the order is fulfilled and the application reduces the quantity purchased from inventory. The application confirms the purchase and presents the total purchase amount to the customer.

 
 <img src="Inventory_Table.png" height="400px" width="300">

<!-- <img src="images/demo2.png" height="200px" width="250"> -->

<!-- <img src="images/demo4.png" height="400px" width="450"> -->