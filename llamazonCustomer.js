var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: "3306",
	user: "root",
	password: "",
	database: "llamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected as id: " + connection.threadId);
	placeOrder();
});

//Create a function that displays all of the items available for sale, and asks the customer what they want to buy//
function placeOrder() {
	console.log("Welcome to llamazon for all your llama needs!");
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.log("Here's our current inventory");
		console.log("------------------------------------------");
		for (var i = 0; i < res.length; i++) {
			console.table(res[i].id + " " + res[i].product_name);
		}
		console.log("------------------------------------------");
		inquirer
			.prompt([
				{
					name: "id",
					type: "rawlist",
					choices: function() {
						var choiceArray = [];
						for (var i = 0; i < res.length; i++) {
							choiceArray.push(res[i].id);
						}
						return choiceArray;
					},
					message: "Select the id of the item you wish to purchase."
				},
				{
					name: "quantity",
					type: "input",
					message:
						"How many of the above item would you like to purchase?",
					validate: function(value) {
						if (isNaN(value) === false) {
							return true;
						}
						return false;
					}
				}
			])
			.then(function(answer) {
				var selectedItem;
				var quantity = parseInt(answer.quantity);
				for (var i = 0; i < res.length; i++) {
					if (res[i].id === answer.id) {
						selectedItem = res[i];
					}
				}
				console.log(JSON.stringify(selectedItem));
				console.log("User selected quantity: " + quantity);
				// determine if inventory is sufficient //
				if (quantity < selectedItem.stock_quantity) {
					var newQuantity = selectedItem.stock_quantity - quantity;
					console.log("The new inventory quantity: " + newQuantity);
					// we have enough in store, so let the customer know and update the db//
					connection.query(
						"UPDATE products SET ? WHERE ?",
						[
							{
								stock_quantity:
									selectedItem.stock_quantity - quantity
							},
							{
								id: selectedItem.id
							}
						],
						function(error) {
							if (error) throw error;
							console.log(
								"Order was successful! Thanks for shopping at llamazon."
							);
							placeOrder();
						}
					);
				} else {
					console.log(
						"Sorry, we don't have enough in stock. Try a different quantity or item id."
					);
					placeOrder();
				}
			});
	});
}
//prompt two messages//
