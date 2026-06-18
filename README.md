# 📸 Scanin Frontend

**Scanin** adalah platform web modern untuk memindai dan mendigitalisasi catatan (notes) Anda dengan mudah. Dibangun dengan fokus pada performa, pengalaman pengguna (UX) premium, dan antarmuka (UI) yang memanjakan mata.

Repository ini berisi kode sumber untuk bagian **Frontend** dari aplikasi Scanin.

## ✨ Fitur Utama

- **Landing Page Interaktif**: Dilengkapi dengan animasi scroll premium yang mulus.
- **Video Preview Animasi**: Menampilkan demonstrasi video *autoplay* di dalam mockup tablet dengan ukuran file yang sangat dioptimalkan untuk mempercepat *load time*.
- **Smart Navigation**: Navbar modern dengan efek *glassmorphism* yang responsif dan dinamis, menyesuaikan ukuran dan bentuk saat pengguna melakukan *scroll*.
- **Modern Tech Stack**: Dibangun menggunakan Next.js 15 (App Router) terbaru untuk performa maksimal dan SEO yang baik.
- **Custom Domain Ready**: Sudah dikonfigurasi untuk terhubung dengan mulus ke domain kustom (`notescanin.web.id`) dengan penyesuaian origin dan CORS yang diperlukan.
- **Desain Responsif**: Antarmuka yang dioptimalkan dengan sempurna untuk perangkat *mobile* maupun *desktop*.
- **Animasi Tingkat Lanjut**: Memanfaatkan Framer Motion untuk transisi komponen yang elegan bergaya Apple/Vercel.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan tumpukan teknologi (*Tech Stack*) modern:

- **[Next.js 15](https://nextjs.org/)** - React Framework (App Router)
- **[React](https://react.dev/)** - UI Library
- **[TypeScript](https://www.typescriptlang.org/)** - Static Typing
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework untuk styling cepat dan konsisten
- **[Framer Motion](https://www.framer.com/motion/)** - Library animasi untuk React
- **[Lucide React](https://lucide.dev/)** - Icon pack

## 🚀 Cara Menjalankan Project (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (disarankan versi 18.x atau terbaru)
- npm, yarn, pnpm, atau bun

### 2. Instalasi Dependensi
Buka terminal, masuk ke direktori `frontend`, dan jalankan perintah instalasi:

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Menjalankan Server Pengembangan
Setelah instalasi selesai, jalankan *development server*:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya. Halaman akan otomatis melakukan *hot-reload* jika Anda melakukan perubahan kode di `src/app/page.tsx`.

## 📂 Struktur Direktori Utama

- `src/app/` : Berisi konfigurasi routing utama Next.js (App Router), halaman (`page.tsx`), dan layout (`layout.tsx`).
- `src/components/ui/` : Kumpulan komponen antarmuka yang *re-usable* (seperti `mini-navbar.tsx` dan `container-scroll-animation.tsx`).
- `public/` : Aset statis seperti gambar, ikon, dan font.

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda ingin menambahkan fitur, memperbaiki bug, atau meningkatkan desain:
1. *Fork* repository ini.
2. Buat *branch* fitur Anda (`git checkout -b feature/FiturKeren`).
3. Lakukan *commit* untuk perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4. *Push* ke branch (`git push origin feature/FiturKeren`).
5. Buat *Pull Request*.

---
Dibuat dengan ❤️ oleh Tim Scanin.
