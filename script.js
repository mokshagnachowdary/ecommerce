// ================== GLOBAL STATE ==================


let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let user = JSON.parse(localStorage.getItem("user") || "null");


// ================== PAGE PROTECTION ==================
(function protectPages() {
  const protectedPages = [
    "product.html",
    "mobile.html",
    "laptops.html",
    "watches.html",
    "cart.html"
  ];

  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  // don't block login or admin pages
  if (protectedPages.includes(currentPage) && !user) {
    // no user -> go login
    window.location.href = "login.html";
  }
})();


// ================== ADD TO CART (REQUIRES LOGIN) ==================
window.addToCart = function (name, price) {
  if (!user) {
    alert("You must log in before adding items to your cart.");
    window.location.href = "login.html";
    return;
  }

  cart.push({ name, price: Number(price) });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
};


// ================== CART DISPLAY ==================
function showCartIfExists() {
  const box = document.getElementById("cart-items");
  const totalBox = document.getElementById("total");
  if (!box || !totalBox) return; // not on cart page

  let total = 0;
  box.innerHTML = "";

  for (const item of cart) {
    const price = Number(item.price) || 0;
    box.innerHTML += `<p>${item.name} - $${price.toFixed(2)}</p>`;
    total += price;
  }

  totalBox.innerText = "Total: $" + total.toFixed(2);
}


// ================== RESET CART BUTTON ==================
function attachResetBtn() {
  const btn = document.getElementById("reset-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    cart = [];
    showCartIfExists();
    alert("Cart reset!");
  });
}


// ================== LOGIN PAGE LOGIC ==================
function initLoginPage() {
  const form = document.getElementById("login-form");
  const statusEl = document.getElementById("login-status");
  if (!form) return; // not on login page

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      statusEl.textContent = "Please enter both username and password.";
      statusEl.style.color = "red";
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username }));
    statusEl.textContent = `Welcome, ${username}! Redirecting...`;
    statusEl.style.color = "green";

    setTimeout(() => {
      window.location.href = "product.html";
    }, 1200);
  });
}


// ================== ADMIN PAGE LOGIC ==================
function initAdminPage() {
  const box = document.getElementById("admin-cart-items");
  const totalBox = document.getElementById("admin-total");
  const adminUserDisplay = document.getElementById("admin-user");
  if (!box || !totalBox || !adminUserDisplay) return; // not admin page

  if (user) {
    adminUserDisplay.textContent = `Logged in as: ${user.username}`;
  } else {
    adminUserDisplay.textContent = "No user logged in.";
  }

  let total = 0;
  const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
  box.innerHTML = "";

  if (storedCart.length === 0) {
    box.innerHTML = "<p>No items in cart.</p>";
  } else {
    for (const item of storedCart) {
      const price = Number(item.price) || 0;
      box.innerHTML += `<p>${item.name} - $${price.toFixed(2)}</p>`;
      total += price;
    }
  }

  totalBox.textContent = "Total: $" + total.toFixed(2);

  const clearCartBtn = document.getElementById("admin-clear-cart");
  const clearAllBtn = document.getElementById("admin-clear-all");

  clearCartBtn?.addEventListener("click", () => {
    localStorage.removeItem("cart");
    alert("All cart data cleared!");
    location.reload();
  });

  clearAllBtn?.addEventListener("click", () => {
    localStorage.clear();
    alert("All stored data cleared (user + cart)!");
    location.reload();
  });
}


// ================== HELLO USER DISPLAY ==================
function showHelloUser() {
  const helloSpot = document.getElementById("hello-user");
  if (helloSpot && user && user.username) {
    helloSpot.innerText = `Hello, ${user.username}`;
  }
}


// ================== DOM READY HOOK ==================
document.addEventListener("DOMContentLoaded", () => {
  showHelloUser();
  showCartIfExists();
  attachResetBtn();
  initLoginPage();
  initAdminPage();
});
