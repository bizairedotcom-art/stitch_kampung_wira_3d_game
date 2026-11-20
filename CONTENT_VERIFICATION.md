# CONTENT_VERIFICATION.md — Laporan Ketepatan & Semakan Kandungan Kurikulum

## Dasar Integriti Kurikulum
1. **Tiada Rekaan Kod DSKP KPM**: Semua 59 subtopik menggunakan pengecam dalaman `KW-*` (contoh: `KW-MAT-1.1`, `KW-SAI-7.1`). Tiada kod rasmi DSKP KPM yang direka atau dipalsukan.
2. **Skop Sekolah Kebangsaan (SK) Sahaja**: Kandungan disusun untuk murid berumur 7 tahun (Tahun 1, Tahap 1, SK), dengan Bahasa Melayu sebagai bahasa pengantar lalai dan Bahasa Inggeris CEFR bagi modul Bahasa Inggeris.
3. **Semakan Automatik (`scripts/validate-curriculum.ts`)**:
   - Mengesahkan kehadiran kesemua 15 subjek mandatori.
   - Mengesahkan 8 bab Matematik, 10 unit Sains, 7 bidang Pendidikan Islam, dan 14 nilai Pendidikan Moral.
   - Mengesahkan setiap subtopik mempunyai `>= 10` item penilaian berfakta, dengan jawapan betul sah (`correctAnswer`), `hint`, dan `explanation` tidak kosong.

## Status Semakan Pendidik (`verificationStatus`)
- **`verified_kssr_topic` (46 subtopik)**: Matematik, Sains, Bahasa Melayu, Bahasa Inggeris CEFR, Pendidikan Moral, Pendidikan Seni Visual, Pendidikan Muzik, PJPK. Semua fakta matematik, sains asas, keselamatan diri, dan tatabahasa disemak agar bebas daripada soalan mengelirukan.
- **`awaiting_educator_review` (13 subtopik)**:
  - **Pendidikan Islam (7 bidang / 7 subtopik)**: Ditanda jelas dalam UI (`SubjectDetailPage`, `LessonPlayerPage`) untuk semakan asatizah bertauliah. **Tiada** sebarang gambaran fizikal Allah SWT, para nabi, atau malaikat digunakan dalam babak 3D mahupun imej 2D. Tulisan Hijaiyah dan Jawi menggunakan arah kanan ke kiri (`dir="rtl"`).
  - **6 Bahasa Elektif SK (`bahasa-arab`, `bahasa-cina-sk`, `bahasa-tamil-sk`, `bahasa-iban`, `bahasa-kadazandusun`, `bahasa-semai`)**: Ditanda `awaiting_educator_review` untuk pengesahan penutur jati dan guru bahasa berkenaan sebelum penggunaan rasmi sekolah.

## Garis Panduan Tutor AI Pelayan (`/api/v1/tutor`)
- Sekiranya `GEMINI_API_KEY` dikonfigurasikan pada pelayan, tutor menggunakan `gemini-4-hydrogen` dengan arahan sistem agar berbahasa Melayu mesra kanak-kanak 7 tahun dan dilarang mencipta kod DSKP.
- Jika tiada kunci API pelayan, sistem kembali kepada respons pedagogi tempatan yang berpandukan topik semasa tanpa membuat panggilan luaran.
