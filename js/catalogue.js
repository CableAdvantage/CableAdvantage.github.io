document.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      document.querySelectorAll("[data-category]").forEach((section) => {
        const category = section.dataset.category;
        const categoryProducts = products.filter((p) => p.category === category);
        renderProducts(section, categoryProducts);
      });
    });
});

function renderProducts(container, products) {
  if (!products || products.length === 0) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  const outerContainer = document.createElement("div");
  outerContainer.className = "container";

  const row = document.createElement("div");
  row.className = "row justify-content-center";

  outerContainer.appendChild(row);
  container.appendChild(outerContainer);

  let visibleCount = 0;
  const perPage = 12;

  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.className = "btn btn-dark mt-4";
  loadMoreBtn.innerText = "Load More";
  loadMoreBtn.style.display = "none";
  loadMoreBtn.style.margin = "0 auto";
  container.appendChild(loadMoreBtn);

  let observer;

  function initObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && visibleCount < products.length) {
            renderNextBatch();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(loadMoreBtn);
  }

  function renderNextBatch() {
    const nextProducts = products.slice(visibleCount, visibleCount + perPage);

    nextProducts.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-6 col-md-3 product-card mb-4 fade-in"; 
      // col-6 = 2 per row mobile
      // col-md-3 = 4 per row desktop

      const card = document.createElement("div");
      card.className = "card product-Card h-100";

      const img = document.createElement("img");
      img.className = "card-img-top";
      img.alt = product.name;
      img.src = product.image.startsWith("http")
        ? product.image
        : `./${product.image}`;

      img.onerror = () => {
        img.src = "images/fallback.png";
      };

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h4");
      title.className = "card-title product-Title";
      title.innerText = `${product.name} - R${product.price}`;

      const specList = document.createElement("ul");
      product.specs.forEach((spec) => {
        const li = document.createElement("li");
        li.className = "product-Spec";
        li.textContent = spec;
        specList.appendChild(li);
      });

      const button = document.createElement("button");
      button.className = "btn btn-success product-Button mt-2";
      button.innerText = "Add to Cart";
      button.addEventListener("click", () => {
        addToCart(product);
      });

      body.appendChild(title);
      body.appendChild(specList);
      body.appendChild(button);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);
      row.appendChild(col);

      setTimeout(() => {
        col.classList.remove("fade-in");
      }, 400);
    });

    visibleCount += nextProducts.length;

    if (visibleCount < products.length) {
      loadMoreBtn.style.display = "block";

      if (!observer) {
        initObserver(); // only initialize after button becomes visible
      }
    } else {
      loadMoreBtn.style.display = "none";
      if (observer) observer.disconnect();
    }
  }

  // Load first 20 immediately (fixes mobile issue)
  renderNextBatch();
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

updateCartBadge();