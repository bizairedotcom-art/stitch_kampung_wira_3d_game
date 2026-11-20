import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import bcrypt from 'bcryptjs';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  audioBackendService,
  type TtsGenerationRequest,
  type VoiceAuditionEvaluation,
} from './server/audioService';
import type {
  AudioContentCategory,
  CharacterVoiceId,
  DeliveryProfileId,
  PronunciationMode,
  SpeechLang,
} from './src/shared/voiceBible';
import {
  isSupabaseConfigured,
  supabaseDb,
  type LearnerBundleRecord,
  type StoredParent,
} from './server/supabaseDb';
import type {
  ActivityCompletionPayload,
  LearnerBundleResponse,
  SyncBatchRequest,
  TutorRequest,
  TutorResponse,
} from './src/types/api';
import type { LearnerProfile, ParentAccount } from './src/types/user';
import type { SavedArtwork } from './src/types/village';
import {
  applyIdempotentActivityReward,
  createInitialAchievements,
  createInitialInventory,
  createInitialMissions,
  createInitialVillage,
  createNewLearner,
  DECORATION_CATALOG,
} from './src/utils/gameFactory';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || 'kampung-wira-dev-session-secret-change-in-prod';
const LARAVEL_API_BASE_URL = (process.env.LARAVEL_API_BASE_URL || '').trim().replace(/\/+$/, '');
const DATA_DIR = path.join(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'kampung-wira-db.json');

interface DatabaseSchema {
  parents: Record<string, StoredParent>;
  emailToParentId: Record<string, string>;
  learners: Record<string, LearnerBundleRecord>;
}

function ensureLocalDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw) as DatabaseSchema;
    } catch {
      // Fall back to fresh DB if corrupted
    }
  }
  const initial: DatabaseSchema = {
    parents: {},
    emailToParentId: {},
    learners: {},
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  return initial;
}

const localDb: DatabaseSchema = ensureLocalDb();

function saveLocalDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
}

function signToken(parentId: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 14;
  const payload = Buffer.from(JSON.stringify({ parentId, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      parentId: string;
      exp: number;
    };
    if (decoded.exp < Date.now()) return null;
    return decoded.parentId;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

const repo = {
  async getParentById(parentId: string): Promise<StoredParent | null> {
    if (isSupabaseConfigured()) {
      return supabaseDb.getParentById(parentId);
    }
    return localDb.parents[parentId] ?? null;
  },
  async getParentByEmail(email: string): Promise<StoredParent | null> {
    const normalized = email.trim().toLowerCase();
    if (isSupabaseConfigured()) {
      return supabaseDb.getParentByEmail(normalized);
    }
    const id = localDb.emailToParentId[normalized];
    return id ? localDb.parents[id] ?? null : null;
  },
  async saveParent(parent: StoredParent): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabaseDb.saveParent(parent);
      return;
    }
    const normalizedEmail = parent.email.trim().toLowerCase();
    localDb.parents[parent.id] = { ...parent, email: normalizedEmail };
    localDb.emailToParentId[normalizedEmail] = parent.id;
    saveLocalDb();
  },
  async getLearnersForParent(parentId: string): Promise<LearnerProfile[]> {
    if (isSupabaseConfigured()) {
      return supabaseDb.getLearnersForParent(parentId);
    }
    return Object.values(localDb.learners)
      .filter((b) => b.learner.parentId === parentId)
      .map((b) => b.learner);
  },
  async getBundle(learnerId: string): Promise<LearnerBundleRecord | null> {
    if (isSupabaseConfigured()) {
      return supabaseDb.getBundle(learnerId);
    }
    return localDb.learners[learnerId] ?? null;
  },
  async createBundleForLearner(learner: LearnerProfile): Promise<LearnerBundleRecord> {
    if (isSupabaseConfigured()) {
      return supabaseDb.createBundleForLearner(learner);
    }
    const bundle: LearnerBundleRecord = {
      learner,
      progress: {},
      transactions: [],
      missions: createInitialMissions(),
      achievements: createInitialAchievements(),
      inventory: createInitialInventory(),
      village: createInitialVillage(learner.id),
      artworks: [],
    };
    localDb.learners[learner.id] = bundle;
    saveLocalDb();
    return bundle;
  },
  async saveBundle(bundle: LearnerBundleRecord): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabaseDb.saveBundle(bundle);
      return;
    }
    localDb.learners[bundle.learner.id] = bundle;
    saveLocalDb();
  },
  async ensureDemoParentAndLearner(): Promise<{
    parent: StoredParent;
    learners: LearnerProfile[];
  }> {
    if (isSupabaseConfigured()) {
      return supabaseDb.ensureDemoParentAndLearner();
    }
    const demoId = 'par-demo-mod';
    if (!localDb.parents[demoId]) {
      localDb.parents[demoId] = {
        id: demoId,
        name: 'Mod Demo Tetamu',
        email: 'demo@kampungwira.local',
        isDemo: true,
        pinCode: '1234',
        passwordHash: '',
        createdAt: new Date().toISOString(),
      };
      const demoLearner = createNewLearner({
        id: 'lrn-demo-1',
        parentId: demoId,
        name: 'Wira Tetamu',
        className: 'Tahun 1 Bestari (Demo)',
        companionId: 'rimau',
        onboardingCompleted: true,
      });
      await this.createBundleForLearner(demoLearner);
      saveLocalDb();
    }
    return {
      parent: localDb.parents[demoId],
      learners: await this.getLearnersForParent(demoId),
    };
  },
};

async function getAuthenticatedParent(req: express.Request): Promise<StoredParent | null> {
  const cookies = parseCookies(req.headers.cookie);
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  const token = bearer || cookies['kw_session'];
  if (!token) return null;

  if (isSupabaseConfigured()) {
    const verifiedJwt = await supabaseDb.verifySupabaseAccessToken(token);
    if (verifiedJwt) {
      const parent = await supabaseDb.getParentByAuthUserId(
        verifiedJwt.authUserId,
        verifiedJwt.email,
      );
      if (parent) return parent;
    }
  }

  const parentId = verifyToken(token);
  if (!parentId) return null;
  return repo.getParentById(parentId);
}

function toPublicParent(p: StoredParent): ParentAccount {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    isDemo: p.isDemo,
    pinCode: p.pinCode,
    createdAt: p.createdAt,
  };
}

function applyActivityToBundleState(
  bundle: LearnerBundleRecord,
  payload: ActivityCompletionPayload,
): boolean {
  const result = applyIdempotentActivityReward({
    learner: bundle.learner,
    progressMap: bundle.progress,
    transactions: bundle.transactions,
    missions: bundle.missions,
    achievements: bundle.achievements,
    payload,
  });
  if (result.applied) {
    bundle.learner = result.learner;
    bundle.progress = result.progressMap;
    bundle.transactions = result.transactions;
    bundle.missions = result.missions;
    bundle.achievements = result.achievements;
  }
  return result.applied;
}

async function generateTutorReply(input: TutorRequest): Promise<TutorResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        apiVersion: 'v1beta',
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Pelajar bernama ${input.learnerName} (umur 7 tahun, Tahun 1 Sekolah Kebangsaan) sedang belajar subjek "${input.subjectName}" topik "${input.subtopicTitle}". Soalan murid: "${input.question}". Beri jawapan ringkas, mesra kanak-kanak, dalam Bahasa Melayu mudah (maksimum 3 ayat) beserta 1 petunjuk praktikal.`,
        config: {
          systemInstruction:
            'Anda ialah Sahabat Pintar Kampung Wira untuk murid Tahun 1 Sekolah Kebangsaan Malaysia (KSSR Semakan 2017). Gunakan Bahasa Melayu yang sopan, mudah difahami kanak-kanak 7 tahun, tepat dari segi fakta asas, dan jangan sekali-kali mencipta kod DSKP rasmi.',
        },
      });
      const text = response.text?.trim();
      if (text) {
        return {
          answer: text,
          source: 'gemini',
          hintTip:
            'Cuba gunakan alat interaktif di skrin sambil mengira atau menyebut perlahan-lahan!',
        };
      }
    } catch (err) {
      console.warn('Gemini tutor fallback triggered:', err instanceof Error ? err.message : err);
    }
  }

  return {
    answer: `Hai ${input.learnerName}! Untuk topik "${input.subtopicTitle}" (${input.subjectName}), cuba pecahkan soalan kepada langkah kecil: perhati gambar atau nombor dahulu, sebut dengan kuat, kemudian padankan dengan contoh pada papan pelajaran.`,
    source: 'local_pedagogy',
    hintTip: 'Tekan butang "Dengar Suara" atau butang "Petunjuk" untuk bantuan langkah demi langkah.',
  };
}



let laravelReachableCache: { checkedAt: number; ok: boolean } | null = null;

function isValidExternalLaravelUrl(raw: string): boolean {
  if (!raw) return false;
  const lower = raw.toLowerCase();
  if (
    lower.includes('example.com') ||
    lower.includes('your-') ||
    lower.includes('placeholder') ||
    lower === 'undefined' ||
    lower === 'null'
  ) {
    return false;
  }
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

async function isLaravelBackendReady(): Promise<boolean> {
  if (!isValidExternalLaravelUrl(LARAVEL_API_BASE_URL)) return false;
  const now = Date.now();
  if (laravelReachableCache && now - laravelReachableCache.checkedAt < 60_000) {
    return laravelReachableCache.ok;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 900);
    const probe = await fetch(`${LARAVEL_API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    const ok = probe.ok;
    laravelReachableCache = { checkedAt: now, ok };
    return ok;
  } catch {
    laravelReachableCache = { checkedAt: now, ok: false };
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  await isLaravelBackendReady();

  app.get('/api/v1/health', async (_req, res) => {
    const laravelReady = await isLaravelBackendReady();
    const supabaseReady = isSupabaseConfigured();
    let supabaseDriver: string | null = null;
    if (supabaseReady) {
      try {
        supabaseDriver = await supabaseDb.getDriver();
      } catch (err) {
        console.warn('Supabase health probe warning:', err instanceof Error ? err.message : err);
      }
    }
    res.json({
      status: 'ok',
      app: 'Kampung Wira 3D',
      backendMode: laravelReady ? 'LARAVEL_API' : supabaseReady ? 'SUPABASE' : 'LOCAL_DEMO',
      database: laravelReady ? 'laravel' : supabaseReady ? 'supabase' : 'indexeddb',
      laravelConfigured: laravelReady,
      supabaseConfigured: supabaseReady,
      supabaseDriver,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/v1', async (req, res, next) => {
    if (req.path === '/health') {
      next();
      return;
    }
    const laravelReady = await isLaravelBackendReady();
    if (!laravelReady) {
      next();
      return;
    }
    try {
      const targetUrl = `${LARAVEL_API_BASE_URL}/api/v1${req.url}`;
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      if (req.headers.authorization) headers.Authorization = String(req.headers.authorization);
      if (req.headers.cookie) headers.Cookie = String(req.headers.cookie);

      const upstream = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body ?? {}),
      });
      const text = await upstream.text();
      res.status(upstream.status);
      const contentType = upstream.headers.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);
      const setCookie = upstream.headers.get('set-cookie');
      if (setCookie) res.setHeader('Set-Cookie', setCookie);
      res.send(text);
    } catch (err) {
      if (req.path === '/tutor' && req.method === 'POST') {
        next();
        return;
      }
      res.status(502).json({
        error: 'Pelayan Laravel tidak dapat dihubungi buat masa ini.',
        detail: err instanceof Error ? err.message : 'Upstream proxy error',
      });
    }
  });

  app.post('/api/v1/auth/register', async (req, res) => {
    try {
      const { name, email, password, pinCode } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        pinCode?: string;
      };
      const normalizedEmail = (email || '').trim().toLowerCase();
      if (!name || !normalizedEmail || !password || password.length < 4) {
        res.status(400).json({
          error: 'Sila lengkapkan nama, e-mel, dan kata laluan (min 4 aksara).',
        });
        return;
      }

      const existing = await repo.getParentByEmail(normalizedEmail);
      if (existing) {
        res.status(409).json({ error: 'E-mel ini telah didaftarkan. Sila log masuk.' });
        return;
      }

      let authUserId: string | undefined;
      let accessToken: string | undefined;
      if (isSupabaseConfigured()) {
        const authRes = await supabaseDb.createSupabaseAuthAccount({
          email: normalizedEmail,
          password,
          name: name.trim(),
          pinCode: (pinCode || '1234').slice(0, 4),
        });
        authUserId = authRes.authUserId;
        accessToken = authRes.accessToken;
      }

      const parentId = authUserId || `par-${crypto.randomUUID()}`;
      const passwordHash = await bcrypt.hash(password, 8);
      const parent: StoredParent = {
        id: parentId,
        authUserId,
        name: name.trim(),
        email: normalizedEmail,
        isDemo: false,
        pinCode: (pinCode || '1234').slice(0, 4),
        passwordHash,
        createdAt: new Date().toISOString(),
      };
      await repo.saveParent(parent);

      const token = accessToken || signToken(parentId);
      res.cookie('kw_session', token, { httpOnly: true, sameSite: 'lax', maxAge: 14 * 86400000 });
      res.status(201).json({ parent: toPublicParent(parent), learners: [], token });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mendaftar akaun.';
      const status = msg.includes('telah didaftarkan') ? 409 : 500;
      res.status(status).json({ error: msg });
    }
  });

  app.post('/api/v1/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      const normalizedEmail = (email || '').trim().toLowerCase();
      if (!normalizedEmail || !password) {
        res.status(401).json({ error: 'E-mel atau kata laluan tidak sah.' });
        return;
      }

      let parent = await repo.getParentByEmail(normalizedEmail);
      let supabaseToken: string | undefined;

      if (isSupabaseConfigured()) {
        const authSign = await supabaseDb.signInSupabaseAuth({
          email: normalizedEmail,
          password,
        });
        if (authSign.accessToken && authSign.authUserId) {
          supabaseToken = authSign.accessToken;
          if (!parent) {
            parent = {
              id: authSign.authUserId,
              authUserId: authSign.authUserId,
              name: authSign.name || normalizedEmail.split('@')[0],
              email: normalizedEmail,
              isDemo: false,
              pinCode: '1234',
              passwordHash: await bcrypt.hash(password, 8),
              createdAt: new Date().toISOString(),
            };
            await repo.saveParent(parent);
          }
        }
      }

      if (!parent) {
        res.status(401).json({ error: 'E-mel atau kata laluan tidak sah.' });
        return;
      }

      if (!supabaseToken) {
        const ok = parent.passwordHash ? await bcrypt.compare(password, parent.passwordHash) : false;
        if (!ok) {
          res.status(401).json({ error: 'E-mel atau kata laluan tidak sah.' });
          return;
        }
      }

      const token = supabaseToken || signToken(parent.id);
      const learners = await repo.getLearnersForParent(parent.id);
      res.cookie('kw_session', token, { httpOnly: true, sameSite: 'lax', maxAge: 14 * 86400000 });
      res.json({
        parent: toPublicParent(parent),
        learners,
        token,
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Gagal log masuk.',
      });
    }
  });

  app.post('/api/v1/auth/demo', async (_req, res) => {
    try {
      const { parent, learners } = await repo.ensureDemoParentAndLearner();
      const token = signToken(parent.id);
      res.cookie('kw_session', token, { httpOnly: true, sameSite: 'lax', maxAge: 14 * 86400000 });
      res.json({
        parent: toPublicParent(parent),
        learners,
        token,
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Gagal memulakan Mod Demo.',
      });
    }
  });

  app.post('/api/v1/auth/logout', (_req, res) => {
    res.clearCookie('kw_session');
    res.json({ ok: true });
  });

  app.get('/api/v1/auth/me', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      if (!parent) {
        res.status(401).json({ error: 'Sesi tidak aktif.' });
        return;
      }
      const learners = await repo.getLearnersForParent(parent.id);
      res.json({
        parent: toPublicParent(parent),
        learners,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Ralat sesi.' });
    }
  });

  app.get('/api/v1/learners', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      if (!parent) {
        res.status(401).json({ error: 'Sila log masuk dahulu.' });
        return;
      }
      const learners = await repo.getLearnersForParent(parent.id);
      res.json({ learners });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Ralat pelayan.' });
    }
  });

  app.post('/api/v1/learners', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      if (!parent) {
        res.status(401).json({ error: 'Sila log masuk dahulu.' });
        return;
      }
      const body = req.body as Partial<LearnerProfile>;
      if (!body.name || !body.name.trim()) {
        res.status(400).json({ error: 'Nama murid diperlukan.' });
        return;
      }
      const learner = createNewLearner({
        id: `lrn-${crypto.randomUUID()}`,
        parentId: parent.id,
        name: body.name,
        age: body.age ?? 7,
        className: body.className,
        companionId: body.companionId,
        avatar: body.avatar,
        onboardingCompleted: body.onboardingCompleted ?? false,
      });
      const bundle = await repo.createBundleForLearner(learner);
      res.status(201).json(bundle);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal mencipta murid.' });
    }
  });

  app.get('/api/v1/learners/:id/bundle', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      res.json(bundle satisfies LearnerBundleResponse);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal memuat profil.' });
    }
  });

  app.patch('/api/v1/learners/:id', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const patch = req.body as Partial<LearnerProfile>;
      bundle.learner = {
        ...bundle.learner,
        name: patch.name?.trim() || bundle.learner.name,
        className: patch.className?.trim() || bundle.learner.className,
        avatar: patch.avatar ?? bundle.learner.avatar,
        companionId: patch.companionId ?? bundle.learner.companionId,
        onboardingCompleted: patch.onboardingCompleted ?? bundle.learner.onboardingCompleted,
      };
      await repo.saveBundle(bundle);
      res.json(bundle.learner);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal mengemas kini murid.' });
    }
  });

  app.post('/api/v1/learners/:id/progress', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const payload = req.body as ActivityCompletionPayload;
      if (!payload?.transactionId || !payload?.subtopicId) {
        res.status(400).json({ error: 'Data aktiviti tidak lengkap.' });
        return;
      }
      const applied = applyActivityToBundleState(bundle, payload);
      if (applied) {
        await repo.saveBundle(bundle);
      }
      res.json({ applied, bundle });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal menyimpan kemajuan.' });
    }
  });

  app.post('/api/v1/learners/:id/missions/:missionId/claim', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const mission = bundle.missions.find((m) => m.id === req.params.missionId);
      if (!mission || mission.claimed || mission.currentCount < mission.targetCount) {
        res.status(400).json({ error: 'Misi belum selesai atau telah dituntut.' });
        return;
      }
      mission.claimed = true;
      bundle.learner.coins += mission.rewardCoins;
      bundle.learner.stars += mission.rewardStars;
      await repo.saveBundle(bundle);
      res.json(bundle);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal menuntut misi.' });
    }
  });

  app.post('/api/v1/learners/:id/village/build', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const { buildingId } = req.body as { buildingId?: string };
      const bld = bundle.village.buildings.find((b) => b.id === buildingId);
      if (!bld) {
        res.status(404).json({ error: 'Bangunan tidak ditemui.' });
        return;
      }
      if (bld.status === 'built') {
        res.json(bundle);
        return;
      }
      if (bundle.learner.coins < bld.buildCostCoins) {
        res.status(400).json({ error: 'Syiling emas tidak mencukupi.' });
        return;
      }
      bundle.learner.coins -= bld.buildCostCoins;
      bld.status = 'built';
      const ach = bundle.achievements.find((a) => a.id === 'ach-builder');
      if (ach && !ach.unlockedAt) ach.unlockedAt = new Date().toISOString();
      const storyMission = bundle.missions.find((m) => m.id === 'mis-4');
      if (storyMission && storyMission.currentCount < storyMission.targetCount) {
        storyMission.currentCount += 1;
      }
      await repo.saveBundle(bundle);
      res.json(bundle);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal membina bangunan.' });
    }
  });

  app.post('/api/v1/learners/:id/village/upgrade', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const { buildingId } = req.body as { buildingId?: string };
      const bld = bundle.village.buildings.find((b) => b.id === buildingId);
      if (!bld || bld.status !== 'built' || bld.level >= bld.maxLevel) {
        res.status(400).json({ error: 'Bangunan tidak boleh dinaik taraf.' });
        return;
      }
      if (bundle.learner.coins < bld.upgradeCostCoins) {
        res.status(400).json({ error: 'Syiling emas tidak mencukupi.' });
        return;
      }
      bundle.learner.coins -= bld.upgradeCostCoins;
      bld.level += 1;
      bld.upgradeCostCoins += 40;
      await repo.saveBundle(bundle);
      res.json(bundle);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal menaik taraf bangunan.' });
    }
  });

  app.post('/api/v1/learners/:id/village/place', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const { catalogId, gridX, gridZ } = req.body as {
        catalogId?: string;
        gridX?: number;
        gridZ?: number;
      };
      const item = DECORATION_CATALOG.find((c) => c.catalogId === catalogId);
      if (!item || typeof gridX !== 'number' || typeof gridZ !== 'number') {
        res.status(400).json({ error: 'Hiasan atau koordinat tidak sah.' });
        return;
      }
      const collides =
        bundle.village.buildings.some((b) => Math.hypot(b.gridX - gridX, b.gridZ - gridZ) < 2.2) ||
        bundle.village.decorations.some((d) => Math.hypot(d.gridX - gridX, d.gridZ - gridZ) < 1.2);
      if (collides) {
        res.status(409).json({ error: 'Petak ini bertindih dengan bangunan atau hiasan lain.' });
        return;
      }
      if (bundle.learner.coins < item.costCoins) {
        res.status(400).json({ error: 'Syiling tidak mencukupi.' });
        return;
      }
      bundle.learner.coins -= item.costCoins;
      bundle.village.decorations.push({
        id: `dec-${crypto.randomUUID()}`,
        catalogId: item.catalogId,
        name: item.name,
        category: item.category,
        gridX,
        gridZ,
        rotation: Math.random() * Math.PI * 2,
        costCoins: item.costCoins,
      });
      await repo.saveBundle(bundle);
      res.json(bundle);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal meletakkan hiasan.' });
    }
  });

  app.post('/api/v1/learners/:id/artworks', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const bundle = await repo.getBundle(req.params.id);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const { title, motif, dataUrl } = req.body as {
        title?: string;
        motif?: string;
        dataUrl?: string;
      };
      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        res.status(400).json({ error: 'Fail lukisan tidak sah.' });
        return;
      }
      const art: SavedArtwork = {
        id: `art-${crypto.randomUUID()}`,
        learnerId: bundle.learner.id,
        title: (title || 'Batik Bunga Raya').slice(0, 60),
        motif: motif || 'Bunga Raya',
        dataUrl,
        starsEarned: 3,
        createdAt: new Date().toISOString(),
        displayedInGallery: true,
      };
      bundle.artworks.unshift(art);
      const ach = bundle.achievements.find((a) => a.id === 'ach-artist');
      if (ach && !ach.unlockedAt) ach.unlockedAt = new Date().toISOString();
      await repo.saveBundle(bundle);
      res.status(201).json(art);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal menyimpan lukisan.' });
    }
  });

  app.post('/api/v1/sync', async (req, res) => {
    try {
      const parent = await getAuthenticatedParent(req);
      const body = req.body as SyncBatchRequest;
      const bundle = await repo.getBundle(body?.learnerId);
      if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
        res.status(404).json({ error: 'Profil murid tidak ditemui.' });
        return;
      }
      const syncedIds: string[] = [];
      let anyChanged = false;
      for (const item of body.items || []) {
        if (item.kind === 'activity_completion') {
          if (applyActivityToBundleState(bundle, item.payload as ActivityCompletionPayload)) {
            anyChanged = true;
          }
        }
        syncedIds.push(item.id);
      }
      if (anyChanged) {
        await repo.saveBundle(bundle);
      }
      res.json({ syncedIds, bundle });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal menyegerak data.' });
    }
  });

  app.post('/api/v1/tutor', async (req, res) => {
    const input = req.body as TutorRequest;
    if (!input?.question) {
      res.status(400).json({ error: 'Soalan tidak boleh kosong.' });
      return;
    }
    const reply = await generateTutorReply(input);
    res.json(reply);
  });

  app.get('/api/v1/audio/capabilities', async (_req, res) => {
    try {
      const caps = await audioBackendService.getCapabilities();
      res.json(caps);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Gagal memuat keupayaan audio.' });
    }
  });

  app.post('/api/v1/tts', async (req, res) => {
    const body = req.body as Partial<TtsGenerationRequest> & { companionId?: CharacterVoiceId };
    if (!body?.text || !body.text.trim()) {
      res.status(400).json({ error: 'Teks suara diperlukan.' });
      return;
    }
    const result = await audioBackendService.synthesize({
      text: body.text,
      lang: (body.lang as SpeechLang) || 'ms-MY',
      subjectId: body.subjectId,
      characterId: body.characterId || body.companionId || 'rimau',
      deliveryProfile: (body.deliveryProfile as DeliveryProfileId) || 'instruction',
      pronunciationMode: body.pronunciationMode as PronunciationMode | undefined,
      audioCategory: body.audioCategory as AudioContentCategory | undefined,
      voiceOverride: body.voiceOverride,
      modelOverride: body.modelOverride,
      allowDynamicAi: body.allowDynamicAi,
      skipStaticManifest: body.skipStaticManifest,
    });
    res.json(result);
  });

  app.post('/api/v1/audio/audition', async (req, res) => {
    const body = req.body as {
      text?: string;
      voiceId?: string;
      modelId?: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
      characterId?: CharacterVoiceId;
      deliveryProfile?: DeliveryProfileId;
      lang?: SpeechLang;
    };
    if (!body?.text?.trim() || !body.voiceId) {
      res.status(400).json({ error: 'Teks dan voiceId diperlukan untuk uji bakat suara.' });
      return;
    }
    const result = await audioBackendService.synthesize({
      text: body.text,
      lang: body.lang || 'ms-MY',
      characterId: body.characterId || 'rimau',
      deliveryProfile: body.deliveryProfile || 'welcome',
      voiceOverride: body.voiceId,
      modelOverride: body.modelId || 'gemini-3.8-flash-lite-tts',
      skipStaticManifest: true,
    });
    res.json(result);
  });

  app.post('/api/v1/audio/audition/evaluate', async (req, res) => {
    const body = req.body as VoiceAuditionEvaluation;
    if (!body?.phraseId || !body.voiceId) {
      res.status(400).json({ error: 'Data penilaian suara tidak lengkap.' });
      return;
    }
    const saved = await audioBackendService.saveApprovalEvaluation(body);
    res.json(saved);
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*path}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    app.get('/@vite/client', (_req, res) => {
      res.type('application/javascript').send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    style.remove();
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (!url || (url[0] !== '.' && url[0] !== '/')) return url;
  const pathname = url.replace(/[?#].*$/, '');
  const { search, hash } = new URL(url, 'http://vite.dev');
  return pathname + '?' + queryToInject + (search ? '&' + search.slice(1) : '') + (hash || '');
}
export class ErrorOverlay extends HTMLElement {}
`);
    });
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kampung Wira 3D server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Kampung Wira server:', err);
  process.exit(1);
});
