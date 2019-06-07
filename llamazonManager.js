var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "llamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	manageStore();
});

function manageStore() {
	inquirer
		.prompt({
			name: "task",
			type: "list",
			message: "What would you like to do?",
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product",
				"Exit"
			]
		})
		.then(function(answer) {
			switch (answer.task) {
				case "View Products for Sale":
					viewProducts();
					break;

				case "View Low Inventory":
					viewLowInventory();
					break;

				case "Add to Inventory":
					addInventory();
					break;

				case "Add New Product":
					// addProduct();
					break;

				case "Exit":
					connection.end();
					break;
			}
		});
}
//function that lists every available item, the IDs, names, prices, and quantities//
function viewProducts() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.log("Here are all the products that are available for sale");
		console.log("------------------------------------------");
		console.table(res);
		console.log("------------------------------------------");
		manageStore();
	});
}
//function that shows a list of all items with an inventory count < 5//
function viewLowInventory() {
	connection.query(
		"SELECT * FROM products WHERE stock_quantity <= 5",
		function(err, res) {
			if (err) throw err;
			console.log(
				"Here are all the products that have less than 5 in our inventory"
			);
			console.table(res);
			manageStore();
		}
	);
}
//display a prompt that will let the manager "add more" of any item currently in the store//
function addInventory() {
	var inventory;
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.log("Here are the products that we have in your inventory");
		console.table(res);
		inventory = res;
	});
	inquirer
		.prompt([
			{
				name: "product",
				type: "input",
				message: "What is the id of item  you would like to add?",
				validate: function(value) {
					if (isNaN(value) === false) {
						return true;
					} else return false;
				}
			}
		])
		.then(function(answer) {
			var products = checkInventory(parseInt(answer.product), inventory);
			console.log("Products: " + products);
			if (products) {
				promptForQuantity(products);
			} else {
				console.log("wrong id");
				manageStore();
			}
		});
}

function checkInventory(id, inventory) {
	console.log("Inside the checkInventory function");
	console.log("Inventory length:" + inventory.length);
	for (var i = 0; i < inventory.length; i++) {
		console.log("2nd id: " + inventory[1].id);
		console.log(inventory[i].id);
		if (inventory[i].id == id) {
			console.log("match id");
			return inventory[i];
		} else {
			return null;
		}
	}
}

function promptForQuantity(products) {
	inquirer
		.prompt([
			{
				name: "quantity",
				type: "input",
				message: "What would you like the quantity to be updated to?"
			}
		])
		.then(function(answer) {
			var quantity = parseInt(answer.quantity);
			connection.query(
				"UPDATE products SET stock_quantity = ? WHERE id = ?",
				[products.stock_quantity + quantity, products.id],
				function(err, res) {
					console.log("Successfully added quantity");
					viewProducts();
				}
			);
		});
}
