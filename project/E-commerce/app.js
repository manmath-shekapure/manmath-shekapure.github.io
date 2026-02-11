
// const categoryList = document.getElementById("categoryList");
// const productList = document.getElementById("productList");
// const pagination = document.getElementById("pagination");
// const searchInput = document.getElementById("searchInput");
// const searchBtn = document.getElementById("searchBtn");


// let cart = JSON.parse(localStorage.getItem("cart")) || [];


// let allproducts = [];
// let filterproducts = [];
// let currentpage = 1;
// let limit = 10;

// /* Load all products */
// fetch("https://dummyjson.com/products?limit=100")
//   .then(res => res.json())
//   .then(data => {
//     allproducts = data.products;
//     filterproducts = allproducts;
//     render();
//   });

// /* SEARCH FUNCTION */
// function applySearch() {
//   const keyword = searchInput.value.toLowerCase();

//   filterproducts = allproducts.filter(p =>
//     p.title.toLowerCase().includes(keyword)
//   );

//   currentpage = 1;
//   render();
// }

// searchInput.addEventListener("input", applySearch);
// searchBtn.addEventListener("click", applySearch);

// /* LOAD CATEGORY LIST */
// fetch("https://dummyjson.com/products/category-list")
//   .then(res => res.json())
//   .then(categories => {
//     categoryList.innerHTML = "";

//     categories.forEach(category => {
//       categoryList.innerHTML += `
//         <li>
//           <a class="dropdown-item" href="#" onclick="loadProduct('${category}')">${category}</a>
//         </li>`;
//     });
//   });

// /* CATEGORY WISE LOAD */
// function loadProduct(cat) {
//   fetch(`https://dummyjson.com/products/category/${cat}`)
//     .then(res => res.json())
//     .then(data => {
//       allproducts = data.products;
//       filterproducts = allproducts;
//       currentpage = 1;
//       render();
//     });
// }

// /* DISPLAY PRODUCTS */
// function displayProducts() {
//   productList.innerHTML = "";

//   let start = (currentpage - 1) * limit;
//   let end = start + limit;

//   const items = filterproducts.slice(start, end);

//   items.forEach(product => {
//     productList.innerHTML += `
//       <div class="col-md-3 mb-4">
//         <div class="pro-card">
//           <img src="${product.thumbnail}" class="pro-img">
//           <h5 class="pro-title">${product.title}</h5>
//           <div class="price-box">
//             <span class="new-price">₹${product.price}</span>
//             <button class='btn-sm  btn-primary'
//             onclick ='addTocart(${json.stringify(product)})'Add to cart</button>
//           </div>
//           </div>
//       </div>`;
//   });
// }

// /* PAGINATION */
// function setupPagination() {
//   pagination.innerHTML = "";

//   const pages = Math.ceil(filterproducts.length / limit);

//   for (let i = 1; i <= pages; i++) {
//     pagination.innerHTML += `
//       <li class="page-item ${i === currentpage ? "active" : ""}">
//         <a class="page-link" href="#" onclick="changepage(${i})">${i}</a>
//       </li>`;
//   }
// }

// function changepage(p) {
//   currentpage = p;
//   render();
// }

// /* MAIN RENDER */
// function render() {
//   displayProducts();
//   setupPagination();
// }



// function displayProducts() {
//   productList.innerHTML = "";

//   let start = (currentpage - 1) * limit;
//   let end = start + limit;

//   const items = filterproducts.slice(start, end);

//   items.forEach(product => {
//     productList.innerHTML += `
//       <div class="col-md-3 mb-4">
//         <div class="pro-card">
//           <img src="${product.thumbnail}" class="pro-img">
//           <h5 class="pro-title">${product.title}</h5>

//           <div class="price-box">
//             <span class="new-price">₹${product.price}</span>
//           </div>

//           <button class="btn btn-primary w-100 mt-2" onclick="addToCart(${product.id})">
//                 Add to Cart
//                  </button>

//         </div>
//       </div>`;
//   });
// }


// function addToCart(id) {

//     const product = allproducts.find(p => p.id === id);

//     const item = cart.find(c => c.id === id);

//     if (item) {
//         item.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             title: product.title,
//             price: product.price,
//             qty: 1
//         });
//     }

//     saveCart();
//     renderCart();
// }

//   function savecart(){
//     localStorage.setItem("cart",json.stringify(cart));
//     rendercart();
//   }


//   function rendercart(){
//   const cartBody =document.getElementById("cartBody");
//   const cartTotal = document.getElementById("cartTotal");
//   cartBody.innerHTML = "";
//   let total  = 0;
// }

// function saveCart() {
//     localStorage.setItem("cart", JSON.stringify(cart));
// }

// ELEMENTS
const categoryList = document.getElementById("categoryList");
const productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let allproducts = [];
let filterproducts = [];
let currentpage = 1;
let limit = 10;

/* Load all products */
fetch("https://dummyjson.com/products?limit=100")
  .then(res => res.json())
  .then(data => {
    allproducts = data.products;
    filterproducts = allproducts;
    render();
  });

/* SEARCH FUNCTION */
function applySearch() {
  const keyword = searchInput.value.toLowerCase();

  filterproducts = allproducts.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );

  currentpage = 1;
  render();
}

searchInput.addEventListener("input", applySearch);
searchBtn.addEventListener("click", applySearch);

/* LOAD CATEGORY LIST */
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

/* CATEGORY WISE LOAD */
function loadProduct(cat) {
  fetch(`https://dummyjson.com/products/category/${cat}`)
    .then(res => res.json())
    .then(data => {
      allproducts = data.products;
      filterproducts = allproducts;
      currentpage = 1;
      render();
    });
}

/* DISPLAY PRODUCTS */
function displayProducts() {
  productList.innerHTML = "";

  let start = (currentpage - 1) * limit;
  let end = start + limit;

  const items = filterproducts.slice(start, end);

  items.forEach(product => {
    productList.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="pro-card">
          <img src="${product.thumbnail}" class="pro-img">
          <h5 class="pro-title">${product.title}</h5>

          <div class="price-box">
            <span class="new-price">₹${product.price}</span>
          </div>

          <button class="btn btn-primary w-100 mt-2" onclick='addToCart(${JSON.stringify(product)})'>
    Add to Cart
</button>


        </div>
      </div>`;
  });
}

/* PAGINATION */
function setupPagination() {
  pagination.innerHTML = "";

  const pages = Math.ceil(filterproducts.length / limit);

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

/* MAIN RENDER */
function render() {
  displayProducts();
  setupPagination();
}

/* ADD TO CART */
function addToCart(id) {

  const product = allproducts.find(p => p.id === id);
  if (!product) return;

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
}

// /* SAVE CART */
// function saveCart() {
//   localStorage.setItem("cart", JSON.stringify(cart));
// }
// function addToCart(product) {

//     const item = cart.find(c => c.id === product.id);

//     if (item) {
//         item.qty++;
//     } else {
//         cart.push({
//             id: product.id,
//             title: product.title,
//             price: product.price,
//             qty: 1
//         });
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));
// }
