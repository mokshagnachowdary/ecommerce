// Always load or initialize cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Make function global for inline onclick (on product page)
window.addToCart = function(name, price) {
  cart.push({ name, price: Number(price) });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
};

// ✅ Show cart contents (on cart page)
window.showCart = function() {
  const box = document.getElementById("cart-items");
  const totalBox = document.getElementById("total");
  if (!box || !totalBox) return; // Not on cart page

  let total = 0;
  box.innerHTML = "";

  for (const item of cart) {
    const price = Number(item.price) || 0;
    box.innerHTML += `<p>${item.name} - $${price.toFixed(2)}</p>`;
    total += price;
  }

  totalBox.innerText = "Total: $" + total.toFixed(2);
};

// ✅ Reset cart function
window.resetCart = function() {
  localStorage.removeItem("cart"); // Clear saved data
  cart = []; // Empty in-memory array
  showCart(); // Refresh cart display
  alert("Cart has been reset!");
};

// ✅ Run showCart() on load if the page has a cart section
document.addEventListener("DOMContentLoaded", () => {
  showCart();

  // Attach reset button event if it exists
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetCart);
  }
});


// lOGIN PAGE 

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginStatus = document.getElementById("login-status");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        loginStatus.textContent = "Please enter both username and password.";
        loginStatus.style.color = "red";
        return;
      }

      // Save login info to localStorage (demo use)
      localStorage.setItem("user", JSON.stringify({ username }));
      loginStatus.textContent = `Welcome, ${username}! Redirecting...`;
      loginStatus.style.color = "green";

      // Redirect to home page after login
      setTimeout(() => {
        window.location.href = "product.html";
      }, 1200);
    });
  }
});

//ADMIN 
document.addEventListener("DOMContentLoaded", () => {
  const adminCartBox = document.getElementById("admin-cart-items");
  const adminTotalBox = document.getElementById("admin-total");
  const adminUserDisplay = document.getElementById("admin-user");

  // Only run this if we're on the admin page
  if (adminCartBox && adminTotalBox) {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      adminUserDisplay.textContent = `Logged in as: ${currentUser.username}`;
    } else {
      adminUserDisplay.textContent = "No user logged in.";
    }

    let total = 0;
    adminCartBox.innerHTML = "";

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      adminCartBox.innerHTML = "<p>No items in cart.</p>";
    } else {
      for (const item of storedCart) {
        const price = Number(item.price) || 0;
        adminCartBox.innerHTML += `<p>${item.name} - $${price.toFixed(2)}</p>`;
        total += price;
      }
    }

    adminTotalBox.textContent = "Total: $" + total.toFixed(2);

    // Admin clear buttons
    const clearCartBtn = document.getElementById("admin-clear-cart");
    const clearAllBtn = document.getElementById("admin-clear-all");

    clearCartBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      alert("All cart data cleared!");
      location.reload();
    });

    clearAllBtn.addEventListener("click", () => {
      localStorage.clear();
      alert("All stored data cleared (including user + cart)!");
      location.reload();
    });
  }
});

