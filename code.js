




let cart = JSON.parse(localStorage.getItem("lumiere-cart") || "[]"),
  activeFilter = "الكل",
  expanded = false;
const grid = document.getElementById("productGrid"),
  cartPanel = document.getElementById("cartPanel"),
  overlay = document.getElementById("overlay"),
  money = (n) => `${n.toLocaleString("ar-EG")} ج.م`;
const mobileMenu = document.querySelector(".mobile-menu"),
  mainNav = document.getElementById("mainNav");

function closeMobileMenu() {
  mainNav.classList.remove("open");
  mobileMenu.setAttribute("aria-expanded", "false");
}

mobileMenu.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", closeMobileMenu),
);

document.addEventListener("click", (event) => {
  if (!mainNav.contains(event.target) && !mobileMenu.contains(event.target)) {
    closeMobileMenu();
  }
});
function renderProducts() {
  let all = products.filter(
      (p) => activeFilter === "الكل" || p.category === activeFilter,
    ),
    shown = expanded ? all : all.slice(0, 4);
  grid.innerHTML = shown
    .map(
      (p) =>
        `<article class="product-card"><div class="product-image" style="background-image:url('${p.image}')">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}<button class="add-product" onclick="addToCart(${p.id})" aria-label="إضافة ${p.name}">+</button></div><div class="product-info"><h3>${p.name}</h3><p>${money(p.price)}</p></div></article>`,
    )
    .join("");
  document.getElementById("showMore").style.display =
    shown.length >= all.length ? "none" : "flex";
}
function save() {
  localStorage.setItem("lumiere-cart", JSON.stringify(cart));
}
function addToCart(id) {
  const product = products.find((p) => p.id === id),
    found = cart.find((p) => p.id === id);
  found ? found.qty++ : cart.push({ ...product, qty: 1 });
  save();
  renderCart();
  const t = document.getElementById("toast");
  t.textContent = "تمت إضافة المنتج إلى السلة ✦";
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2300);
}
function removeFromCart(id) {
  cart = cart.filter((p) => p.id !== id);
  save();
  renderCart();
}
function renderCart() {
  const items = document.getElementById("cartItems"),
    count = cart.reduce((s, p) => s + p.qty, 0),
    total = cart.reduce((s, p) => s + p.price * p.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("totalPrice").textContent = money(total);
  items.innerHTML = cart.length
    ? cart
        .map(
          (p) =>
            `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${money(p.price)} × ${p.qty}</p></div><button class="remove-item" onclick="removeFromCart(${p.id})">×</button></div>`,
        )
        .join("")
    : '<div class="empty-cart">سلتك ما زالت فارغة<br><small>ابدئي باختيار ما تحبين</small></div>';
}
document.querySelectorAll(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    expanded = false;
    document
      .querySelectorAll(".filter")
      .forEach((b) => b.classList.toggle("active", b === btn));
    renderProducts();
  }),
);
document.querySelectorAll(".category-card").forEach((a) =>
  a.addEventListener("click", () => {
    activeFilter = a.dataset.category;
    expanded = true;
    document
      .querySelectorAll(".filter")
      .forEach((b) =>
        b.classList.toggle("active", b.dataset.filter === activeFilter),
      );
    setTimeout(renderProducts, 0);
  }),
);
document.getElementById("showMore").onclick = () => {
  expanded = true;
  renderProducts();
};
function toggleCart(open) {
  cartPanel.classList.toggle("open", open);
  overlay.classList.toggle("open", open);
}
document.getElementById("cartBtn").onclick = () => toggleCart(true);
document.getElementById("closeCart").onclick = () => toggleCart(false);
overlay.onclick = () => toggleCart(false);
document.getElementById("checkoutBtn").onclick = () => {
  if (!cart.length) {
    const t = document.getElementById("toast");
    t.textContent = "أضيفي منتجاً واحداً على الأقل أولاً";
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2300);
    return;
  }
  const order = {
    id: `LM-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
    items: cart,
    total: cart.reduce((s, p) => s + p.price * p.qty, 0),
  };
  localStorage.setItem("lumiere-order", JSON.stringify(order));
  cart = [];
  save();
  renderCart();
  toggleCart(false);
  showOrders();
};
function showOrders() {
  const order = JSON.parse(localStorage.getItem("lumiere-order"));
  document.querySelector("main").style.display = "none";
  document.querySelector("footer").style.display = "none";
  document.querySelector(".header").style.display = "none";
  document.querySelector(".announcement").style.display = "none";
  document.getElementById("ordersPage").classList.add("visible");
  document.getElementById("orderContent").innerHTML = order
    ? `<div class="success-card"><h2>تم تأكيد طلبك بنجاح ✦</h2><p>سنبدأ بتجهيز طلبك الآن، وسنتواصل معك لتأكيد بيانات التوصيل.</p></div><div class="order-card"><div class="order-card-head"><b>طلب رقم ${order.id}</b><span>قيد التجهيز</span></div><div class="order-line"><span>تاريخ الطلب</span><span>${order.date}</span></div>${order.items.map((p) => `<div class="order-line"><span>${p.name} × ${p.qty}</span><span>${money(p.price * p.qty)}</span></div>`).join("")}<div class="order-total"><b>الإجمالي</b><b>${money(order.total)}</b></div></div>`
    : '<div class="success-card"><h2>لا توجد طلبات بعد</h2><p>تصفحي مجموعتنا واختاري ما يناسبك.</p></div>';
}
document.getElementById("backToStore").onclick = () => {
  document.getElementById("ordersPage").classList.remove("visible");
  document.querySelector("main").style.display = "block";
  document.querySelector("footer").style.display = "flex";
  document.querySelector(".header").style.display = "grid";
  document.querySelector(".announcement").style.display = "block";
  window.scrollTo(0, 0);
};
document.getElementById("searchBtn").onclick = () =>
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
renderProducts();
renderCart();
