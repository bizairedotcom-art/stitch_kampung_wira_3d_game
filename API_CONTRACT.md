# API_CONTRACT.md — Spesifikasi Kontrak REST API & Penyesuai Backend

Dokumen ini mentakrifkan kontrak antara antara muka React (`src/services/backendAdapter.ts`) dengan pelayan pangkalan data **Supabase**, pelayan pengeluaran **Laravel API** pada masa hadapan, serta mod luar talian setempat (`LOCAL_DEMO`).

---

## 1. Tiga Mod Backend (`BackendAdapter`)

| Mod | Pemicu Pengaktifan | Storan & Pengesahan | Kegunaan |
|---|---|---|---|
| **`SUPABASE`** | Aktif apabila `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` dikonfigurasikan pada pelayan Express (`LARAVEL_API_BASE_URL` tidak aktif) | Supabase Auth + pengesahan JWT ES256 melalui `SUPABASE_JWKS_URL`, storan jadual PostgreSQL (`supabase/schema.sql`) melalui PostgREST dengan sandaran automatik baldi storan peribadi `kampung-wira-db`. Kunci rahsia (`SUPABASE_SECRET_KEY`) kekal di pelayan sahaja. | Pangkalan data awan berterusan terus ke projek Supabase. |
| **`LARAVEL_API`** | Aktif apabila `LARAVEL_API_BASE_URL` (pelayan) atau `VITE_LARAVEL_API_BASE_URL` ditetapkan dan boleh dicapai | Pengesahan pelayan selamat (`Bearer` token Sanctum/JWT + kuki `HttpOnly`), storan pangkalan data berterusan, penyegerakan luar talian `/api/v1/sync`, dan kebenaran berasaskan pemilik (`parent_id`). | Pengeluaran dengan pelayan Laravel. |
| **`LOCAL_DEMO`** | Sandaran luar talian / apabila tiada pelayan pangkalan data dikonfigurasikan | **IndexedDB** tempatan sepenuhnya (`kampung-wira-offline-db` — profil murid, avatar 3D, kemajuan, keadaan kampung, inventori, ganjaran, lukisan batik & log masuk demo tempatan). Tiada panggilan kepada titik hujung API luaran yang belum wujud. | Pembangunan & mod luar talian. |

### Pemboleh Ubah Persekitaran (`.env.example`)
- `SESSION_SECRET` — **Kekal di pelayan sahaja** (tidak pernah didedahkan kepada pelayar/klien).
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL` — Konfigurasi sambungan Supabase di pelayan Express (`server.ts` / `server/supabaseDb.ts`). `SUPABASE_SECRET_KEY` **tidak pernah** dihantar ke klien.
- `LARAVEL_API_BASE_URL` — Opsyen semasa pembangunan. Apabila ditetapkan dan boleh dicapai pada pelayan Express, permintaan `/api/v1/*` diproksi dengan selamat ke Laravel.
- `GEMINI_API_KEY` — Opsyen pelayan untuk `/api/v1/tutor` (`gemini-4-hydrogen`).

---

## 2. Pengepala & Pengesahan (`SUPABASE` / `LARAVEL_API`)

Semua titik hujung selain `/health`, `/auth/register`, `/auth/login`, `/auth/demo` memerlukan pengesahan pelayan:
- `Authorization: Bearer <token>` dan/atau kuki sesi `HttpOnly`.
- `Accept: application/json`
- `Content-Type: application/json`

Pelayan Express (dan Laravel) mesti menyemak bahawa `learner.parent_id === authenticatedParent.id` bagi semua laluan `/learners/{id}/*` (kebenaran sisi pelayan; pulangkan HTTP `403` atau `404` jika tidak sepadan).

---

## 3. Senarai Penuh Titik Hujung REST (`/api/v1/*`)

### 3.1 Kesihatan & Konfigurasi Mod
#### `GET /api/v1/health`
- **Respons `200 OK`**:
```json
{
  "status": "ok",
  "app": "Kampung Wira 3D",
  "backendMode": "SUPABASE",
  "database": "supabase",
  "laravelConfigured": false,
  "supabaseConfigured": true,
  "supabaseDriver": "postgres",
  "timestamp": "2026-11-20T11:50:00.000Z"
}
```

---

### 3.2 Pengesahan Ibu Bapa / Penjaga & Mod Demo

#### `POST /api/v1/auth/register`
- **Permintaan**:
```json
{
  "name": "Puan Aisyah",
  "email": "aisyah@contoh.my",
  "password": "kata-laluan-selamat",
  "pinCode": "1234"
}
```
- **Respons `201 Created`**:
```json
{
  "parent": {
    "id": "par-uuid",
    "name": "Puan Aisyah",
    "email": "aisyah@contoh.my",
    "isDemo": false,
    "pinCode": "1234",
    "createdAt": "2026-11-20T11:30:00.000Z"
  },
  "learners": [],
  "token": "<laravel-sanctum-token>"
}
```
- **Ralat**: `409 Conflict` jika e-mel telah wujud; `422 Unprocessable Entity` / `400 Bad Request` jika tidak sah.

#### `POST /api/v1/auth/login`
- **Permintaan**: `{ "email": "aisyah@contoh.my", "password": "..." }`
- **Respons `200 OK`**: `{ "parent": {...}, "learners": [...], "token": "<token>" }`
- **Ralat**: `401 Unauthorized` jika bukti kelayakan salah.

#### `POST /api/v1/auth/demo`
- **Penerangan**: Mewujudkan atau memulangkan sesi Mod Demo Tetamu yang ditanda secara eksplisit (`"isDemo": true`).
- **Respons `200 OK`**: `{ "parent": { ..., "isDemo": true }, "learners": [ ... ], "token": "<demo-token>" }`

#### `POST /api/v1/auth/logout`
- **Respons `200 OK`**: `{ "ok": true }` (membatalkan token Sanctum semasa & mengosongkan kuki).

#### `GET /api/v1/auth/me`
- **Respons `200 OK`**: `{ "parent": {...}, "learners": [...] }`
- **Ralat**: `401 Unauthorized` apabila tiada sesi sah.

---

### 3.3 Profil Murid & Konfigurasi Avatar

#### `GET /api/v1/learners`
- **Respons `200 OK`**: `{ "learners": [ LearnerProfile, ... ] }`

#### `POST /api/v1/learners`
- **Permintaan**:
```json
{
  "name": "Adam",
  "age": 7,
  "className": "Tahun 1 Cerdik",
  "companionId": "rimau",
  "avatar": {
    "skinTone": "sawo_matang",
    "hairStyle": "pendek_kemas",
    "hairColor": "#2a1700",
    "headwear": "songkok",
    "headwearColor": "#006947",
    "outfit": "baju_melayu_zamrud",
    "outfitColor": "#0D9668",
    "accessory": "beg_rotan",
    "footwear": "kasut_sekolah",
    "expression": "ceria"
  },
  "onboardingCompleted": true
}
```
- **Respons `201 Created`**: Memulangkan `LearnerBundleResponse` penuh (profil, kemajuan kosong, 4 misi awal, 5 lencana, inventori permulaan, 15 plot kampung, galeri lukisan kosong).

#### `GET /api/v1/learners/{id}/bundle`
- **Respons `200 OK`**: `LearnerBundleResponse` penuh:
```json
{
  "learner": { "...": "LearnerProfile" },
  "progress": { "mat-1-1": { "...": "SubtopicProgress" } },
  "transactions": [ { "transactionId": "tx-...", "coinsDelta": 35, "..." : "..." } ],
  "missions": [ { "id": "mis-1", "currentCount": 0, "targetCount": 1, "claimed": false } ],
  "achievements": [ { "id": "ach-first-step", "unlockedAt": "2026-11-20T..." } ],
  "inventory": [ { "id": "inv-pelita", "quantity": 1 } ],
  "village": { "villageName": "Kampung Wira Harmoni", "timeOfDay": "morning", "buildings": [], "decorations": [] },
  "artworks": []
}
```

#### `PATCH /api/v1/learners/{id}`
- **Permintaan**: Separa `LearnerProfile` (`name`, `className`, `avatar`, `companionId`, `onboardingCompleted`).
- **Respons `200 OK`**: `LearnerProfile` yang dikemas kini.

---

### 3.4 Kemajuan Pembelajaran & Idempotensi Ganjaran

#### `POST /api/v1/learners/{id}/progress`
- **Permintaan**:
```json
{
  "transactionId": "tx-uuid-unikal",
  "subtopicId": "mat-1-1",
  "subjectId": "matematik",
  "chapterId": "mat-bab-1",
  "engineId": "object-counter",
  "mode": "assessment",
  "score": 9,
  "maxScore": 10,
  "accuracy": 90,
  "starsEarned": 3,
  "coinsEarned": 40,
  "xpEarned": 60,
  "weakAreas": [],
  "durationSeconds": 95
}
```
- **Keperluan Idempotensi Pelayan Laravel**:
  - Kekangan unik pangkalan data pada `(learner_id, transaction_id)`.
  - Jika `transactionId` telah direkodkan, **jangan** tambah syiling, bintang, atau XP sekali lagi; pulangkan `200 OK` dengan `{ "applied": false, "bundle": <bundle semasa> }`.
- **Respons `200 OK`**: `{ "applied": true, "bundle": LearnerBundleResponse }`

#### `POST /api/v1/learners/{id}/missions/{missionId}/claim`
- **Respons `200 OK`**: `LearnerBundleResponse` (syiling & bintang ditambah, `mission.claimed = true`).
- **Ralat**: `400 Bad Request` / `409 Conflict` jika sasaran belum dicapai atau sudah dituntut.

---

### 3.5 Mod Bina Kampung 3D & Galeri Batik

#### `POST /api/v1/learners/{id}/village/build`
- **Permintaan**: `{ "buildingId": "bld-psv" }`
- **Logik Pelayan**: Sahkan `learner.coins >= building.buildCostCoins`, tolak syiling, tukar `status = 'built'`, buka lencana `ach-builder`.
- **Respons `200 OK`**: `LearnerBundleResponse` | **Ralat**: `400` jika syiling tidak cukup.

#### `POST /api/v1/learners/{id}/village/upgrade`
- **Permintaan**: `{ "buildingId": "bld-matematik" }`
- **Logik Pelayan**: Sahkan `status === 'built'` dan `level < maxLevel` (maksimum `3`), tolak `upgradeCostCoins`, naikkan `level`.
- **Respons `200 OK`**: `LearnerBundleResponse`

#### `POST /api/v1/learners/{id}/village/place`
- **Permintaan**: `{ "catalogId": "pokok-kelapa", "gridX": 4, "gridZ": -2 }`
- **Logik Pelayan**: Sahkan koordinat tidak bertindih (`Math.hypot < 2.2` untuk bangunan, `< 1.2` untuk hiasan sedia ada) dan syiling mencukupi.
- **Respons `200 OK`**: `LearnerBundleResponse` | **Ralat**: `409 Conflict` jika bertindih.

#### `POST /api/v1/learners/{id}/artworks`
- **Permintaan**: `{ "title": "Batik Bunga Raya", "motif": "Bunga Raya", "dataUrl": "data:image/png;base64,..." }`
- **Respons `201 Created`**: Objek `SavedArtwork` (dan membuka lencana `ach-artist`).

---

### 3.6 Penyegerakan Luar Talian & Tutor

#### `POST /api/v1/sync`
- **Permintaan**: `{ "learnerId": "lrn-...", "items": [ { "id": "tx-...", "kind": "activity_completion", "payload": {...}, "createdAt": "..." } ] }`
- **Respons `200 OK`**: `{ "syncedIds": ["tx-..."], "bundle": LearnerBundleResponse }`

#### `POST /api/v1/tutor`
- **Permintaan**: `{ "learnerName": "Adam", "subjectId": "matematik", "subjectName": "Matematik", "subtopicTitle": "Nombor 1 hingga 20", "question": "Apakah nilai tempat bagi 2 dalam 25?" }`
- **Respons `200 OK`**: `{ "answer": "...", "source": "gemini" | "local_pedagogy", "hintTip": "..." }`
