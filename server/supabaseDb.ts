import crypto from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { SubjectId } from '../src/types/curriculum';
import type {
  AchievementBadge,
  InventoryItem,
  MasteryStatus,
  MissionProgress,
  RewardTransaction,
  SubtopicProgress,
} from '../src/types/game';
import type { LearnerProfile, ParentAccount } from '../src/types/user';
import type { SavedArtwork, VillageBuilding, VillageDecoration, VillageState } from '../src/types/village';
import {
  createInitialAchievements,
  createInitialInventory,
  createInitialMissions,
  createInitialVillage,
  createNewLearner,
} from '../src/utils/gameFactory';

export interface StoredParent extends ParentAccount {
  passwordHash: string;
  authUserId?: string;
}

export interface LearnerBundleRecord {
  learner: LearnerProfile;
  progress: Record<string, SubtopicProgress>;
  transactions: RewardTransaction[];
  missions: MissionProgress[];
  achievements: AchievementBadge[];
  inventory: InventoryItem[];
  village: VillageState;
  artworks: SavedArtwork[];
}

export type SupabaseStorageDriver = 'postgres' | 'storage_bucket';

const BUCKET_NAME = 'kampung-wira-db';

interface SupabaseConfig {
  url: string;
  publishableKey: string;
  secretKey: string;
  jwksUrl: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const publishableKey = (process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
  const secretKey = (process.env.SUPABASE_SECRET_KEY || '').trim();
  const jwksUrl = (
    process.env.SUPABASE_JWKS_URL || (url ? `${url}/auth/v1/.well-known/jwks.json` : '')
  ).trim();
  return { url, publishableKey, secretKey, jwksUrl };
}

export function isSupabaseConfigured(): boolean {
  const { url, secretKey } = getSupabaseConfig();
  if (!url || !secretKey) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

let cachedAdminClient: SupabaseClient | null = null;
let cachedAuthClient: SupabaseClient | null = null;
let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let cachedKeySignature = '';

function getClients(): { admin: SupabaseClient; auth: SupabaseClient; jwksUrl: string; url: string } {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.secretKey) {
    throw new Error('Supabase belum dikonfigurasi pada pelayan.');
  }
  const sig = `${cfg.url}|${cfg.secretKey}|${cfg.publishableKey}|${cfg.jwksUrl}`;
  if (!cachedAdminClient || !cachedAuthClient || cachedKeySignature !== sig) {
    cachedAdminClient = createClient(cfg.url, cfg.secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    cachedAuthClient = createClient(cfg.url, cfg.publishableKey || cfg.secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    cachedJwks = cfg.jwksUrl ? createRemoteJWKSet(new URL(cfg.jwksUrl)) : null;
    cachedKeySignature = sig;
  }
  return { admin: cachedAdminClient, auth: cachedAuthClient, jwksUrl: cfg.jwksUrl, url: cfg.url };
}

function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export class SupabaseDatabase {
  private driverCache: { driver: SupabaseStorageDriver; checkedAt: number } | null = null;
  private bucketEnsured = false;

  async getDriver(): Promise<SupabaseStorageDriver> {
    const now = Date.now();
    if (this.driverCache) {
      if (this.driverCache.driver === 'postgres') return 'postgres';
      if (now - this.driverCache.checkedAt < 60_000) return this.driverCache.driver;
    }

    const { admin } = getClients();
    const { error } = await admin.from('kw_parents').select('id').limit(1);
    if (!error) {
      this.driverCache = { driver: 'postgres', checkedAt: now };
      return 'postgres';
    }

    await this.ensureBucket();
    this.driverCache = { driver: 'storage_bucket', checkedAt: now };
    return 'storage_bucket';
  }

  private async ensureBucket(): Promise<void> {
    if (this.bucketEnsured) return;
    const { admin } = getClients();
    const { data, error } = await admin.storage.getBucket(BUCKET_NAME);
    if (!error && data) {
      this.bucketEnsured = true;
      return;
    }
    const created = await admin.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024,
    });
    if (created.error && !created.error.message.toLowerCase().includes('already exists')) {
      throw new Error(`Gagal menyediakan ruang storan Supabase: ${created.error.message}`);
    }
    this.bucketEnsured = true;
  }

  private async readJson<T>(objectPath: string): Promise<T | null> {
    await this.ensureBucket();
    const { admin } = getClients();
    const { data, error } = await admin.storage.from(BUCKET_NAME).download(objectPath);
    if (error || !data) return null;
    try {
      const text = await data.text();
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  private async writeJson(objectPath: string, payload: unknown): Promise<void> {
    await this.ensureBucket();
    const { admin } = getClients();
    const body = Buffer.from(JSON.stringify(payload), 'utf8');
    const { error } = await admin.storage.from(BUCKET_NAME).upload(objectPath, body, {
      contentType: 'application/json',
      upsert: true,
    });
    if (error) {
      throw new Error(`Gagal menulis rekod ke Supabase: ${error.message}`);
    }
  }

  async verifySupabaseAccessToken(
    token: string,
  ): Promise<{ authUserId: string; email?: string } | null> {
    if (!token || token.split('.').length !== 3) return null;
    try {
      const { url } = getClients();
      if (!cachedJwks) return null;
      const { payload } = await jwtVerify(token, cachedJwks, {
        issuer: `${url}/auth/v1`,
      });
      if (!payload.sub) return null;
      return {
        authUserId: payload.sub,
        email: typeof payload.email === 'string' ? payload.email.toLowerCase() : undefined,
      };
    } catch {
      return null;
    }
  }

  async createSupabaseAuthAccount(input: {
    email: string;
    password: string;
    name: string;
    pinCode: string;
  }): Promise<{ authUserId?: string; accessToken?: string }> {
    const { admin, auth } = getClients();
    if (input.password.length < 6) {
      return {};
    }
    const created = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        name: input.name,
        pinCode: input.pinCode,
      },
    });
    if (created.error || !created.data.user) {
      if (created.error?.message.toLowerCase().includes('already')) {
        throw new Error('E-mel ini telah didaftarkan. Sila log masuk.');
      }
      return {};
    }
    const signIn = await auth.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    return {
      authUserId: created.data.user.id,
      accessToken: signIn.data.session?.access_token,
    };
  }

  async signInSupabaseAuth(input: {
    email: string;
    password: string;
  }): Promise<{ authUserId?: string; accessToken?: string; name?: string }> {
    const { auth } = getClients();
    const res = await auth.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (res.error || !res.data.user || !res.data.session) {
      return {};
    }
    return {
      authUserId: res.data.user.id,
      accessToken: res.data.session.access_token,
      name:
        typeof res.data.user.user_metadata?.name === 'string'
          ? res.data.user.user_metadata.name
          : undefined,
    };
  }

  async getParentById(parentId: string): Promise<StoredParent | null> {
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const { data, error } = await admin
        .from('kw_parents')
        .select('*')
        .eq('id', parentId)
        .maybeSingle();
      if (error || !data) return null;
      return this.mapRowToParent(data);
    }
    return this.readJson<StoredParent>(`parents/${parentId}.json`);
  }

  async getParentByEmail(email: string): Promise<StoredParent | null> {
    const normalized = email.trim().toLowerCase();
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const { data, error } = await admin
        .from('kw_parents')
        .select('*')
        .eq('email', normalized)
        .maybeSingle();
      if (error || !data) return null;
      return this.mapRowToParent(data);
    }
    const idx = await this.readJson<{ parentId: string }>(`email-index/${hashEmail(normalized)}.json`);
    if (!idx?.parentId) return null;
    return this.getParentById(idx.parentId);
  }

  async getParentByAuthUserId(authUserId: string, email?: string): Promise<StoredParent | null> {
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const { data, error } = await admin
        .from('kw_parents')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle();
      if (!error && data) return this.mapRowToParent(data);
      if (email) return this.getParentByEmail(email);
      return null;
    }
    const idx = await this.readJson<{ parentId: string }>(`auth-index/${authUserId}.json`);
    if (idx?.parentId) {
      const p = await this.getParentById(idx.parentId);
      if (p) return p;
    }
    if (email) return this.getParentByEmail(email);
    return null;
  }

  async saveParent(parent: StoredParent): Promise<void> {
    const normalizedEmail = parent.email.trim().toLowerCase();
    const normalizedParent: StoredParent = { ...parent, email: normalizedEmail };
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const { error } = await admin.from('kw_parents').upsert(
        {
          id: normalizedParent.id,
          auth_user_id: normalizedParent.authUserId ?? null,
          name: normalizedParent.name,
          email: normalizedParent.email,
          is_demo: normalizedParent.isDemo,
          pin_code: normalizedParent.pinCode || '1234',
          password_hash: normalizedParent.passwordHash,
          created_at: normalizedParent.createdAt,
        },
        { onConflict: 'id' },
      );
      if (error) {
        throw new Error(`Gagal menyimpan akaun ke Supabase: ${error.message}`);
      }
      return;
    }

    await this.writeJson(`parents/${normalizedParent.id}.json`, normalizedParent);
    await this.writeJson(`email-index/${hashEmail(normalizedEmail)}.json`, {
      parentId: normalizedParent.id,
    });
    if (normalizedParent.authUserId) {
      await this.writeJson(`auth-index/${normalizedParent.authUserId}.json`, {
        parentId: normalizedParent.id,
      });
    }
  }

  async getLearnersForParent(parentId: string): Promise<LearnerProfile[]> {
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const { data, error } = await admin
        .from('kw_learners')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true });
      if (error || !data) return [];
      return data.map((row) => this.mapRowToLearner(row));
    }

    const index = await this.readJson<{ learnerIds: string[] }>(`parent-learners/${parentId}.json`);
    if (!index?.learnerIds?.length) return [];
    const bundles = await Promise.all(index.learnerIds.map((id) => this.getBundle(id)));
    return bundles.filter((b): b is LearnerBundleRecord => Boolean(b)).map((b) => b.learner);
  }

  async createBundleForLearner(learner: LearnerProfile): Promise<LearnerBundleRecord> {
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
    await this.saveBundle(bundle);
    return bundle;
  }

  async getBundle(learnerId: string): Promise<LearnerBundleRecord | null> {
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const { data: learnerRow, error: learnerErr } = await admin
        .from('kw_learners')
        .select('*')
        .eq('id', learnerId)
        .maybeSingle();
      if (learnerErr || !learnerRow) return null;

      const [progRes, txRes, misRes, achRes, invRes, vilRes, artRes] = await Promise.all([
        admin.from('kw_subtopic_progress').select('*').eq('learner_id', learnerId),
        admin
          .from('kw_reward_transactions')
          .select('*')
          .eq('learner_id', learnerId)
          .order('created_at', { ascending: false }),
        admin.from('kw_missions').select('*').eq('learner_id', learnerId),
        admin.from('kw_achievements').select('*').eq('learner_id', learnerId),
        admin.from('kw_inventory').select('*').eq('learner_id', learnerId),
        admin.from('kw_villages').select('*').eq('learner_id', learnerId).maybeSingle(),
        admin
          .from('kw_artworks')
          .select('*')
          .eq('learner_id', learnerId)
          .order('created_at', { ascending: false }),
      ]);

      const progress: Record<string, SubtopicProgress> = {};
      for (const row of progRes.data || []) {
        progress[String(row.subtopic_id)] = {
          subtopicId: String(row.subtopic_id),
          subjectId: String(row.subject_id) as SubjectId,
          chapterId: String(row.chapter_id ?? ''),
          lessonCompleted: Boolean(row.lesson_completed),
          practiceCompleted: Boolean(row.practice_completed),
          assessmentScore: Number(row.assessment_score ?? 0),
          attempts: Number(row.attempts ?? 0),
          bestAccuracy: Number(row.best_accuracy ?? 0),
          starsEarned: Number(row.stars_earned ?? 0),
          masteryPercent: Number(row.mastery_percent ?? 0),
          status: String(row.status ?? 'not_started') as MasteryStatus,
          lastPlayedAt: String(row.last_played_at),
          nextRevisionAt: String(row.next_revision_at),
          weakTopics: Array.isArray(row.weak_topics) ? (row.weak_topics as string[]) : [],
        };
      }

      const transactions: RewardTransaction[] = (txRes.data || []).map((row) => ({
        transactionId: String(row.transaction_id),
        learnerId: String(row.learner_id),
        sourceType: String(row.source_type) as RewardTransaction['sourceType'],
        sourceId: String(row.source_id),
        coinsDelta: Number(row.coins_delta ?? 0),
        starsDelta: Number(row.stars_delta ?? 0),
        xpDelta: Number(row.xp_delta ?? 0),
        gemsDelta: Number(row.gems_delta ?? 0),
        createdAt: String(row.created_at),
      }));

      const missions: MissionProgress[] = (misRes.data || []).map((row) => ({
        id: String(row.id),
        title: String(row.title),
        description: String(row.description),
        subjectId: row.subject_id ? (String(row.subject_id) as SubjectId) : undefined,
        targetCount: Number(row.target_count ?? 1),
        currentCount: Number(row.current_count ?? 0),
        rewardCoins: Number(row.reward_coins ?? 0),
        rewardStars: Number(row.reward_stars ?? 0),
        claimed: Boolean(row.claimed),
        type: String(row.type ?? 'daily') as MissionProgress['type'],
      }));

      const achievements: AchievementBadge[] = (achRes.data || []).map((row) => ({
        id: String(row.id),
        title: String(row.title),
        description: String(row.description),
        icon: String(row.icon),
        category: String(row.category ?? 'akademik') as AchievementBadge['category'],
        unlockedAt: row.unlocked_at ? String(row.unlocked_at) : undefined,
      }));

      const inventory: InventoryItem[] = (invRes.data || []).map((row) => ({
        id: String(row.id),
        name: String(row.name),
        category: String(row.category) as InventoryItem['category'],
        description: String(row.description ?? ''),
        quantity: Number(row.quantity ?? 1),
        costCoins: Number(row.cost_coins ?? 0),
        icon: String(row.icon ?? 'star'),
      }));

      const fallbackVillage = createInitialVillage(learnerId);
      const village: VillageState = vilRes.data
        ? {
            learnerId,
            villageName: String(vilRes.data.village_name || fallbackVillage.villageName),
            buildings: (vilRes.data.buildings || []) as VillageBuilding[],
            decorations: (vilRes.data.decorations || []) as VillageDecoration[],
            unlockedPlots: Array.isArray(vilRes.data.unlocked_plots)
              ? (vilRes.data.unlocked_plots as string[])
              : fallbackVillage.unlockedPlots,
            celebrationsSeen: Array.isArray(vilRes.data.celebrations_seen)
              ? (vilRes.data.celebrations_seen as string[])
              : [],
            timeOfDay: String(vilRes.data.time_of_day || 'morning') as VillageState['timeOfDay'],
          }
        : fallbackVillage;

      const artworks: SavedArtwork[] = (artRes.data || []).map((row) => ({
        id: String(row.id),
        learnerId: String(row.learner_id),
        title: String(row.title),
        motif: String(row.motif),
        dataUrl: String(row.data_url),
        starsEarned: Number(row.stars_earned ?? 3),
        displayedInGallery: Boolean(row.displayed_in_gallery),
        createdAt: String(row.created_at),
      }));

      return {
        learner: this.mapRowToLearner(learnerRow),
        progress,
        transactions,
        missions: missions.length ? missions : createInitialMissions(),
        achievements: achievements.length ? achievements : createInitialAchievements(),
        inventory: inventory.length ? inventory : createInitialInventory(),
        village,
        artworks,
      };
    }

    return this.readJson<LearnerBundleRecord>(`bundles/${learnerId}.json`);
  }

  async saveBundle(bundle: LearnerBundleRecord): Promise<void> {
    const driver = await this.getDriver();
    if (driver === 'postgres') {
      const { admin } = getClients();
      const l = bundle.learner;
      const { error: lErr } = await admin.from('kw_learners').upsert(
        {
          id: l.id,
          parent_id: l.parentId,
          name: l.name,
          age: l.age,
          class_name: l.className,
          companion_id: l.companionId,
          companion_level: l.companionLevel,
          companion_bond_xp: l.companionBondXp,
          avatar: l.avatar,
          coins: l.coins,
          stars: l.stars,
          xp: l.xp,
          level: l.level,
          gems: l.gems,
          energy: l.energy,
          streak_days: l.streakDays,
          last_active_date: l.lastActiveDate,
          onboarding_completed: l.onboardingCompleted,
          created_at: l.createdAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      );
      if (lErr) {
        throw new Error(`Gagal menyimpan profil murid: ${lErr.message}`);
      }

      const progressRows = Object.values(bundle.progress).map((p) => ({
        learner_id: l.id,
        subtopic_id: p.subtopicId,
        subject_id: p.subjectId,
        chapter_id: p.chapterId,
        lesson_completed: p.lessonCompleted,
        practice_completed: p.practiceCompleted,
        assessment_score: p.assessmentScore,
        attempts: p.attempts,
        best_accuracy: p.bestAccuracy,
        stars_earned: p.starsEarned,
        mastery_percent: p.masteryPercent,
        status: p.status,
        last_played_at: p.lastPlayedAt,
        next_revision_at: p.nextRevisionAt,
        weak_topics: p.weakTopics,
      }));
      if (progressRows.length) {
        await admin
          .from('kw_subtopic_progress')
          .upsert(progressRows, { onConflict: 'learner_id,subtopic_id' });
      }

      if (bundle.transactions.length) {
        await admin.from('kw_reward_transactions').upsert(
          bundle.transactions.map((t) => ({
            transaction_id: t.transactionId,
            learner_id: l.id,
            source_type: t.sourceType,
            source_id: t.sourceId,
            coins_delta: t.coinsDelta,
            stars_delta: t.starsDelta,
            xp_delta: t.xpDelta,
            gems_delta: t.gemsDelta,
            created_at: t.createdAt,
          })),
          { onConflict: 'transaction_id' },
        );
      }

      if (bundle.missions.length) {
        await admin.from('kw_missions').upsert(
          bundle.missions.map((m) => ({
            learner_id: l.id,
            id: m.id,
            title: m.title,
            description: m.description,
            subject_id: m.subjectId ?? null,
            target_count: m.targetCount,
            current_count: m.currentCount,
            reward_coins: m.rewardCoins,
            reward_stars: m.rewardStars,
            claimed: m.claimed,
            type: m.type,
          })),
          { onConflict: 'learner_id,id' },
        );
      }

      if (bundle.achievements.length) {
        await admin.from('kw_achievements').upsert(
          bundle.achievements.map((a) => ({
            learner_id: l.id,
            id: a.id,
            title: a.title,
            description: a.description,
            icon: a.icon,
            category: a.category,
            unlocked_at: a.unlockedAt ?? null,
          })),
          { onConflict: 'learner_id,id' },
        );
      }

      if (bundle.inventory.length) {
        await admin.from('kw_inventory').upsert(
          bundle.inventory.map((i) => ({
            learner_id: l.id,
            id: i.id,
            name: i.name,
            category: i.category,
            description: i.description,
            quantity: i.quantity,
            cost_coins: i.costCoins,
            icon: i.icon,
          })),
          { onConflict: 'learner_id,id' },
        );
      }

      await admin.from('kw_villages').upsert(
        {
          learner_id: l.id,
          village_name: bundle.village.villageName,
          buildings: bundle.village.buildings,
          decorations: bundle.village.decorations,
          unlocked_plots: bundle.village.unlockedPlots,
          celebrations_seen: bundle.village.celebrationsSeen,
          time_of_day: bundle.village.timeOfDay,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'learner_id' },
      );

      if (bundle.artworks.length) {
        await admin.from('kw_artworks').upsert(
          bundle.artworks.map((art) => ({
            id: art.id,
            learner_id: l.id,
            title: art.title,
            motif: art.motif,
            data_url: art.dataUrl,
            stars_earned: art.starsEarned,
            displayed_in_gallery: art.displayedInGallery,
            created_at: art.createdAt,
          })),
          { onConflict: 'id' },
        );
      }
      return;
    }

    await this.writeJson(`bundles/${bundle.learner.id}.json`, bundle);
    const indexPath = `parent-learners/${bundle.learner.parentId}.json`;
    const existing = (await this.readJson<{ learnerIds: string[] }>(indexPath)) || {
      learnerIds: [],
    };
    if (!existing.learnerIds.includes(bundle.learner.id)) {
      existing.learnerIds.push(bundle.learner.id);
      await this.writeJson(indexPath, existing);
    }
  }

  async ensureDemoParentAndLearner(): Promise<{
    parent: StoredParent;
    learners: LearnerProfile[];
  }> {
    const demoId = 'par-demo-mod';
    let parent = await this.getParentById(demoId);
    if (!parent) {
      parent = {
        id: demoId,
        name: 'Mod Demo Tetamu',
        email: 'demo@kampungwira.local',
        isDemo: true,
        pinCode: '1234',
        passwordHash: '',
        createdAt: new Date().toISOString(),
      };
      await this.saveParent(parent);
    }

    let learners = await this.getLearnersForParent(demoId);
    if (learners.length === 0) {
      const demoLearner = createNewLearner({
        id: 'lrn-demo-1',
        parentId: demoId,
        name: 'Wira Tetamu',
        className: 'Tahun 1 Bestari (Demo)',
        companionId: 'rimau',
        onboardingCompleted: true,
      });
      await this.createBundleForLearner(demoLearner);
      learners = [demoLearner];
    }

    return { parent, learners };
  }

  private mapRowToParent(row: Record<string, unknown>): StoredParent {
    return {
      id: String(row.id),
      authUserId: row.auth_user_id ? String(row.auth_user_id) : undefined,
      name: String(row.name),
      email: String(row.email),
      isDemo: Boolean(row.is_demo),
      pinCode: row.pin_code ? String(row.pin_code) : '1234',
      passwordHash: row.password_hash ? String(row.password_hash) : '',
      createdAt: String(row.created_at),
    };
  }

  private mapRowToLearner(row: Record<string, unknown>): LearnerProfile {
    return {
      id: String(row.id),
      parentId: String(row.parent_id),
      name: String(row.name),
      age: Number(row.age ?? 7),
      className: String(row.class_name ?? 'Tahun 1 Bestari'),
      companionId: String(row.companion_id ?? 'rimau') as LearnerProfile['companionId'],
      companionLevel: Number(row.companion_level ?? 1),
      companionBondXp: Number(row.companion_bond_xp ?? 0),
      avatar: row.avatar as LearnerProfile['avatar'],
      coins: Number(row.coins ?? 120),
      stars: Number(row.stars ?? 0),
      xp: Number(row.xp ?? 0),
      level: Number(row.level ?? 1),
      gems: Number(row.gems ?? 10),
      energy: Number(row.energy ?? 100),
      streakDays: Number(row.streak_days ?? 1),
      lastActiveDate: String(row.last_active_date ?? new Date().toISOString().slice(0, 10)),
      onboardingCompleted: Boolean(row.onboarding_completed),
      createdAt: String(row.created_at),
    };
  }
}

export const supabaseDb = new SupabaseDatabase();
