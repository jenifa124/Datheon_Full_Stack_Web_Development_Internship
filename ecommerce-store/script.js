/**
 * E-Commerce Product Catalog & Interactive Shopping Cart
 * Task 4 – FakeStoreAPI + cart state, quantity math, tax/shipping, slide-out drawer
 */

const API_URL = "https://fakestoreapi.com/products";
const TAX_RATE = 0.08;
const SHIPPING_FLAT = 5.99;
const FREE_SHIPPING_THRESHOLD = 50;

// State
let products = [];
let filteredProducts = [];
let cart = []; // [{ id, title, price, image, quantity }]
let currentCategory = "all";
let searchQuery = "";

// DOM refs
const productsGrid = document.getElementById("productsGrid");
const loadingEl = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartBadge = document.getElementById("cartBadge");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");
const filterBtns = document.querySelectorAll(".filter-btn");

// ---------- Persistence ----------
function loadCart() {
  try {
    const saved = localStorage.getItem("shopHubCart");
    if (saved) cart = JSON.parse(saved);
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("shopHubCart", JSON.stringify(cart));
}

// ---------- Cart Actions ----------
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartUI();
}

function updateQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateCartUI();
}

function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}

// ---------- Render ----------
function stars(rate) {
  const full = Math.floor(rate);
  const half = rate % 1 >= 0.5 ? 1 : 0;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - half);
}

function mapCategory(cat) {
  if (cat === "electronics") return "Electronics";
  if (cat === "jewelery") return "Jewelry";
  if (cat.includes("clothing")) return "Clothing";
  return cat;
}

function renderProducts() {
  productsGrid.innerHTML = "";
  if (filteredProducts.length === 0) {
    emptyState.hidden = false;
    productCount.textContent = "0 products";
    return;
  }
  emptyState.hidden = true;
  productCount.textContent = `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`;

  filteredProducts.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <span class="badge">${mapCategory(p.category)}</span>
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="product-body">
        <h3 class="product-title">${p.title}</h3>
        <div class="product-rating">
          <span class="stars">${stars(p.rating.rate)}</span>
          <span>${p.rating.rate} (${p.rating.count})</span>
        </div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // Bind add buttons
  productsGrid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = products.find((p) => p.id === id);
      if (product) {
        addToCart(product);
        btn.textContent = "Added ✓";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = "Add to Cart";
          btn.disabled = false;
        }, 900);
      }
    });
  });
}

function updateCartUI() {
  // Badge
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  cartBadge.textContent = count;
  cartBadge.style.display = count > 0 ? "flex" : "none";

  // Items
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="qty-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Totals
  const { subtotal, tax, shipping, total } = calculateTotal();
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  shippingEl.textContent = shipping === 0 && subtotal > 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
  checkoutBtn.disabled = cart.length === 0;
}

// ---------- Filter / Search ----------
function applyFilters() {
  filteredProducts = products.filter((p) => {
    const catMatch =
      currentCategory === "all" ||
      (currentCategory === "clothing"
        ? p.category.includes("clothing")
        : p.category === currentCategory);
    const searchMatch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery);
    return catMatch && searchMatch;
  });
  renderProducts();
}

// ---------- Drawer & Modal ----------
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
  document.body.style.overflow = "";
}

function openCheckoutModal() {
  const { total } = calculateTotal();
  const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
  modalBody.innerHTML = `
    <h2>✓ Order Confirmed!</h2>
    <p>Thank you for your purchase.</p>
    <p class="order-id">${orderId}</p>
    <p>Total charged: <strong>$${total.toFixed(2)}</strong></p>
    <p style="font-size:0.9rem;margin-top:0.75rem;">A confirmation email has been sent (simulated).</p>
    <button class="modal-btn" id="doneBtn">Continue Shopping</button>
  `;
  checkoutModal.hidden = false;
  document.getElementById("doneBtn").addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckoutModal();
    closeCartDrawer();
  });
}

function closeCheckoutModal() {
  checkoutModal.hidden = true;
}

// ---------- Events ----------
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    applyFilters();
  });
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  applyFilters();
});

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);
closeModal.addEventListener("click", closeCheckoutModal);

cartItems.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  if (e.target.classList.contains("remove-btn")) {
    removeFromCart(id);
  } else if (e.target.dataset.action === "inc") {
    updateQuantity(id, 1);
  } else if (e.target.dataset.action === "dec") {
    updateQuantity(id, -1);
  }
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  openCheckoutModal();
});

// ---------- Init ----------
async function init() {
  loadCart();
  updateCartUI();
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch products");
    products = await res.json();
    loadingEl.hidden = true;
    applyFilters();
  } catch (err) {
    loadingEl.innerHTML = `<p style="color:var(--danger)">Error loading products. Please refresh.</p>`;
    console.error(err);
  }
}

init();
