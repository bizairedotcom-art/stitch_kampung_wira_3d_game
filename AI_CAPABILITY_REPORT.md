# AI_CAPABILITY_REPORT.md — Laporan Keupayaan & Sempadan AI Persekitaran

Laporan ini mendokumenkan secara telus keupayaan AI yang benar-benar tersedia, berjaya dilaksanakan, atau tidak tersedia dalam persekitaran pembangunan Kampung Wira 3D.

| Keupayaan | Status | Pelaksanaan Sebenar dalam Aplikasi |
|---|---|---|
| **Penjanaan Imej Statik (`generate_image`)** | **Tersedia & Digunakan** | Digunakan untuk menjana 7 aset rasmi Kampung Wira dalam `public/assets/generated/`: 4 potret sahabat (`kancil`, `enggang`, `utan`, `badak`), 2 bangunan subjek (`building_pentas_irama`, `building_arena_wira`), dan ikon aplikasi `kampung_wira_icon`. |
| **Tutor Teks Pintar Pelayan (`@google/genai`)** | **Tersedia (Pilihan `GEMINI_API_KEY`)** | Titik hujung `POST /api/v1/tutor` di `server.ts` memanggil `gemini-4-hydrogen` secara pelayan sahaja dengan pengepala `User-Agent: aistudio-build`. Tiada kunci API didedahkan di klien atau UI. Jika `GEMINI_API_KEY` tidak ditetapkan atau gagal, ia bertukar secara automatik kepada sandaran pedagogi tempatan (`source: 'local_pedagogy'`). |
| **Penjanaan Muzik AI (Lyria)** | **Tidak Tersedia** | Alat penjanaan audio/muzik Lyria tidak tersedia dalam persekitaran ini. Sebaliknya, `src/services/audioEngine.ts` membina enjin sintesis Web Audio API prosedur masa nyata untuk 15 lagu bertema Nusantara serta 8 kesan bunyi (`kompang`, `success`, `coin`, `build`, `water`, `click`, `nudge`, `note`) dan suara bacaan (`SpeechSynthesis`). |
| **Penjanaan Video AI (Veo)** | **Tidak Tersedia** | Alat penjanaan video Veo tidak tersedia dalam persekitaran ini. Sebaliknya, urutan pengenalan, pembinaan kampung, perasmian potong reben, dan pancaran teleskop disampaikan melalui animasi 3D masa nyata Three.js + GSAP (`VillageScene3D`, `SubjectScene3D`, `RewardCelebrationModal`). |
| **Penjanaan Aset 3D GLTF Luaran** | **Tidak Tersedia** | Semua model 3D (kampung, sungai, jambatan, 15 bangunan subjek, avatar boleh ubah suai, 5 sahabat rimba, enjin gear, abakus, pokok, bongkah) dibina secara prosedur menggunakan geometri Three.js (`MeshStandardMaterial`, pencahayaan PMREM `RoomEnvironment`, `InstancedMesh`) dengan sandaran 2D penuh. |
