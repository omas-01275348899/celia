import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let db;
let auth;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export function subscribeToProducts(onProducts, onError) {
  if (!db) return () => {};
  return onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      const products = snapshot.docs
        .map((product) => ({ id: product.id, ...product.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onProducts(products);
    },
    onError,
  );
}

export async function addProduct(product) {
  if (!db || !auth?.currentUser) throw new Error("unauthenticated");
  await addDoc(collection(db, "products"), {
    ...product,
    price: Number(product.price),
    createdAt: Date.now(),
  });
}

export async function createOrder(order) {
  if (!db) throw new Error("firebase-not-configured");
  const orderRef = doc(collection(db, "orders"));
  await setDoc(orderRef, {
    id: orderRef.id,
    items: order.items,
    total: Number(order.total),
    status: "new",
    createdAt: serverTimestamp(),
  });
  return { ...order, id: orderRef.id };
}

export function watchAdmin(onUser) {
  if (!auth) return () => onUser(null);
  return onAuthStateChanged(auth, onUser);
}

export async function adminSignIn(email, password) {
  if (!auth) throw new Error("firebase-not-configured");
  await signInWithEmailAndPassword(auth, email, password);
}

export async function adminSignOut() {
  if (auth) await signOut(auth);
}
