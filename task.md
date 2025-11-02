# MERN E-Ticaret Yapılacaklar Listesi

## Hazırlık
- [ ] Monorepo’yu oluştur (`ecommerce/` klasörü).
- [ ] `client/` ve `server/` klasörlerini ekle.
- [ ] Kök dosyaları ekle: `.editorconfig`, `.gitignore`, `README.md`.
- [ ] Örnek env dosyaları ekle: `server/.env.example`, `client/.env.example`.

## Server – Temel Kurulum
- [ ] Node + TypeScript init (`tsconfig.json`).
- [ ] `app.ts` ve `server.ts` oluştur.
- [ ] MongoDB bağlantısı (`MONGO_URI`).
- [ ] CORS ayarlarını `CLIENT_URL` ile sınırla.
- [ ] Global `errorHandler` ve `notFound` middleware.

## Server – Güvenlik ve Orta Katmanlar
- [ ] `rateLimit` middleware’i ekle.
- [ ] `validate` (zod) altyapısı.
- [ ] JWT `auth` middleware (user/admin).
- [ ] Parola hashing (bcrypt).

## Server – Modeller
- [ ] `User` modeli.
- [ ] `Product` modeli.
- [ ] `Order` modeli.
- [ ] `Review` modeli.
- [ ] Gerekli MongoDB index’leri.

## Server – Auth API
- [ ] `POST /auth/register`.
- [ ] `POST /auth/login`.
- [ ] `GET /auth/me`.

## Server – Ürün API
- [ ] `GET /products`.
- [ ] `GET /products/:slug`.
- [ ] `POST /products` (admin).
- [ ] `PUT /products/:id` (admin).
- [ ] `DELETE /products/:id` (admin).

## Server – Sipariş & Ödeme API
- [ ] `POST /orders` (auth gerekli).
- [ ] `GET /orders/my`.
- [ ] `GET /orders/:id`.
- [ ] `PUT /orders/:id/status` (admin).
- [ ] `POST /payments/create-intent` (Stripe/Iyzico).

## Client – Temel Kurulum
- [ ] Vite + React + TS kurulumu.
- [ ] `app/store.ts` oluştur (RTK).
- [ ] `routes.tsx` yönlendirmeleri.
- [ ] Axios instance `withCredentials:true`.

## Client – Ekranlar
- [ ] Auth sayfaları: Kayıt/Giriş.
- [ ] Ürün listeleme.
- [ ] Ürün detay.
- [ ] Sepet yönetimi.
- [ ] Checkout (adres + ödeme).
- [ ] Sipariş onay sayfası.

## Client – Admin Ekranları
- [ ] Ürün CRUD paneli.
- [ ] Sipariş yönetimi (durum güncelleme).

## Testler
- [ ] Server: Jest + Supertest.
- [ ] Ürün endpoint’leri testleri.
- [ ] Client: RTL testleri.
- [ ] Postman koleksiyonu.

## Dağıtım & CI/CD
- [ ] Dockerfile(lar).
- [ ] Prod env değişkenleri.
- [ ] Frontend dağıtımı (Nginx/S3).
- [ ] GitHub Actions CI (lint, test, build).
- [ ] PM2 veya container orkestrasyonu.
