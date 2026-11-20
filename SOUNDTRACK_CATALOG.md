# SOUNDTRACK_CATALOG.md — Katalog 15 Lagu Tema, Kesan Bunyi & Suara

Enjin audio (`src/services/audioEngine.ts`) menggunakan **Web Audio API** prosedur tempatan (tiada fail audio luaran yang boleh gagal dimuat) bersama **Web Speech API (`SpeechSynthesis`)** bagi bacaan Bahasa Melayu (`ms-MY`), Bahasa Inggeris (`en-GB`), Arab (`ar-SA`), Cina (`zh-CN`), dan Tamil (`ta-IN`). Bunyi muzik latar direndahkan secara automatik (*ducking*) ketika suara bacaan aktif dan dihentikan apabila tab pelayar disembunyikan (`visibilitychange`).

## 1. Katalog 15 Lagu Tema (`SOUNDTRACK_CATALOG`)

| # | Track ID | Tajuk | Zon / Subjek | Tempo (BPM) | Instrumen Sintesis |
|---:|---|---|---|---:|---|
| 1 | `track-gate` | Pintu Gerbang Harmoni | Log Masuk | 92 | Angklung & Seruling |
| 2 | `track-village` | Sinar Pagi Kampung Wira | Kampung Utama | 98 | Gamelan Lembut & Gambus |
| 3 | `track-math` | Roda Jam Menara Nombor | Matematik | 108 | Bonang Kristal |
| 4 | `track-science` | Titisan Embun Makmal Alam | Sains | 96 | Sape & Marimba |
| 5 | `track-bm` | Hikayat Pustaka Rimba | Bahasa Melayu | 90 | Gambus & Seruling Buluh |
| 6 | `track-english` | Ombak Riang Adventure Bay | Bahasa Inggeris | 112 | Ukulele Tropika |
| 7 | `track-islam` | Kedamaian Taman Harmoni | Pendidikan Islam | 76 | Oud Lembut & Rebana |
| 8 | `track-moral` | Wakaf Kasih & Budi | Pendidikan Moral | 84 | Kecapi & Angklung |
| 9 | `track-art` | Warna Canting Pelangi | Pendidikan Seni Visual | 94 | Kulintangan |
| 10 | `track-music` | Rentak Inang Nusantara | Pendidikan Muzik | 116 | Kompang & Gamelan |
| 11 | `track-pjpk` | Semangat Arena Wira | PJPK | 124 | Gendang Cergas |
| 12 | `track-arab` | Pelita Bahasa Arab | Bahasa Arab | 86 | Qanun Lembut |
| 13 | `track-cina-tamil` | Harmoni Pelbagai Budaya | Bahasa Cina & Tamil SK | 95 | Guzheng & Veena Pentatonik |
| 14 | `track-borneo-orang-asli` | Gema Sape & Buluh Rimba | Bahasa Iban, Kadazandusun & Semai | 88 | Sape Sarawak & Sompoton |
| 15 | `track-victory` | Paluan Kompang Kejayaan | Kemenangan & Perasmian | 120 | Kompang Diraja |

## 2. Kesan Bunyi Interaktif (`playSfx`)
`click`, `coin`, `success`, `kompang`, `build`, `water`, `nudge`, `note`.
