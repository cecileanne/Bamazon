require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const { table } = require("table");
const chalk = require("chalk");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  const optionArray = [["ID#", "Product", "Cost/Unit", "Amount in Stock"]];
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    res.forEach(product =>
      optionArray.push([
        product.id,
        product.product_name,
        `$${product.price}`,
        `${product.stock_quantity} available!`
      ])
    );
    let options = {
      drawHorizontalLine: (index, size) => {
        return index === 0 || index === 1 || index === size;
      }
    };

    output = table(optionArray, options);
    console.log(
      chalk.black.bgCyan(
        `\n\nWelcome to Bamazon - A store for all of your shopping needs`
      )
    );
    console.log(output);

    function userShop() {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the ID # of the product you want to buy?",
            name: "productID"
          }
        ])
        .then(answers => {
          const productID = answers.productID;
          inquirer
            .prompt([
              {
                type: "input",
                message: `How many of ID# ${answers.productID} would you like to buy?`,
                name: "userQuantity"
              }
            ]) // closes second prompt
            .then(response => {
              // TO DO check against amount to see if we have enough
              // if no then console.log(`Sorry, we don't have enough in stock - please try again with a smaller amount or come back again`)
              // update shopping cart
              function addToCart() {
                // set variables
                const userQuantity = response.userQuantity;
                const productPrice = optionArray[answers.productID - 1].price;
                const stockRemaining = Number(
                  optionArray[answers.productID - 1].stock_quantity -
                    userQuantity
                );
                // TO DO fix this balance
                const balance = Number(userQuantity * productPrice);
                connection.query(
                  "INSERT INTO shopping_cart SET ?",
                  {
                    id: productID,
                    quantity_wanted: userQuantity
                  },
                  function(err, response) {
                    if (err) throw err;
                    console.log(
                      `\n${userQuantity} of ID# ${productID} added to your cart! There are ${stockRemaining} more available.\nYour current balance for this purchase is $${balance}\n`
                    );
                  }
                );
              } // closes connection query
              addToCart(answers.productID, response.userQuantity);
            }) // closes then
            .finally(response => {
              // // CHECK OUT is a joining of the tables
              // connection.query(
              //   `SELECT ${response.productID} FROM products;`,
              //   function(err, data) {
              //     if (err) throw err;
              //   }
              // );
              // // TO DO give option of adding more to the cart
              connection.end();
            })
            .catch(err => console.log(err)); // closes then
        });
    }
    userShop();
  });
}
