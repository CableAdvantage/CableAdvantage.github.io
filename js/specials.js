document.addEventListener("DOMContentLoaded", () => {
  fetch("data/featured.json")
    .then((res) => res.json())
    .then((products) => {
      if (window.innerWidth < 768) {
        renderMobileCarousel(products);
      } else {
        renderDesktopCarousel(products);
      }
    });
});

function renderDesktopCarousel(products) {
  const carouselInner = document.querySelector("#multiCardCarousel .carousel-inner");
  carouselInner.innerHTML = "";

  const slides = chunkArray(products, 3);

  slides.forEach((group, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    item.classList.add("carousel-fixed-height");

    const row = document.createElement("div");
    row.className = "row justify-content-center h-100";

    group.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6 h-100";

      const card = document.createElement("div");
      card.className = "card product-Card text-center border-0 h-100";

      const img = document.createElement("img");
      img.className = "card-img-top img-fluid h-100 w-100";
      img.src = product.image;
      img.alt = product.name;
      img.style.objectFit = "cover";

      card.appendChild(img);
      col.appendChild(card);
      row.appendChild(col);
    });

    item.appendChild(row);
    carouselInner.appendChild(item);
  });

  const carouselElement = document.getElementById("multiCardCarousel");
  if (carouselElement) {
    carouselElement.classList.add("carousel-desktop-height");
  }
}

function renderMobileCarousel(products) {
  const carouselInner = document.querySelector("#multiCardCarousel .carousel-inner");
  carouselInner.innerHTML = "";

  products.forEach((product, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    item.classList.add("carousel-fixed-height");

    const row = document.createElement("div");
    row.className = "row justify-content-center";

    const col = document.createElement("div");
    col.className = "col-10 col-sm-8 mx-auto";

    const card = document.createElement("div");
    card.className = "card product-Card text-center border-0";

    const img = document.createElement("img");
    img.className = "card-img-top img-fluid w-100";
    img.src = product.image;
    img.alt = product.name;
    img.style.height = "250px";
    img.style.objectFit = "cover";

    card.appendChild(img);
    col.appendChild(card);
    row.appendChild(col);
    item.appendChild(row);
    carouselInner.appendChild(item);
  });

  const carouselElement = document.getElementById("multiCardCarousel");
  if (carouselElement) {
    carouselElement.classList.add("carousel-desktop-height");
  }
}

function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("computerhub_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}
