document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      const cart = JSON.parse(localStorage.getItem("computerhub_cart") || "[]");

      if (cart.length === 0) {
        e.preventDefault();
        alert("Your cart is empty. Please add items before submitting.");
        return;
      }

      const orderDetailsInput = document.getElementById("orderText");

      // Create readable order summary
      let message = cart
        .map(
          (item) =>
            `${item.name} (x${item.qty}) - R${(item.price * item.qty).toFixed(
              2
            )}`
        )
        .join("\n");

      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      message += `\n\nTotal: R${total.toFixed(2)}`;

      orderDetailsInput.value = message;
    });
  }
});

form.addEventListener("submit", (e) => {
  // ... build and insert orderDetails as above

  // Wait 2 seconds and clear cart
  setTimeout(() => {
    localStorage.removeItem("computerhub_cart");
  }, 2000);
});
