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
        `${product.stock_quantity} available`
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
              const productID = answers.productID;
              const userAmountToPurchase = Number(response.userQuantity);
              // console.log(Number(productID));
              connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                const chosenItemCurrentStock = Number(
                  JSON.stringify(res[productID - 1].stock_quantity)
                );
                // console.log(Number(chosenItemCurrentStock));
                // console.log(Number(response.userQuantity));
                // Check against stock to see if there is enough
                if (chosenItemCurrentStock < userAmountToPurchase) {
                  console.log(
                    `Sorry, try a different item or lower number - we don't have enough stock to fulfill your request.`
                  );
                  userShop();
                } else {
                  // update shopping cart
                  // function addToCart() {
                  const balance =
                    Number(JSON.stringify(res[productID - 1].price)) *
                    userAmountToPurchase;
                  const stockRemaining =
                    chosenItemCurrentStock - userAmountToPurchase;
                  // connection.query(
                  //   "INSERT INTO shopping_cart SET ?",
                  //   {
                  //     id: productID,
                  //     quantity_wanted: userAmountToPurchase
                  //   },
                  //   function(err, response) {
                  //     if (err) throw err;
                  //   }; // closes function for error
                  console.log(
                    `\n${userAmountToPurchase} of ID# ${productID} added to your cart! There are ${stockRemaining} more available.\nYour current balance for this purchase is $${balance}\n`
                  );
                  // ); // closes connectionquery for addToCart()
                  // } // closes addToCart function
                  // addToCart();
                }
              }); // closes connection query to check stock
            }) // closes then
            .finally(response => {
              // // CHECK OUT function is a joining of the tables - not necessary
              // // TO DO give option of adding more to the cart
              connection.end();
            }) // closes finally
            .catch(err => console.log(err)); // closes then
        });
    }
    userShop();
  });
}
