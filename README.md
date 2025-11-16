<h1 align="center">🗺️ JelajahKita</h1>

<p align="center">
  Platform Pemetaan & Eksplorasi UMKM Lokal Indonesia
</p>

<p align="center">
  <a href="#tentang-aplikasi"><strong>Tentang</strong></a> ·
  <a href="#fitur-utama"><strong>Fitur</strong></a> ·
  <a href="#teknologi"><strong>Teknologi</strong></a> ·
  <a href="#instalasi"><strong>Instalasi</strong></a> ·
  <a href="#struktur-project"><strong>Struktur</strong></a> ·
  <a href="#kontribusi"><strong>Kontribusi</strong></a>
</p>

<br/>

## 📖 Tentang Aplikasi

**JelajahKita** adalah platform web interaktif yang membantu masyarakat menemukan dan mengeksplorasi Usaha Mikro Kecil dan Menengah (UMKM) di sekitar mereka. Dengan teknologi peta interaktif dan AI Assistant, JelajahKita mempermudah pencarian UMKM lokal berdasarkan lokasi, kategori, dan preferensi pengguna.

### 🎯 Tujuan

- Meningkatkan visibilitas UMKM lokal
- Mempermudah masyarakat menemukan produk dan layanan UMKM terdekat
- Mendukung digitalisasi dan pertumbuhan UMKM Indonesia
- Membangun ekosistem ekonomi lokal yang lebih kuat

---

## ✨ Fitur Utama

### 🗺️ **Interactive Map**
- Peta interaktif berbasis MapLibre GL dengan multiple viewing modes (Default, 3D, Satellite)
- Real-time location tracking dengan marker user
- Clustering untuk visualisasi UMKM yang lebih baik
- Filter berdasarkan kategori (Kuliner, Fashion, Kerajinan, Jasa, dll)
- Search & filter UMKM dengan autocomplete

### 🤖 **AI Assistant**
- AI Chatbot dengan kemampuan multimodal (text + image search)
- RAG (Retrieval-Augmented Generation) untuk rekomendasi UMKM yang akurat
- Function calling untuk navigasi otomatis dan detail UMKM
- Image-based search untuk mencari UMKM berdasarkan foto produk

### 🏪 **UMKM Management**
- Dashboard lengkap untuk pengelolaan UMKM
- Multi-step form untuk menambah/edit UMKM
- Upload foto produk dan galeri UMKM
- Manajemen katalog produk dengan harga
- Pengaturan jam operasional per hari
- Integrasi link media sosial (Instagram, Facebook, Website)
- Coordinate picker untuk lokasi akurat
- Automatic address lookup dengan reverse geocoding

### 🧭 **Navigation System**
- Turn-by-turn navigation dengan visualisasi rute
- Perhitungan jarak dan estimasi waktu
- Real-time route tracking
- Clear route instructions

### 💬 **Chat & Review System**
- Direct messaging antara user dan pemilik UMKM
- Real-time chat dengan persistent history
- Review & rating system dengan bintang 1-5
- Statistik rating dengan distribusi bar chart
- Upload foto pada review

### 👤 **User Profile**
- Manajemen profil pengguna lengkap
- View dan edit informasi pribadi
- Daftar UMKM yang dimiliki
- History review dan chat

### 🎨 **Modern UI/UX**
- Responsive design untuk mobile dan desktop
- Smooth animations dengan Framer Motion
- Bottom sheet style untuk mobile
- Draggable chat popup untuk desktop
- Dark mode ready components
- Loading states dan skeleton loaders

---

## 🛠️ Teknologi

### Frontend
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **MapLibre GL** - Interactive maps
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database dengan pgvector extension
  - Authentication & Authorization
  - Storage untuk media files
  - Real-time subscriptions
  - Row Level Security (RLS)

### AI & Machine Learning
- **Gemini** - AI Assistant & Chat
- **Vertex** - Image & text embeddings untuk RAG
- **Vector Search** - Semantic search dengan pgvector

### APIs & Services
- **OpenRouteService** - Routing & directions
- **Nominatim** - Reverse geocoding
- **OpenFreeMap** - Base map tiles

---

## 🗺️ Navigasi Aplikasi

### Landing Page (`/`)
- Hero section dengan CTA
- Featured UMKM showcase
- Interactive mini map preview
- Search section
- FAQ dan footer

### Map Page (`/map`)
- Interactive map sebagai main interface
- Sidebar dengan nearby UMKM list
- Search bar dengan filter kategori
- UMKM detail sidebar
- AI Chatbot floating button
- Navigation controls
- Chat popup untuk messaging

### Profile Page (`/profile`)
- User information display & edit
- List UMKM yang dimiliki
- Logout functionality

### UMKM Pages
- `/umkm` - List semua UMKM user
- `/umkm/[id]` - Detail lengkap UMKM
  - Overview, Products, Reviews, About tabs
  - Gallery slider
  - Review submission
  - Contact & navigation buttons

### Add/Edit UMKM (`/usaha-baru`, `/umkm/[id]/edit`)
- Multi-step form (4 steps):
  1. Informasi Dasar (nama, kategori, deskripsi, lokasi, foto)
  2. Jam Operasional
  3. Media Sosial & Links
  4. Produk & Katalog
- Real-time validation
- Image upload & preview
- Coordinate picker dengan current location

---

## 🔐 Authentication

Aplikasi menggunakan Supabase Authentication dengan fitur:
- Email/Password authentication
- Email confirmation
- Password reset via email
- Protected routes dengan middleware
- Session management dengan cookies
- Row Level Security (RLS) di database

---

## 👨‍💻 Developer

Developed with ❤️ by **Ayam Pelung Cikutra**

- GitHub: [@dindinmhs](https://github.com/dindinmhs)
