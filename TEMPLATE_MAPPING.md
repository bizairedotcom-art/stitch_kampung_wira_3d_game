# TEMPLATE_MAPPING.md — Pemetaan Lengkap 41 Templat Asal Google Stitch ke Kampung Wira 3D

Semua 41 templat asal dikekalkan tanpa ubah suai di `design-reference/original-templates/pages/`. Jadual di bawah memetakan setiap templat kepada laluan aplikasi React (`App.tsx`), babak 3D Three.js, komponen/modal, dan enjin pembelajaran aktif.

| # | Fail Templat Asal (`pages/*.html`) | Laluan / Mod Aplikasi | Komponen / Babak 3D / Enjin |
|---|---|---|---|
| 1 | `log_masuk_wira_pintu_gerbang.html` | `/login`, `/register` | `AuthPage.tsx` (Pintu Gerbang Log Masuk + Mod Demo Terlabel Jelas) |
| 2 | `kampung_wira_pintu_gerbang_utama.html` | `/`, `/village` | `VillagePage.tsx` + `VillageScene3D.ts` (Kampung Isometrik 3D Utama) |
| 3 | `studio_wira_cipta_avatar_3d.html` | `/avatar`, `/onboarding/avatar` | `AvatarStudioPage.tsx` + `AvatarScene3D.ts` (Studio Avatar 3D Modular Sebenar) |
| 4 | `pilih_sahabat_sahabat_wira.html` | `/companion`, `/onboarding/companion` | `CompanionPage.tsx` + `CompanionEngine3D.ts` (5 Sahabat: Rimau, Kancil, Enggang, Utan, Badak) |
| 5 | `rumah_ilmu_6_zon_pembelajaran_kssr.html` | `/subjects` | `SubjectsHubPage.tsx` (Hab 15 Subjek KSSR Tahun 1 SK) |
| 6 | `menara_nombor_matematik_kssr_tahun_1.html` | `/subjects/matematik` | `SubjectDetailPage.tsx` + `SubjectScene3D.ts` (Menara Nombor Matematik) |
| 7 | `abakus_manik_kristal_menara_nombor_ajaib.html` | `/play/:activityId` (`place-value`, `object-counter`) | `PlaceValueGame.tsx` + `ObjectCounterGame.tsx` |
| 8 | `bilik_enjin_roda_gear_bahagian_dalam_menara_nombor.html` | `/play/:activityId` (`arithmetic-game`) | `ArithmeticGame.tsx` + `SubjectScene3D.ts` (Bilik Enjin Gear) |
| 9 | `tingkat_5_bilik_jam_angkasa_gear_nombor_gergasi.html` | `/play/:activityId` (`analog-clock`) | `AnalogClockGame.tsx` (Jam Analog & Masa) |
| 10 | `animasi_gear_jam_kosmik_berputar_nombor_8_kristal_bintang.html` | `/play/:activityId` + Mod Animasi | `AnalogClockGame.tsx` + GSAP & Three.js Gear Animation |
| 11 | `kejayaan_nombor_14_kunci_emas_menara_dibuka.html` | Modal Kemenangan (`CompletionModal`) | `RewardCelebrationModal.tsx` (Kunci Emas & Penilaian Tamat) |
| 12 | `aras_6_puncak_menara_nombor_teleskop_angkasa.html` | `/play/:activityId` (`geometry-3d`, `measurement-simulator`) | `Geometry3DGame.tsx` + `MeasurementSimulator.tsx` |
| 13 | `kejayaan_puncak_pancaran_teleskop_menyalakan_bintang_kejora.html` | Modal Kemenangan Puncak | `RewardCelebrationModal.tsx` (Bintang Kejora & Naik Taraf Tahap) |
| 14 | `makmal_alam_sains_kssr_tahun_1.html` | `/subjects/sains` | `SubjectDetailPage.tsx` + `SubjectScene3D.ts` (Makmal Alam) |
| 15 | `bahagian_dalam_makmal_alam_sains_kssr_tahun_1.html` | `/play/:activityId` (`magnet-simulator`, `absorption-simulator`) | `MagnetSimulator.tsx` + `AbsorptionSimulator.tsx` |
| 16 | `bahagian_dalam_makmal_sains_rimba_persediaan_membuka_plot_6.html` | `/play/:activityId` (`plant-explorer-3d`, `animal-explorer-3d`) | `PlantExplorer3D.tsx` + `AnimalExplorer3D.tsx` |
| 17 | `pustaka_rimba_bahasa_melayu_kssr_tahun_1.html` | `/subjects/bahasa-melayu` | `SubjectDetailPage.tsx` + `SubjectScene3D.ts` (Pustaka Rimba) |
| 18 | `wakaf_buku_bahagian_dalam_pustaka_rimba.html` | `/play/:activityId` (`syllable-builder`, `word-builder`, `sentence-builder`) | `SyllableBuilder.tsx` + `WordBuilder.tsx` + `SentenceBuilder.tsx` |
| 19 | `adventure_bay_english_cefr_year_1.html` | `/subjects/bahasa-inggeris` | `SubjectDetailPage.tsx` + `SubjectScene3D.ts` (Adventure Bay) |
| 20 | `dermaga_bay_bahagian_dalam_adventure_bay.html` | `/play/:activityId` (`listening-game`, `dialogue-adventure`) | `ListeningGame.tsx` + `DialogueAdventure.tsx` |
| 21 | `kejayaan_kata_boat_buku_hadiah_pembinaan_desa.html` | Modal Hadiah Kata & Pembinaan | `RewardCelebrationModal.tsx` + `VillageBuilderPage.tsx` |
| 22 | `taman_harmoni_pendidikan_islam_moral_kssr_tahun_1.html` | `/subjects/pendidikan-islam`, `/subjects/pendidikan-moral` | `SubjectDetailPage.tsx` + `SubjectScene3D.ts` (Taman Harmoni) |
| 23 | `bahagian_dalam_taman_harmoni_pendidikan_islam_moral.html` | `/learn/:lessonId` + `/play/:activityId` | `MoralDecisionGame.tsx` + `LessonPlayerPage.tsx` |
| 24 | `wakaf_teduhan_kasih_bahagian_dalam_taman_harmoni.html` | `/play/:activityId` (`moral-decision`, `story-sequence`) | `MoralDecisionGame.tsx` + `StorySequenceGame.tsx` |
| 25 | `kolam_teratai_bahagian_dalam_taman_harmoni.html` | `/play/:activityId` (`object-classification`, `construction-game-3d`) | `PondSanctuaryView.tsx` + `SubjectScene3D.ts` |
| 26 | `mini_permainan_tangkap_daun_kering_kolam_teratai.html` | `/play/:activityId` (`drag-and-drop`) | `DragAndDropGame.tsx` (Mod Tangkap Daun Kolam Teratai) |
| 27 | `animasi_memberi_makan_ikan_koi_kocakan_air_kolam_teratai.html` | Interaksi Kolam & Pengukuhan Positif | `PondSanctuaryView.tsx` (Kesan Kocakan Air & Ikan Koi) |
| 28 | `jurnal_hidupan_kolam_kad_ikan_koi_bunga_teratai.html` | `/inventory` & `/learn/:lessonId` | `InventoryPage.tsx` (Kad Jurnal Hidupan & Ensiklopedia Kolam) |
| 29 | `kejayaan_kolam_100_bersih_trofi_kolam_kristal.html` | Modal Trofi Kolam Kristal | `RewardCelebrationModal.tsx` |
| 30 | `bengkel_batik_pendidikan_seni_visual_kssr_tahun_1.html` | `/subjects/pendidikan-seni-visual` | `SubjectDetailPage.tsx` (Bengkel Batik Pelangi) |
| 31 | `kanvas_canting_bunga_raya_kssr_tahun_1.html` | `/play/:activityId` (`batik-designer`, `drawing-studio`) | `BatikPatternDesigner.tsx` + `DrawingStudio.tsx` |
| 32 | `bilik_pameran_rak_canting_galeri_batik_pelangi.html` | `/inventory` + Galeri Batik | `InventoryPage.tsx` (Rak Pameran Lukisan Batik Tersimpan) |
| 33 | `karya_siap_dipamerkan_galeri_batik_pelangi_3_bintang.html` | Modal Pameran Karya 3 Bintang | `RewardCelebrationModal.tsx` |
| 34 | `peta_pembinaan_kampung_wira_mod_bina_desa_3d.html` | `/build` | `VillageBuilderPage.tsx` + `VillageScene3D.ts` (Mod Bina Desa 3D) |
| 35 | `pengesahan_letak_galeri_batik_plot_4_kampung_wira.html` | `/build` (Modal Pengesahan Plot) | `VillageBuilderPage.tsx` |
| 36 | `sedang_dibina_galeri_batik_pelangi_di_plot_4.html` | `/build` (Animasi Pembinaan Bangunan) | `VillageScene3D.ts` + GSAP Construction Animation |
| 37 | `siap_dibina_perasmian_galeri_batik_pelangi.html` | `/build` (Modal Perasmian) | `RewardCelebrationModal.tsx` |
| 38 | `upacara_potong_reben_paluan_kompang_galeri_batik.html` | `/build` (Upacara Kompang & Potong Reben) | `VillageBuilderPage.tsx` + Web Audio Kompang SFX |
| 39 | `peta_pembinaan_desa_bina_plot_5_menggunakan_syiling_terkumpul.html` | `/build` (Pembinaan Plot Wakaf & Tambahan) | `VillageBuilderPage.tsx` |
| 40 | `sedang_dibina_wakaf_teduhan_kolam_santuari_di_plot_5.html` | `/build` (Animasi Pembinaan Wakaf) | `VillageScene3D.ts` |
| 41 | `siap_dibina_perasmian_wakaf_teduhan_kolam_santuari.html` | `/build` (Perasmian Wakaf Teduhan) | `RewardCelebrationModal.tsx` |
