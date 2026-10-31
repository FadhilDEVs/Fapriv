# Fapriv 🚀

Arsitektur fondasi website modern yang cepat, terstruktur, dan aman, dibangun menggunakan **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Supabase**, dan siap dideploy langsung ke **Vercel**.

---

## 🛠️ Tech Stack & Ekosistem

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev/) (dengan `@tailwindcss/vite`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Deployment**: [Vercel](https://vercel.com/) (Pre-configured SPA routing via `vercel.json`)
- **Version Control**: [GitHub](https://github.com/FadhilDEVs/Fapriv)

---

## 📁 Struktur Direktori Modular

```text
Fapriv/
├── .env.example             # Template variabel lingkungan (aman, tanpa secret)
├── .gitignore               # Konfigurasi proteksi file rahasia & build
├── index.html               # Entri HTML utama dengan font Plus Jakarta Sans
├── package.json             # Dependensi & script eksekusi
├── tsconfig.json            # Konfigurasi root TypeScript
├── tsconfig.app.json        # Pengaturan TypeScript untuk aplikasi frontend (path alias @/*)
├── tsconfig.node.json       # Pengaturan TypeScript untuk Vite config
├── vercel.json              # Konfigurasi rewrite SPA & HTTP caching untuk Vercel
├── vite.config.ts           # Konfigurasi plugin Tailwind v4 & path alias Vite
└── src/
    ├── assets/              # Asset statis, gambar, dan ikon SVG
    ├── components/
    │   ├── common/          # Komponen UI atomik reusable (Button, Badge, Card)
    │   └── layout/          # Komponen struktur layout (Navbar, Footer, Layout)
    ├── config/
    │   └── env.ts           # Validasi dan abstraksi tipe environment variable
    ├── hooks/
    │   └── useSupabaseStatus.ts # Hook reaktif status koneksi Supabase
    ├── lib/
    │   ├── supabase.ts      # Inisialisasi Supabase client singleton & connectivity test
    │   └── utils.ts         # Helper utilitas merge classnames (clsx + tailwind-merge)
    ├── services/
    │   └── api.ts           # Layer abstraksi query API & Supabase database
    ├── types/
    │   ├── database.ts      # Skema TypeScript PostgreSQL Supabase
    │   └── index.ts         # Definisi tipe umum aplikasi
    ├── App.tsx              # Komponen utama halaman dashboard fondasi
    ├── index.css            # Desain sistem global & import Tailwind CSS
    └── main.tsx             # Root mounting React DOM
```

---

## ⚡ Memulai Proyek (Local Development)

### 1. Prasyarat
- **Node.js** (v18.0.0 atau lebih baru direkomendasikan)
- **npm** (v9 atau lebih baru)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Bash / macOS / Linux
cp .env.example .env
```

Buka file `.env` dan masukkan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

> 🔒 **Keamanan Terjamin**: File `.env` sudah dimasukkan ke dalam `.gitignore` sehingga tidak akan pernah ter-commit atau bocor ke repository GitHub.

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat [http://localhost:5173](http://localhost:5173).

---

## 🧪 Validasi Kualitas Kode & Build

Jalankan typecheck dan bundling produksi:

```bash
# Typecheck TypeScript & Build produksi
npm run build

# Menjalankan preview build lokal
npm run preview

# Linter
npm run lint
```

---

## 🚀 Panduan Deployment ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New Project**.
2. Hubungkan repository GitHub: `FadhilDEVs/Fapriv`.
3. Vercel akan otomatis mendeteksi framework **Vite**.
4. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Klik **Deploy**. Konfigurasi routing telah disiapkan di `vercel.json` sehingga routing halaman SPA akan berjalan mulus.

---

## 📌 Status Fondasi

Fondasi teknis telah siap 100%. Pengembangan fitur bisnis, alur pengguna, skema database tabel, dan logika halaman akan diimplementasikan sesuai konsep yang diberikan.
