# GAME_ENGINE_CATALOG.md — Katalog 35 Enjin Aktiviti Interaktif

Kesemua 35 enjin didaftarkan dalam `src/engines/EngineHost.tsx` (`ENGINE_REGISTRY`) dan `src/types/curriculum.ts` (`EngineId`).

## 1. Enjin Matematik (`src/engines/MathEngines.tsx`) — 10 Enjin
1. `object-counter`: Kiraan objek visual sentuhan (bintang, kuih, buah-buahan).
2. `number-line`: Garis nombor interaktif untuk susunan tertib menaik/menurun dan lompatan nombor.
3. `place-value`: Abakus manik kristal Puluh dan Sa untuk nilai tempat hingga 100.
4. `arithmetic-game`: Enjin gear tambah dan tolak pantas dengan maklum balas serta-merta.
5. `fraction-simulator`: Simulator pecahan visual kuih/bulatan (separuh ½, suku ¼, tiga perempat ¾).
6. `money-shop`: Kedai syiling sen (5, 10, 20, 50 sen) dan wang kertas RM1, RM5, RM10 Malaysia.
7. `analog-clock`: Jam angkasa berjarum jam dan minit interaktif (pukul tepat & setengah jam).
8. `measurement-simulator`: Perbandingan panjang, jisim (penimbang), dan isi padu cecair.
9. `geometry-3d`: Peneroka bentuk 2D dan bongkah 3D (kubus, kuboid, sfera, kon, silinder, piramid).
10. `pictograph-builder`: Pembina carta piktograf kampung berdasarkan pengumpulan data.

## 2. Enjin Sains (`src/engines/ScienceEngines.tsx`) — 7 Enjin
11. `object-classification`: Pengelasan dua kategori (Benda Hidup/Bukan Hidup, Pemerhatian/Berkomunikasi, Tanah).
12. `magnet-simulator`: Ujian bahan magnetik/bukan magnetik serta interaksi kutub U-S dan U-U.
13. `absorption-simulator`: Ujian titisan air pada span, tuala kapas, plastik, dan kaca.
14. `plant-explorer-3d`: Peneroka bahagian tumbuhan (bunga, daun, batang, akar) dan urat daun.
15. `animal-explorer-3d`: Peneroka bahagian tubuh haiwan (paruh, kepak, sirip, cangkerang, sesungut, sumbu).
16. `body-explorer-3d`: Peneroka 5 organ deria manusia (mata, telinga, hidung, lidah, kulit).
17. `construction-game-3d`: Pembina struktur bongkah bentuk asas 3D.

## 3. Enjin Bahasa & Literasi (`src/engines/LanguageEngines.tsx`) — 8 Enjin
18. `letter-tracing`: Latihan mengenal & menyurih huruf Rumi, Hijaiyah (RTL), Jawi, dan skrip elektif.
19. `syllable-builder`: Pembina suku kata terbuka KV+KV (BM) dan suku kata Jawi (RTL).
20. `word-builder`: Pembina perkataan KVK, diftong dan kosa kata Tahun 1.
21. `sentence-builder`: Penyusun kad perkataan menjadi ayat lengkap yang betul tatabahasanya.
22. `picture-matching`: Padanan gambar dan perkataan merentas Bahasa Arab, Cina, Tamil, Iban, Kadazandusun, Semai.
23. `listening-game`: Latihan mendengar sebutan suara (Web Speech API) dan memilih gambar/perkataan tepat.
24. `story-sequence`: Penyusun urutan cerita, langkah wuduk, Rukun Islam/Iman dan kisah sirah.
25. `dialogue-adventure`: Pengembaraan dialog dwisituasi CEFR Tahun 1 (Adventure Bay).

## 4. Enjin Seni, Muzik, Nilai, PJPK & Teras (`src/engines/CreativeAndCoreEngines.tsx`) — 10 Enjin
26. `moral-decision`: Dilema keputusan moral 14 nilai murni dan adab taman harmoni.
27. `drawing-studio`: Kanvas lukisan bebas HTML5 dengan penyimpanan galeri (`POST /api/v1/learners/:id/artworks`).
28. `batik-designer`: Kanvas canting motif Bunga Raya & corak batik dengan palet warna Nusantara.
29. `rhythm-game`: Permainan ketukan detik tempo muzik (laju/lambat, kuat/lembut).
30. `virtual-instrument`: Alat muzik perkusi maya (Kompang, Angklung, Gendang, Kerincing) berasaskan Web Audio API.
31. `movement-demonstrator`: Panduan interaktif pergerakan lokomotor, bukan lokomotor dan regangan.
32. `safety-scenario`: Simulasi keselamatan diri (sentuhan selamat, keselamatan jalan raya & Bilik Sains).
33. `memory-matching`: Permainan kad memori berpasangan untuk pengukuhan kosa kata dan nombor.
34. `drag-and-drop`: Permainan seret dan lepas termasuk mini permainan membersihkan daun kering Kolam Teratai.
35. `assessment-engine`: Enjin penilaian berfakta 10 soalan (`AssessmentPage.tsx`) dengan petunjuk, penjelasan, dan penskoran deterministik.
