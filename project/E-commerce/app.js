let productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");

const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const filterButtons = document.querySelectorAll(".filter-option");
const filterBox = document.getElementById("filterBox");

const categorySelect = document.getElementById("filterCategory");
const brandSelect = document.getElementById("filterBrand");
const priceSelect = document.getElementById("filterPrice");
const offerSelect = document.getElementById("filterOffer");

let allProducts = [];
let filteredProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let page = 1;
let limit = 12;


filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-filter");
    showFilter(type);
  });
});

function showFilter(type) {
  filterBox.style.display = "block";

  document.querySelectorAll(".filter-section").forEach(s => s.style.display = "none");

  if (type === "category") categorySelect.parentElement.style.display = "block";
  if (type === "brand") brandSelect.parentElement.style.display = "block";
  if (type === "price") priceSelect.parentElement.style.display = "block";
  if (type === "offer") offerSelect.parentElement.style.display = "block";
}


document.getElementById("clearFilters")?.addEventListener("click", () => {
  filterBox.style.display = "none";

  categorySelect.value = "All";
  brandSelect.value = "All";
  priceSelect.value = "All";
  offerSelect.value = "All";

  filteredProducts = [...allProducts];
  page = 1;
  renderUI();
});


fetch("https://dummyjson.com/products/categories")
  .then(res => res.json())
  .then(categories => {
    categorySelect.innerHTML = `<option value="All">All</option>`;

    categories.forEach(cat => {
      categorySelect.innerHTML += `
        <option value="${cat.slug}">${cat.name}</option>
      `;
    });
  });


fetch("https://dummyjson.com/products?limit=0")
  .then(res => res.json())
  .then(data => {
    allProducts = data.products;
    filteredProducts = [...allProducts];
    renderUI();

    loadBrands(data.products);
  });



function loadBrands(products) {
  let brands = [...new Set(products.map(p => p.brand))];

  brandSelect.innerHTML = `<option value="All">All</option>`;
  brands.forEach(b => {
    brandSelect.innerHTML += `<option value="${b}">${b}</option>`;
  });
}


searchInput?.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );

  page = 1;
  renderUI();
});


categorySelect?.addEventListener("change", applyFilters);
brandSelect?.addEventListener("change", applyFilters);
priceSelect?.addEventListener("change", applyFilters);
offerSelect?.addEventListener("change", applyFilters);

function applyFilters() {
  const cat = categorySelect.value;
  const brand = brandSelect.value;
  const price = priceSelect.value;
  const offer = offerSelect.value;

  filteredProducts = allProducts.filter(p => {
    let ok = true;

    if (cat !== "All") ok = ok && p.category.toLowerCase() === cat.toLowerCase();
    if (brand !== "All") ok = ok && p.brand.toLowerCase() === brand.toLowerCase();

    if (price !== "All") {
      const [min, max] = price.split("-").map(Number);
      ok = ok && p.price >= min && p.price <= max;
    }

    if (offer !== "All") {
      ok = ok && Math.floor(p.discountPercentage) == Number(offer);
    }

    return ok;
  });

  page = 1;
  renderUI();
}


function displayProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  const start = (page - 1) * limit;
  const end = start + limit;

  filteredProducts.slice(start, end).forEach(product => {
    productList.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="pro-card" onclick="openProduct(${product.id})">
          <img src="${product.thumbnail}" class="pro-img">
          <h5>${product.title}</h5>
          <span class="new-price">₹${product.price}</span>

          <button class="btn btn-primary w-100 mt-2"
            onclick="event.stopPropagation(); addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}


function setupPagination() {
  if (!pagination) return;

  pagination.innerHTML = "";
  let pages = Math.ceil(filteredProducts.length / limit);

  for (let i = 1; i <= pages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === page ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }
}

function changePage(p) {
  page = p;
  renderUI();
}


function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}


function addToCart(id) {
  const productInShop = allProducts.find(p => p.id === id);

  let existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: id,
      title: productInShop?.title || "Product",
      price: productInShop?.price || 0,
      qty: 1
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
  let item = cart.find(c => c.id === id);
  item.qty++;
  saveCart();
  renderCart();
  updateCartCount();
}

function decreaseQty(id) {
  let item = cart.find(c => c.id === id);

  if (item.qty > 1) item.qty--;
  else cart = cart.filter(c => c.id !== id);

  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

function renderCart() {
  if (!cartBody) return;

  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    let t = item.qty * item.price;
    total += t;

    cartBody.innerHTML += `
      <tr>
        <td>${item.title}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="decreaseQty(${item.id})">-</button>
          <span class="mx-2">${item.qty}</span>
          <button class="btn btn-sm btn-secondary" onclick="increaseQty(${item.id})">+</button>
        </td>
        <td>₹${item.price}</td>
        <td>₹${t}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">Remove</button></td>
      </tr>
    `;
  });

  cartTotal && (cartTotal.innerText = total);
}

function updateCartCount() {
  cartCount && (cartCount.innerText = cart.length);
}

function openCart() {
  let off = document.getElementById("offcanvas");
  if (off) new bootstrap.Offcanvas(off).show();
}


function loadSingleProduct() {
  const box = document.getElementById("productDetails");
  if (!box) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (!id) return;

  fetch(`https://dummyjson.com/products/${id}`)
    .then(res => res.json())
    .then(p => showProductDetails(p));
}

function showProductDetails(p) {
  const box = document.getElementById("productDetails");

  box.innerHTML = `
  <div class="row">
    <div class="col-md-6">
      <img src="${p.thumbnail}" class="img-fluid rounded shadow-sm mb-3 main-img">

      <div class="d-flex gap-2">
        ${p.images.slice(0,3).map(img => `
          <img src="${img}" style="width:70px;height:70px;object-fit:cover;border:1px solid #ddd;padding:3px;cursor:pointer"
          onclick="document.querySelector('.main-img').src='${img}'">
        `).join("")}
      </div>
    </div>

    <div class="col-md-6">
      <h2>${p.title}</h2>
      <p class="text-muted">Brand: ${p.brand}</p>

      <h3 class="text-success">₹${p.price}</h3>

      <p>
        <span class="text-danger">${Math.floor(p.discountPercentage)}% Off</span>
      </p>

      <div class="d-flex gap-3 mt-3">
        <button class="btn btn-primary" onclick="addToCart(${p.id})">Add To Cart</button>
        <button class="btn btn-success" onclick="buyNow(${p.id})">Buy Now</button>
      </div>

      <hr>

      <h5>Description</h5>
      <p>${p.description}</p>
    </div>
  </div>
  `;
}

function buyNow(id) {
  window.location.href = `checkout.html?id=${id}`;
}


function renderUI() {
  displayProducts();
  setupPagination();
}

renderCart();
updateCartCount();
loadSingleProduct();






var swiper = new Swiper(".swiper1", {
    slidesPerView: 5,
    spaceBetween: 25,
    loop: true,
    speed: 700,

    autoplay: {
        delay: 1800,
        disableOnInteraction: false,
    },

    pagination: {
        el: ".swiper-pagination1",
        clickable: true,
    },

    navigation: {
        nextEl: ".swiper-button-next1",
        prevEl: ".swiper-button-prev1",
    },

    breakpoints: {
        320: { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 }
    }
});





var swiper = new Swiper(".swiper2", {
    slidesPerView: 5,
    spaceBetween: 25,
    loop: true,
    speed: 700,

    autoplay:false,
    

    pagination: {
        el: ".swiper-pagination1",
        clickable: true,
    },

    navigation: {
        nextEl: ".swiper-button-next1",
        prevEl: ".swiper-button-prev1",
    },

    breakpoints: {
        320: { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 }
    }
});
