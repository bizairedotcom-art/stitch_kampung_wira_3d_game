import type {
  ActivityCompletionPayload,
  AuthResponse,
  LearnerBundleResponse,
  SyncBatchResponse,
  SyncQueueItem,
  TutorRequest,
  TutorResponse,
} from '@/types/api';
import type { LearnerProfile } from '@/types/user';
import type { SavedArtwork } from '@/types/village';
import type { BackendAdapter } from './backendAdapter';

const TOKEN_STORAGE_KEY = 'kampung-wira-laravel-token';

export class LaravelApiBackendAdapter implements BackendAdapter {
  readonly mode = 'LARAVEL_API' as const;
  readonly modeLabel = 'Pelayan Pengeluaran Laravel API';
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl.trim().replace(/\/+$/, '');
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private setToken(token?: string | null) {
    if (typeof window === 'undefined') return;
    try {
      if (token) {
        window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      // Ignore storage access restriction
    }
  }

  private buildUrl(endpointPath: string): string {
    return this.baseUrl ? `${this.baseUrl}${endpointPath}` : endpointPath;
  }

  private async request<T>(endpointPath: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const res = await fetch(this.buildUrl(endpointPath), {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      let message = `Ralat pelayan (${res.status})`;
      try {
        const errBody = (await res.json()) as { error?: string; message?: string };
        if (errBody.error) message = errBody.error;
        else if (errBody.message) message = errBody.message;
      } catch {
        // Ignore non-JSON error
      }
      throw new Error(message);
    }
    return (await res.json()) as T;
  }

  async getSession(): Promise<AuthResponse | null> {
    if (!this.getToken()) {
      // Check HttpOnly session cookie only when Laravel API is explicitly configured
      try {
        return await this.request<AuthResponse>('/api/v1/auth/me');
      } catch {
        return null;
      }
    }
    try {
      return await this.request<AuthResponse>('/api/v1/auth/me');
    } catch {
      this.setToken(null);
      return null;
    }
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
    pinCode?: string;
  }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async demoLogin(): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/v1/auth/demo', { method: 'POST' });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async logout(): Promise<{ ok: boolean }> {
    try {
      return await this.request<{ ok: boolean }>('/api/v1/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  createLearner(payload: Partial<LearnerProfile>): Promise<LearnerBundleResponse> {
    return this.request<LearnerBundleResponse>('/api/v1/learners', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getBundle(learnerId: string): Promise<LearnerBundleResponse> {
    return this.request<LearnerBundleResponse>(`/api/v1/learners/${learnerId}/bundle`);
  }

  updateLearner(learnerId: string, patch: Partial<LearnerProfile>): Promise<LearnerProfile> {
    return this.request<LearnerProfile>(`/api/v1/learners/${learnerId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  }

  submitProgress(
    learnerId: string,
    payload: ActivityCompletionPayload,
  ): Promise<{ applied: boolean; bundle: LearnerBundleResponse }> {
    return this.request<{ applied: boolean; bundle: LearnerBundleResponse }>(
      `/api/v1/learners/${learnerId}/progress`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  }

  claimMission(learnerId: string, missionId: string): Promise<LearnerBundleResponse> {
    return this.request<LearnerBundleResponse>(
      `/api/v1/learners/${learnerId}/missions/${missionId}/claim`,
      {
        method: 'POST',
      },
    );
  }

  buildBuilding(learnerId: string, buildingId: string): Promise<LearnerBundleResponse> {
    return this.request<LearnerBundleResponse>(`/api/v1/learners/${learnerId}/village/build`, {
      method: 'POST',
      body: JSON.stringify({ buildingId }),
    });
  }

  upgradeBuilding(learnerId: string, buildingId: string): Promise<LearnerBundleResponse> {
    return this.request<LearnerBundleResponse>(`/api/v1/learners/${learnerId}/village/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ buildingId }),
    });
  }

  placeDecoration(
    learnerId: string,
    catalogId: string,
    gridX: number,
    gridZ: number,
  ): Promise<LearnerBundleResponse> {
    return this.request<LearnerBundleResponse>(`/api/v1/learners/${learnerId}/village/place`, {
      method: 'POST',
      body: JSON.stringify({ catalogId, gridX, gridZ }),
    });
  }

  saveArtwork(
    learnerId: string,
    payload: { title: string; motif: string; dataUrl: string },
  ): Promise<SavedArtwork> {
    return this.request<SavedArtwork>(`/api/v1/learners/${learnerId}/artworks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  syncBatch(learnerId: string, items: SyncQueueItem[]): Promise<SyncBatchResponse> {
    return this.request<SyncBatchResponse>('/api/v1/sync', {
      method: 'POST',
      body: JSON.stringify({ learnerId, items }),
    });
  }

  askTutor(payload: TutorRequest): Promise<TutorResponse> {
    return this.request<TutorResponse>('/api/v1/tutor', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
