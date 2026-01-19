let products = [];
let cart = [];

// Fetch products
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        products = data.products;
        getCategories();
        showProducts(products);
    });

// Show all categories
function getCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    const catDiv = document.getElementById("categories");

    catDiv.innerHTML = `<button onclick="showProducts(products)">All</button>`;

    categories.forEach(cat => {
        catDiv.innerHTML += `<button onclick="filtercategory('${cat}')">${cat}</button>`;
    });
}

// Show product list
function showProducts(list) {
    const proDiv = document.getElementById("products");
    proDiv.innerHTML = "";

    list.forEach(p => {
        proDiv.innerHTML += `
            <div class='product'>
                <img src='${p.thumbnail}'>
                <h4>${p.title}</h4>
                <h4>${p.price}</h4>
                <button onclick='addToCart(${p.id})'>Add To Cart</button>
            </div>`;
    });
}

// Filter category
function filtercategory(catname) {
    const filtered = products.filter(p => p.category === catname);
    showProducts(filtered);
}

// Add to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(c => c.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({ id, title: product.title, price: product.price, qty: 1 });
    }

    savedCart();
    renderCart();
}

// Render cart
function renderCart() {
    const cartBody = document.getElementById("cartbody");
    cartBody.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        cartBody.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>
                    <button onclick='minusQty(${item.id})'>-</button>
                    ${item.qty}
                    <button onclick='plusQty(${item.id})'>+</button>
                </td>
                <td>${item.price}</td>
                <td><button onclick='removeItem(${item.id})'>X</button></td>
            </tr>`;
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

// Load saved cart on refresh
window.onload = () => {
    const saved = localStorage.getItem("cart");

    if (saved) {
        cart = JSON.parse(saved);
        renderCart();
    }
};

// Minus qty
function minusQty(id) {
    let item = cart.find(c => c.id === id);

    item.qty--;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }

    savedCart();
    renderCart();
}

// Plus qty
function plusQty(id) {
    let item = cart.find(c => c.id === id);
    item.qty++;

    savedCart();
    renderCart();
}

// Remove item
function removeItem(id) {
    const con = confirm("Are you sure?");
    if (con) {
        cart = cart.filter(c => c.id !== id);
        savedCart();
        renderCart();
    }
}

// Save cart to local storage
function savedCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}
