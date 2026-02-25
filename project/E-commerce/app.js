
const productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const productDetails = document.getElementById("productDetails");

let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let page = 1;
let limit = 12;


function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}


fetch("https://dummyjson.com/products?limit=100")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data.products;
    filteredProducts = [...allProducts];
    renderUI();
  });


function applySearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(keyword)
  );
  page = 1;
  renderUI();
}

searchInput?.addEventListener("input", applySearch);
searchBtn?.addEventListener("click", applySearch);


function openProduct(id) {
  const product = allProducts.find(p => p.id === id);
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "product.html";
}


if (productDetails) {
  let product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (product) {
    let discount = Math.floor(Math.random() * 40) + 10;  // 10–50% random discount
    let oldPrice = Math.floor(product.price + (product.price * discount) / 100);

    productDetails.innerHTML = `
      <div class="col-md-5">
        <img src="${product.thumbnail}" class="img-fluid main-img mb-3" id="mainImage">
        
        <div class="d-flex gap-2">
          ${product.images
            .map(
              (img) =>
                `<img src="${img}" onclick="document.getElementById('mainImage').src='${img}'" 
                 class="border p-1" style="width:70px; height:70px; cursor:pointer;">`
            )
            .join("")}
        </div>
      </div>

      <div class="col-md-7">
        <h2>${product.title}</h2>
        <p class="text-muted">Brand: <b>${product.brand}</b></p>

        <h3 class="text-success mb-0">₹${product.price}</h3>
        <p class="text-danger">
          <del>₹${oldPrice}</del> <b>${discount}% Off</b>
        </p>

        <p><b>Rating:</b> ⭐ ${product.rating}</p>

        <p class="text-primary"><b>Stock:</b> ${product.stock > 20 ? "In Stock ✔" : "Few Left ⚠"}</p>

        <h5 class="mt-3">Available Offers:</h5>
        <ul>
          <li>🔥 Special Price: Get extra ₹100 off</li>
          <li>💳 Bank Offer: 10% discount on UPI & Cards</li>
          <li>🚚 Free Delivery on orders above ₹499</li>
          <li>↩ Easy 7-day Return Policy</li>
        </ul>

        <button class="btn btn-primary px-4" onclick="addToCart(${product.id})">Add To Cart</button>
        <button class="btn btn-success px-4" onclick="buyNow(${product.id})">Buy Now</button>

        <hr>

        <h4>Description</h4>
        <p>${product.description}</p>

        <h5 class="mt-3">Shipping</h5>
        <p>🚀 Delivered within 3-5 Days</p>
      </div>
    `;
  }
}


function displayProducts() {
  productList.innerHTML = "";

  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filteredProducts.slice(start, end);

  items.forEach((product) => {
    productList.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="pro-card" style="cursor:pointer;" onclick="openProduct(${product.id})">

          <img src="${product.thumbnail}" class="pro-img">

          <h5 class="pro-title">${product.title}</h5>

          <div class="price-box">
            <span class="new-price">₹${product.price}</span>
          </div>

          <button class="btn btn-primary w-100 mt-2" 
            onclick="event.stopPropagation(); addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>`;
  });
}


function setupPagination() {
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
  const product = allProducts.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: 1,
    });
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQty(id) {
  const item = cart.find((c) => c.id === id);
  item.qty++;
  saveCart();
  renderCart();
  updateCartCount();
}

function decreaseQty(id) {
  const item = cart.find((c) => c.id === id);

  if (item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter((c) => c.id !== id);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

// RENDER CART
function renderCart() {
  if (!cartBody) return;

  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
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
  cart.forEach((item) => (count += item.qty));
  cartCount.innerText = count;
}


function openCart() {
  new bootstrap.Offcanvas(document.getElementById("offcanvas")).show();
}


function buyNow(id) {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  const product = allProducts.find((p) => p.id === id);
  localStorage.setItem("buyNowProduct", JSON.stringify(product));
  window.location.href = "checkout.html";
}


function checkoutCart() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  localStorage.setItem("order", JSON.stringify(cart));
  window.location.href = "checkout.html";
}


function renderUI() {
  displayProducts();
  setupPagination();
}

renderCart();
updateCartCount();