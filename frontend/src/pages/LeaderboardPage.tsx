import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeaderboardTable } from '../components/admin/LeaderboardTable';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConnectionStatus } from '../components/ui/ConnectionStatus';
import { getLeaderboard, getQuiz, getActiveSession } from '../api/quizApi';
import { useLeaderboardSocket } from '../hooks/useLeaderboardSocket';
import { getSocket } from '../api/socketClient';
import { LeaderboardEntry } from '../types';
import { getBackgroundElement } from '../components/themes';
import { BackgroundFlares } from '../components/ui/BackgroundFlares';

export default function LeaderboardPage() {
  const { quizId } = useParams<{ quizId: string }>();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [themeEl, setThemeEl] = useState<React.ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, quiz] = await Promise.all([
          getLeaderboard(parseInt(quizId!)),
          getQuiz(parseInt(quizId!)),
        ]);
        setLeaderboard(data);
        if (quiz?.theme) {
          setThemeEl(getBackgroundElement(quiz.theme));
        }
        try {
          const activeSession = await getActiveSession(parseInt(quizId!));
          setSessionCode(activeSession.sessionCode);
        } catch {
          // No session found (e.g. quiz was never shared) — leaderboard just won't receive live pushes.
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [quizId]);

  useLeaderboardSocket(sessionCode, {
    onScoreUpdated: (payload) => {
      if (payload.quizId === parseInt(quizId!)) {
        setLeaderboard(payload.leaderboard);
      }
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative">
      {themeEl ?? <BackgroundFlares />}

      {themeEl && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
      )}

      <div className="relative max-w-3xl mx-auto px-4 py-12 space-y-6" style={{ zIndex: 2 }}>
        {sessionCode && (
          <div className="flex justify-center">
            <ConnectionStatus socket={getSocket()} />
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold" style={{
            color: themeEl ? '#ffffff' : '#4B286D',
            textShadow: themeEl ? '0 2px 16px rgba(0,0,0,0.9)' : 'none',
          }}>
            Leaderboard
          </h1>
          <p style={{ color: themeEl ? 'rgba(255,255,255,0.85)' : '#54595F' }}>Final Rankings</p>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-center py-8" style={{ color: themeEl ? 'rgba(255,255,255,0.7)' : '#71757B' }}>
            No participants yet
          </p>
        ) : (
          <div style={themeEl ? {
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
          } : {}}>
            <LeaderboardTable leaderboard={leaderboard} />
          </div>
        )}

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </div>
    </div>
  );
}
