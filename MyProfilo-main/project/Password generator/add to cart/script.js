// Initialize the shopping cart as an empty array
let shoppingCart = [];

function addCart(e) {
    let name = e.target.getAttribute("data-name");
    let id = e.target.getAttribute("data-id");
    let price = e.target.getAttribute("data-price");
    let item = { name, id, price, quantity: 1 };

    // Check if the item is already in the shopping cart
    let existingItemIndex = shoppingCart.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
        // If the item is already in the cart, increase the quantity
        shoppingCart[existingItemIndex].quantity++;
    } else {
        // Otherwise, add the item to the cart
        shoppingCart.push(item);
    }

    // Save the shopping cart in localStorage
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    showCart();
}

function delItem() {
    // Find the item with the specified ID and remove it from the cart
    // shoppingCart = shoppingCart.filter(item => item.id !== id);
    // // Save the updated shopping cart in localStorage
    // localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    let price = parseFloat(localStorage.getItem("productprice"));
    totalPrice -= price;
    totalIteam--;
    localStorage.removeItem("productname");
    localStorage.removeItem("productprice");
    localStorage.removeItem("productid");

    showCart();
}

function showCart() {
    let table = "<tr><th>Name</th><th>Quantity</th><th>Price</th><th>Total Price</th><th>Action</th></tr>";

    shoppingCart.forEach(item => {
        let totalPrice = item.price * item.quantity;

        table += "<tr>";
        table += "<td>" + item.name + "</td>";
        table += "<td>" + item.quantity + "</td>";
        table += "<td>" + item.price + "</td>";
        table += "<td>" + totalPrice + "</td>";
        table += "<td> <button onclick=delItem()>Cler</button></td>";
        table += "</tr>";
    });

    document.getElementById("cart-items").innerHTML = table;

}
function bill(table) {
    window.print(table);
    document.getElementById("table").addEventListener("click", function () {
        bill();
    });

    // Retrieve the shopping cart from localStorage and display it on page load
    // let savedCart = localStorage.getItem("shoppingCart");
    // if (savedCart) {
    //     shoppingCart = JSON.parse(savedCart);
    //     showCart();
    // }

}