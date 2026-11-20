# ART_DIRECTION.md — Panduan Reka Bentuk Nusantara Toybox Adventure

Berdasarkan `DESIGN.md` dan 41 templat asal Google Stitch (`design-reference/original-templates/`), Kampung Wira 3D menggabungkan estetika **Tactile Toyetic Skeuomorphism** dengan **Modenisme Budaya Malaysia**.

## 1. Palet Warna Teras (`src/index.css` `@theme`)
- **Primary Emerald**: `#0D9668` / `#006947` (Keutamaan tindakan utama, alam Nusantara)
- **Secondary Amber / Gold**: `#F59E0B` / `#D97706` (Syiling emas, bintang kejayaan, bumbung diraja)
- **Tertiary Cyan / Sky**: `#06B6D4` / `#006577` (Adventure Bay, teleskop Menara Nombor, sains)
- **Hibiscus Rose / Coral**: `#E11D48` / `#F43F5E` (Bunga raya kebangsaan, Galeri Batik)
- **Chengal Timber Dark**: `#4A2B11` / `#78350F` (Sempadan panel kayu ukiran & bayang butang 3D)
- **Warm Parchment**: `#FFFBEB` / `#FEF3C7` (Latar papan tulis mesra mata kanak-kanak)

## 2. Tipografi Tempatan
- **Paparan & Tajuk**: `Rubik` (600, 700, 800, 900)
- **Teks Bacaan & UI**: `Plus Jakarta Sans` (500, 600, 700, 800)
- **Ikon**: `Material Symbols Outlined` + `lucide-react`
- Kesemua 15 fail `.ttf` dihoskan setempat di `/public/fonts/`.

## 3. Permukaan & Komponen Khas
- **Panel Kayu Chengal (`panel-chengal`)**: Sempadan kayu berlapis dan bayangan jatuh taktil.
- **Kertas Manuskrip (`panel-parchment`)**: Latar hangat keemasan untuk teks pelajaran 7 tahun.
- **Jalur Songket (`songket-strip`)**: Hiasan geometri bersilang warna zamrud-emas-merah jambu.
- **Butang Bavel Mainan 3D (`btn-toy-*`)**: Kesan tekan fizikal (`translateY` + sempadan bawah tebal `border-b-4`) untuk sentuhan skrin dan tetikus yang jelas bagi kanak-kanak 7 tahun.
