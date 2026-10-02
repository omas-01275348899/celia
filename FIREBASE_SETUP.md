# ربط المتجر بـ Firebase

1. أنشئي مشروع Firebase وسجّلي تطبيق Web، ثم انسخي كائن `firebaseConfig` إلى `firebase-config.js`.
2. من **Firestore Database** أنشئي قاعدة بيانات Cloud Firestore.
3. من **Authentication > Sign-in method** فعّلي **Email/Password**، ثم أنشئي مستخدم الإدارة من تبويب **Users**.
4. انسخي UID الخاص بمستخدم الإدارة إلى `firestore.rules.example` بدل `PUT_ADMIN_UID_HERE`، ثم الصقي القواعد في تبويب **Rules** داخل Firestore وانشريها.
5. ارفعي الملفات إلى استضافتك. بعد ذلك سجّلي الدخول من `add-product.html`، وأضيفي المنتج. ستظهر المنتجات في الصفحة الرئيسية مباشرة عبر التحديث الحي.
6. تُحفظ الطلبات في مجموعة `orders` تلقائيًا عند إتمام الشراء. لا تحتاجين إلى إنشاء المجموعات يدويًا؛ ينشئها Firestore عند أول كتابة. يمكن لحساب الإدارة فقط قراءة الطلبات من Firebase Console، بينما يستطيع الزوار إنشاء طلب.

الصور في النسخة الحالية تُضاف كرابط صورة. إن رغبتِ في رفع الصورة من الجهاز، يمكن إضافة Firebase Storage لاحقًا. إنشاء قاعدة Firestore نفسها يتم مرة واحدة من **Firestore Database > Create database** في Firebase Console قبل استقبال أول طلب أو منتج.
