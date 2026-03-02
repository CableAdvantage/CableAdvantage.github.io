document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");

  function generateOrderNumber() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${yyyy}${mm}${dd}-${rand}`;
  }

  if (!form) return;

  form.addEventListener("submit", function(e) {
    const cart = JSON.parse(localStorage.getItem("computerhub_cart")) || [];
    if (cart.length === 0) {
      e.preventDefault();
      alert("Your cart is empty. Please add items before submitting.");
      return;
    }

    const orderType = document.querySelector('input[name="orderType"]:checked')?.value || "Delivery";
    const name = document.getElementById("customerName")?.value.trim() || "N/A";

    let street = "", area = "", city = "", zip = "";
    if (orderType === "Delivery") {
      // Require delivery address only if Delivery is selected
      street = document.getElementById("streetAddress")?.value.trim();
      area = document.getElementById("area")?.value.trim();
      city = document.getElementById("city")?.value.trim();
      zip = document.getElementById("zipCode")?.value.trim();

      if (!street || !area || !city || !zip) {
        e.preventDefault();
        alert("Please complete all delivery address fields for delivery orders.");
        return;
      }
    }

    const deliveryAddress = orderType === "Delivery" ? `${street}, ${area}, ${city}, ${zip}` : "N/A";
    const orderNumber = generateOrderNumber();

    // Hidden input for Web3Forms email
    const orderDetailsInput = document.getElementById("orderDetails");
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    let orderText = `Order Number: ${orderNumber}\nOrder Type: ${orderType}\n`;
    if (orderType === "Delivery") orderText += `Delivery Address: ${deliveryAddress}\n`;
    orderText += `\nItems:\n`;
    cart.forEach(item => {
      orderText += `${item.name} (x${item.qty}) - R${(item.price * item.qty).toFixed(2)}\n`;
    });
    orderText += `\nTotal: R${total.toFixed(2)}`;
    orderDetailsInput.value = orderText;

    // Generate PDF invoice
    const doc = new jspdf.jsPDF();
    const logo = new Image();
    logo.src = "images/logo.jpg";

    logo.onload = () => {
      doc.setFontSize(18);
      doc.text("INVOICE", 10, 20);
      doc.setFontSize(12);
      doc.text(`Order Number: ${orderNumber}`, 10, 26);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 34);
      doc.text(`Customer: ${name}`, 10, 41);
      doc.text(`Order Type: ${orderType}`, 10, 48);

      if (orderType === "Delivery") {
        doc.text("Delivery Address:", 10, 55);
        doc.text(street, 10, 61);
        doc.text(`${area}, ${city}, ${zip}`, 10, 67);
      }

      // Company addresses on right
      doc.text("Unit C12, 11 Havelock Rd,", 120, 55);
      doc.text("Willow Park Manor, Pretoria, 0184", 120, 61);
      doc.text("599 Smook Ave, Roseville,", 120, 71);
      doc.text("Pretoria, 0084", 120, 77);

      doc.addImage(logo, "JPEG", 150, 10, 40, 30);

      const rows = cart.map(item => [item.name, item.qty.toString(), "R" + (item.price * item.qty).toFixed(2)]);
      doc.autoTable({
        startY: 90,
        head: [["Description", "Quantity", "Price"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        foot: [["", "Total", "R" + total.toFixed(2)]],
        footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: "bold" }
      });

      let y = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.text("Thank you for your business!", 10, y);
      y += 10;
      doc.text("Payment Details:", 10, y);
      doc.text("Bank: FNB", 10, y + 6);
      doc.text("Account Name: Computer Hub", 10, y + 12);
      doc.text("Account Number: 1234567890", 10, y + 18);
      doc.text("Branch Code: 250655", 10, y + 24);

      y += 40;
      doc.setFontSize(11);
      doc.text("Orders will only be processed once payment has been received and proof of payment sent.", 10, y);
      doc.text("Please Email Proof of Payment to: pierre@cableadvantage.co.za.", 10, y + 10);
      doc.text("Please make your reference your Name + Order Number", 10, y + 16);
      doc.text("Deliveries can take 3 to 5 business days.", 10, y + 22);

      // Auto-download PDF
      doc.save(`ComputerHub_Invoice_${orderNumber}.pdf`);
    };

    // Clear cart after submission
    setTimeout(() => {
      localStorage.removeItem("computerhub_cart");
    }, 2000);
  });
});
