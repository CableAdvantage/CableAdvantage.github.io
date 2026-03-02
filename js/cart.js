const CART_KEY = "computerhub_cart";

// Load cart from localStorage
function loadCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
  const cart = loadCart();
  const existing = cart.find(p => p.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  alert(`${item.name} added to cart.`);
}

// Remove item from cart
function removeFromCart(id) {
  let cart = loadCart();
  cart = cart.filter(p => p.id !== id);
  saveCart(cart);
  updateCartBadge();
  renderCart?.(); // only call if renderCart exists
}

// Update quantity
function updateQuantity(id, qty) {
  const cart = loadCart();
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty = qty;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart);
    renderCart?.();
    updateCartBadge();
  }
}

// Render cart contents (for cart.html)
function renderCart() {
  const cart = loadCart();
  const container = document.getElementById("cartItems");
  const totalContainer = document.getElementById("cartTotal");

  if (!container || !totalContainer) return;

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    totalContainer.innerHTML = "";
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="card mb-3">
        <div class="row g-0 align-items-center">
          <div class="col-md-2">
            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">Price: R${item.price.toFixed(2)}</p>
              <p class="card-text">Qty: 
                <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="form-control qty-input" style="width: 80px; display: inline-block;">
              </p>
            </div>
          </div>
          <div class="col-md-2 text-end">
            <p class="card-text">Subtotal: R${subtotal.toFixed(2)}</p>
          </div>
          <div class="col-md-2 text-end">
            <button class="btn btn-danger remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  totalContainer.innerHTML = `<h4 style="color:black;">Total: R${total.toFixed(2)}</h4>`;

  // Event listeners
  document.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
  );

  document.querySelectorAll(".qty-input").forEach(input =>
    input.addEventListener("change", () =>
      updateQuantity(input.dataset.id, parseInt(input.value))
    )
  );
}

// Update cart badge in navbar
function updateCartBadge() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

// Listen to dynamically rendered "Add to Cart" buttons
document.addEventListener("click", e => {
  if (e.target && e.target.classList.contains("add-to-cart")) {
    const btn = e.target;
    const item = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      image: btn.dataset.image
    };
    addToCart(item);
  }
});

// On page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (typeof renderCart === "function") {
    renderCart();
  }

  document.addEventListener("DOMContentLoaded", () => {
  const deliveryFields = document.getElementById("deliveryFields");
  const deliveryRadio = document.getElementById("deliveryRadio");
  const collectionRadio = document.getElementById("collectionRadio");

  function toggleDeliveryFields() {
    if (collectionRadio.checked) {
      deliveryFields.style.display = "none";
    } else {
      deliveryFields.style.display = "block";
    }
  }

  toggleDeliveryFields(); // initial check

  deliveryRadio.addEventListener("change", toggleDeliveryFields);
  collectionRadio.addEventListener("change", toggleDeliveryFields);
});


  
});
