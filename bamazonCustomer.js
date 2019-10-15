const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "cecile1sGROOT",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  const optionArray = [];
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    res.forEach(product =>
      optionArray.push(
        `ID#: ${product.id}, ${product.product_name}, Price: $${product.price}/unit`
      )
    );
    console.log(optionArray);

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
          inquirer.prompt([
            {
              type: "input",
              message: `How many of ID# ${answers.productID} would you like to buy?`,
              name: "userQuantity"
            }
          ]); // closes second prompt
        }) // closes then
        .then(response => {
          purchaseItem(answers.productID, response.userQuantity);
        })
        .finally(response => {
          connection.query(
            `SELECT ${response.productID} FROM products;`,
            function(err, data) {
              if (err) throw err;
            }
          );
          connection.end();
        })
        .catch(err => console.log(err)); // closes then
    } // closes userShop
    userShop();
  });
}
