import {
  addProduct,
  adminSignIn,
  adminSignOut,
  isFirebaseConfigured,
  watchAdmin,
} from "./firebase.js";

const setupMessage = document.getElementById("setupMessage");
const loginCard = document.getElementById("loginCard");
const productCard = document.getElementById("productCard");
const formStatus = document.getElementById("formStatus");

function show(card) {
  [setupMessage, loginCard, productCard].forEach((item) => (item.hidden = item !== card));
}

if (!isFirebaseConfigured) {
  show(setupMessage);
} else {
  watchAdmin((user) => show(user ? productCard : loginCard));
}

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true;
  try {
    await adminSignIn(document.getElementById("email").value, document.getElementById("password").value);
  } catch {
    alert("تعذر تسجيل الدخول. تأكدي من البريد وكلمة المرور.");
  } finally {
    button.disabled = false;
  }
});

document.getElementById("productForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true;
  formStatus.textContent = "جارٍ نشر المنتج...";
  try {
    await addProduct({
      name: document.getElementById("name").value.trim(),
      price: document.getElementById("price").value,
      category: document.getElementById("category").value,
      image: document.getElementById("image").value.trim(),
      tag: document.getElementById("tag").value.trim(),
    });
    event.target.reset();
    formStatus.textContent = "تم نشر المنتج، وسيظهر للعملاء فورًا.";
  } catch (error) {
    formStatus.textContent = error.message === "unauthenticated" ? "انتهت الجلسة. سجّلي الدخول مجددًا." : "تعذر حفظ المنتج. تحققي من إعدادات Firebase وقواعد Firestore.";
  } finally {
    button.disabled = false;
  }
});

document.getElementById("signOut").addEventListener("click", adminSignOut);
