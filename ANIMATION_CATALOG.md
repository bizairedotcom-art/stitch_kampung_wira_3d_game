# ANIMATION_CATALOG.md — Katalog Animasi 3D, GSAP & UI

Semua animasi mematuhi tetapan `reducedMotion` pengguna (`useSettingsStore`) dan media query CSS `prefers-reduced-motion: reduce`.

| Kategori | Nama Animasi | Pelaksanaan | Konteks Penggunaan |
|---|---|---|---|
| **Kamera & Dunia Desa** | Fokus Bangunan & Masa Hari | GSAP tween kamera & pencahayaan matahari dalam `VillageScene3D.ts` | Klik bangunan pada Peta Kampung atau Mod Bina Desa |
| **Persekitaran Hidup** | Aliran Sungai, Sampan & Enggang Terbang | Gelung `requestAnimationFrame` delta masa (`dt`) dalam `VillageScene3D.ts` | Peta Kampung 3D berterusan |
| **Pembinaan & Naik Taraf** | Upacara Bina & Potong Reben | Kemaskini skala bangunan + kesan kompang audio & modal perasmian | `VillageBuilderPage.tsx` & `RewardCelebrationModal.tsx` |
| **Avatar 3D** | 9 Keadaan Watak (`idle`–`celebrate`) | Pengiraan sin/cos anggota badan & putaran kepala dalam `AvatarScene3D.ts` | `AvatarStudioPage.tsx` & `OnboardingPage.tsx` |
| **Sahabat 3D** | Ayunan & Lompatan Ceria Sahabat | Animasi ekor, kepak & badan dalam `CompanionEngine3D.ts` | `CompanionPage.tsx` |
| **Bilik Enjin & Jam Angkasa** | Gear Berputar & Pancaran Bintang | Putaran gear berantai dalam `SubjectScene3D.ts` | `SubjectDetailPage.tsx` (Menara Nombor Matematik) |
| **Kolam Teratai** | Kocakan Air & Daun Kering | Animasi CSS/DOM interaktif ketika menyapu daun dan memberi makan ikan koi | `CreativeAndCoreEngines.tsx` (`DragAndDropGame`) |
