import React, { useEffect } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { GameHud } from '@/components/layout/GameHud';
import { RewardCelebrationModal } from '@/components/layout/RewardCelebrationModal';
import { audioEngine } from '@/services/audioEngine';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { ActivityPlayerPage } from '@/pages/ActivityPlayerPage';
import { AssessmentPage } from '@/pages/AssessmentPage';
import { AuthPage } from '@/pages/AuthPage';
import { AvatarStudioPage } from '@/pages/AvatarStudioPage';
import { CompanionPage } from '@/pages/CompanionPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { LessonPlayerPage } from '@/pages/LessonPlayerPage';
import { AchievementsPage, MissionsPage, RevisionPage } from '@/pages/MissionsAndAchievementsPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { ParentDashboardPage } from '@/pages/ParentDashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SubjectDetailPage } from '@/pages/SubjectDetailPage';
import { SubjectsHubPage } from '@/pages/SubjectsHubPage';
import { VillageBuilderPage } from '@/pages/VillageBuilderPage';
import { VillagePage } from '@/pages/VillagePage';

const ProtectedShell: React.FC = () => {
  const { parent, learners, activeLearnerId, initialized } = useAuthStore();
  const loadLearnerBundle = useGameStore((s) => s.loadLearnerBundle);
  const bundle = useGameStore((s) => s.bundle);

  useEffect(() => {
    if (activeLearnerId && bundle?.learner.id !== activeLearnerId) {
      void loadLearnerBundle(activeLearnerId);
    }
  }, [activeLearnerId, bundle?.learner.id, loadLearnerBundle]);

  if (!initialized) {
    return <div className="min-h-screen flex items-center justify-center font-display font-bold text-xl">Membuka Pintu Gerbang Kampung Wira...</div>;
  }

  if (!parent) {
    return <Navigate to="/login" replace />;
  }

  if (learners.length === 0) {
    return <Navigate to="/onboarding/learner" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#351000]">
      <GameHud />
      <main>
        <Outlet />
      </main>
      <BottomNav />
      <RewardCelebrationModal />
    </div>
  );
};

export const App: React.FC = () => {
  const initSession = useAuthStore((s) => s.initSession);
  const setOnlineStatus = useGameStore((s) => s.setOnlineStatus);
  const settings = useSettingsStore();

  useEffect(() => {
    void initSession();
    audioEngine.configureVolumes({
      musicVolume: settings.musicVolume,
      sfxVolume: settings.sfxVolume,
      voiceVolume: settings.voiceVolume,
      voiceRate: settings.voiceRate,
      preferredVoiceUri: settings.preferredVoiceUri,
      muted: settings.muted,
    });

    const onOnline = () => setOnlineStatus(true);
    const onOffline = () => setOnlineStatus(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className={settings.reducedMotion ? 'reduced-motion' : ''}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/register" element={<AuthPage initialMode="register" />} />
            <Route path="/onboarding/learner" element={<OnboardingPage step="learner" />} />
            <Route path="/onboarding/avatar" element={<OnboardingPage step="avatar" />} />
            <Route path="/onboarding/companion" element={<OnboardingPage step="companion" />} />
            <Route path="/onboarding/village" element={<OnboardingPage step="village" />} />

            <Route element={<ProtectedShell />}>
              <Route path="/" element={<VillagePage />} />
              <Route path="/village" element={<VillagePage />} />
              <Route path="/subjects" element={<SubjectsHubPage />} />
              <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
              <Route path="/subjects/:subjectId/:chapterId" element={<SubjectDetailPage />} />
              <Route path="/learn/:lessonId" element={<LessonPlayerPage />} />
              <Route path="/play/:activityId" element={<ActivityPlayerPage />} />
              <Route path="/assessment/:assessmentId" element={<AssessmentPage />} />
              <Route path="/revision" element={<RevisionPage />} />
              <Route path="/missions" element={<MissionsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/avatar" element={<AvatarStudioPage />} />
              <Route path="/companion" element={<CompanionPage />} />
              <Route path="/build" element={<VillageBuilderPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/parent" element={<ParentDashboardPage />} />
              <Route path="/parent/*" element={<ParentDashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/village" replace />} />
          </Routes>
        </HashRouter>
      </div>
    </ErrorBoundary>
  );
};

export default App;
