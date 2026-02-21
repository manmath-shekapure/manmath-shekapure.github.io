
function loadProduct(category) {
  localStorage.setItem("selectedCategory", category);
  window.location.href = "shop.html";
}


const productList   = document.getElementById("productList");
const pagination    = document.getElementById("pagination");
const searchInput   = document.getElementById("searchInput");
const searchBtn     = document.getElementById("searchBtn");
const cartBody      = document.getElementById("cartBody");
const cartTotal     = document.getElementById("cartTotal");
const cartCount     = document.getElementById("cartCount");


let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let page = 1;
let limit = 12;


const categoryFromHome = localStorage.getItem("selectedCategory");

if (categoryFromHome) {
  fetch(`https://dummyjson.com/products/category/${categoryFromHome}`)
    .then(res => res.json())
    .then(data => {
      filteredProducts = data.products;
      page = 1;
      renderUI();
    });

  localStorage.removeItem("selectedCategory");
}


fetch("https://dummyjson.com/products?limit=100")
  .then(res => res.json())
  .then(data => {
    allProducts = data.products;

    if (filteredProducts.length === 0) {
      filteredProducts = [...allProducts];
    }
    renderUI();
  });


function applySearch() {
  const keyword = searchInput.value.trim().toLowerCase();

  filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );

  page = 1;
  renderUI();
}

searchInput?.addEventListener("input", applySearch);
searchBtn?.addEventListener("click", applySearch);


function filterByCategory(cat) {
  filteredProducts = allProducts.filter(p => p.category === cat);
  page = 1;
  renderUI();
}


function displayProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filteredProducts.slice(start, end);

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
  if (!pagination) return;

  pagination.innerHTML = "";

  const pages = Math.ceil(filteredProducts.length / limit);

  for (let i = 1; i <= pages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === page ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>`;
  }
}

function changePage(p) {
  page = p;
  renderUI();
}


function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
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
  updateCartCount();

  const el = document.getElementById("offcanvas");
  const canvas = new bootstrap.Offcanvas(el);
  canvas.show();
}


function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQty(id) {
  const item = cart.find(c => c.id === id);
  item.qty++;

  saveCart();
  renderCart();
  updateCartCount();
}

function decreaseQty(id) {
  const item = cart.find(c => c.id === id);

  if (item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter(c => c.id !== id);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
  updateCartCount();
}


function renderCart() {
  if (!cartBody) return;

  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    cartBody.innerHTML += `
      <tr>
        <td>${item.title}</td>

        <td>
          <button class="btn btn-sm btn-secondary" onclick="decreaseQty(${item.id})">-</button>
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



function updateCartCount() {
  let count = 0;

  cart.forEach(item => count += item.qty);
  cartCount.innerText = count;
}


function openCart() {
  const el = document.getElementById("offcanvas");
  const canvas = new bootstrap.Offcanvas(el);
  canvas.show();
}


function renderUI() {
  displayProducts();
  setupPagination();
}


renderCart();
updateCartCount();