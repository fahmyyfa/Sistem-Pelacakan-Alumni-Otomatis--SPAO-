# SPAO System 2.0 - Sistem Pelacakan Alumni Otomatis

**SPAO (Sistem Pelacakan Alumni Otomatis)** adalah platform berbasis web yang dirancang untuk mengotomatisasi pencarian jejak digital alumni menggunakan algoritma **Disambiguasi** dan **Validasi Silang**. Proyek ini merupakan pemenuhan tugas **Daily Project 3** pada mata kuliah Rekayasa Kebutuhan.

## 🚀 Demo & Tautan

- **Live Demo**: [https://sistem-pelacakan-alumni-otomatis-sp-nine.vercel.app](https://sistem-pelacakan-alumni-otomatis-sp-nine.vercel.app)
- **Repository**: [https://github.com/fahmyyfa/Sistem-Pelacakan-Alumni-Otomatis--SPAO-](https://github.com/fahmyyfa/Sistem-Pelacakan-Alumni-Otomatis--SPAO-)

## 🧠 Logika Scoring (Disambiguasi)

Sistem menggunakan pembobotan atribut untuk menentukan tingkat kepercayaan (_Confidence Score_) terhadap data yang ditemukan. Rumus yang digunakan adalah:

$$Score_{total} = \text{Atribut}_{Nama}(40\%) + \text{Atribut}_{Afiliasi}(40\%) + \text{Atribut}_{Timeline}(20\%)$$

| Komponen             | Skor | Kriteria                                     |
| :------------------- | :--- | :------------------------------------------- |
| **Atribut Nama**     | 40   | Kecocokan nama lengkap (String Matching).    |
| **Atribut Afiliasi** | 40   | Kecocokan instansi/kampus (UMM/Informatika). |
| **Atribut Timeline** | 20   | Kecocokan tahun kelulusan.                   |

## 📊 Tabel Pengujian Kualitas (Quality Assurance)

Berdasarkan rancangan pada Daily Project 2, berikut adalah hasil pengujian fungsionalitas sistem:

| No  | Skenario Pengujian          | Input Data (Simulasi)                 | Expected Result (Score) | Status Akhir         | Keterangan |
| :-- | :-------------------------- | :------------------------------------ | :---------------------- | :------------------- | :--------- |
| 1   | **Data Identitas Sempurna** | Nama, UMM, Tahun sesuai.              | 100                     | ✅ Teridentifikasi   | LULUS      |
| 2   | **Ambiguitas Afiliasi**     | Nama & Tahun cocok, Afiliasi beda.    | 60                      | ⚠️ Verifikasi Manual | LULUS      |
| 3   | **Data Tidak Relevan**      | Nama & Tahun tidak cocok sama sekali. | 0 - 20                  | ❌ Belum Ditemukan   | LULUS      |

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL & Auth)
- **Deployment**: Vercel

## 📂 Struktur Proyek

- `/src/App.jsx`: Logika utama dashboard dan simulasi pelacakan.
- `/src/utils/scoring.js`: Algoritma kalkulasi nilai disambiguasi.
- `/src/lib/supabaseClient.js`: Konfigurasi koneksi database cloud.

## 👤 Identitas Pengembang

- **Nama**: Fahmi Alfaqih
- **NIM**: 202310370311041
- **Kelas**: Rekayasa Kebutuhan D
- **Instansi**: Universitas Muhammadiyah Malang (UMM)
