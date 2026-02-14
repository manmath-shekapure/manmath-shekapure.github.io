
const categoryList = document.getElementById("categoryList");
const productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let allproducts = [];       
let currentViewProducts = []; 
let currentpage = 1;
let limit = 10;



let selectedCategory = localStorage.getItem("selectedCategory");

if (selectedCategory) {
    fetch(`https://dummyjson.com/products/category/${selectedCategory}`)
      .then(res => res.json())
      .then(data => {
          currentViewProducts = data.products;
          currentpage = 1;
          render();
      });

    localStorage.removeItem("selectedCategory");
}

fetch("https://dummyjson.com/products?limit=100")
  .then(res => res.json())
  .then(data => {
    allproducts = data.products;
    currentViewProducts = [...allproducts];  
    render();
  });



function applySearch() {
  const keyword = searchInput.value.toLowerCase();

  currentViewProducts = allproducts.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );

  currentpage = 1;
  render();
}

searchInput.addEventListener("input", applySearch);
searchBtn.addEventListener("click", applySearch);



fetch("https://dummyjson.com/products/category-list")
  .then(res => res.json())
  .then(categories => {
    categoryList.innerHTML = "";

    categories.forEach(category => {
      categoryList.innerHTML += `
        <li>
          <a class="dropdown-item" href="#" onclick="loadProduct('${category}')">${category}</a>
        </li>`;
    });
  });



function loadProduct(cat) {

  currentViewProducts = allproducts.filter(p => p.category === cat);

  currentpage = 1;
  render();
}



function displayProducts() {
  productList.innerHTML = "";

  let start = (currentpage - 1) * limit;
  let end = start + limit;

  const items = currentViewProducts.slice(start, end);

  items.forEach(product => {
    productList.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="pro-card">
          <img src="${product.thumbnail}" class="pro-img">
          <h5 class="pro-title">${product.title}</h5>

          <div class="price-box">
            <span class="new-price">₹${product.price}</span>
          </div>

          <button class="btn btn-primary w-100 mt-2" onclick="addToCart(${product.id})">
              Add to Cart
          </button>
        </div>
      </div>`;
  });
}



function setupPagination() {
  pagination.innerHTML = "";

  const pages = Math.ceil(currentViewProducts.length / limit);

  for (let i = 1; i <= pages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentpage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changepage(${i})">${i}</a>
      </li>`;
  }
}

function changepage(p) {
  currentpage = p;
  render();
}



function render() {
  displayProducts();
  setupPagination();
}


// FIXED — ADD TO CART
function addToCart(id) {

  const product = allproducts.find(p => p.id === id);

  const item = cart.find(c => c.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: 1
    });
  }

  saveCart();
  renderCart();
}



function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function renderCart() {
  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    cartBody.innerHTML += `
      <tr>
        <td>${item.title}</td>

        <td>
          <button class="btn btn-sm btn-secondary" onclick="decreaseQty(${item.id})">−</button>
          <span class="mx-2">${item.qty}</span>
          <button class="btn btn-sm btn-secondary" onclick="increaseQty(${item.id})">+</button>
        </td>

        <td>₹${item.price}</td>
        <td>₹${itemTotal}</td>

        <td>
          <button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">Remove</button>
        </td>
      </tr>`;
  });

  cartTotal.innerText = total;
}



function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}



renderCart();

function increaseQty(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  }
  saveCart();
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find(p => p.id === id);

  if (item.qty > 1) {
    item.qty--;
  } else {
    // If qty goes below 1 → remove product
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  renderCart();
}
function removeItem(id) {
  const item = cart.find(p => p.id === id);

  if (confirm(`Are you sure you want to remove "${item.title}" from the cart?`)) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
    renderCart();
    alert(`${item.title} removed successfully`);
  }
}