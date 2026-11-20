# THREEJS_SCENE_CATALOG.md — Katalog Babak 3D Three.js

Semua babak 3D dirender dalam `<ThreeViewport />` (`src/components/three/ThreeViewport.tsx`) yang menyediakan persekitaran cahaya `RoomEnvironment` PMREM, pengesanan perisian WebGL (`isSoftwareGl`), penskalaan kualiti grafik (`GraphicsPreset`), pengendalian `webglcontextlost`, dan mod sandaran 2D automatik.

| Fail Babak | Kelas / Eksport | Halaman Menggunakan | Komponen & Interaksi 3D |
|---|---|---|---|
| `src/features/village/VillageScene3D.ts` | `VillageScene3D` | `VillagePage.tsx`, `VillageBuilderPage.tsx` | Peta isometrik Kampung Wira, sungai mengalir, jambatan kayu, `InstancedMesh` pokok kelapa, sampan dan burung enggang beranimasi, 15 plot bangunan subjek (terbina vs tapak pembinaan), penukaran masa hari (`morning`/`afternoon`/`evening`), raycasting klik bangunan & petak tanah untuk peletakan hiasan, fokus kamera GSAP. |
| `src/features/avatar/AvatarScene3D.ts` & `AvatarCharacterMesh.ts` | `AvatarScene3D`, `buildAvatarMesh` | `AvatarStudioPage.tsx`, `OnboardingPage.tsx` | Studio avatar 3D berputar dengan 9 mod animasi (`idle`, `wave`, `cheer`, `walk`, `think`, `build`, `paint`, `dance`, `celebrate`), penukaran warna kulit, gaya rambut, songkok/hijab/tengkolok/topi rimba, baju tradisi, aksesori dan kasut secara langsung. |
| `src/features/companion/CompanionEngine3D.ts` | `CompanionScene3D` | `CompanionPage.tsx`, `OnboardingPage.tsx` | Pemapar 3D masa nyata untuk kelima-lima sahabat rimba (`rimau`, `kancil`, `enggang`, `utan`, `badak`) di atas pentas kayu kampung dengan animasi melompat dan melambai. |
| `src/features/subjects/SubjectScene3D.ts` | `SubjectScene3D` | `SubjectDetailPage.tsx` | Babak dalaman mengikut bangunan subjek: bilik gear berputar & teleskop angkasa (`matematik`), makmal bunga raya & magnet (`sains`), dermaga sampan (`bahasa-inggeris`), serta wakaf/pentas/galeri Nusantara bagi zon subjek lain. |
