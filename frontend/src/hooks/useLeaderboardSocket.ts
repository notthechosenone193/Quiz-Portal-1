import { useEffect } from 'react';
import { getSocket } from '../api/socketClient';
import { LeaderboardEntry } from '../types';

interface LeaderboardSocketCallbacks {
  onScoreUpdated?: (payload: { quizId: number; leaderboard: LeaderboardEntry[] }) => void;
}

export function useLeaderboardSocket(sessionCode: string | null, callbacks: LeaderboardSocketCallbacks) {
  useEffect(() => {
    if (!sessionCode) return;

    const socket = getSocket();

    const handleConnect = () => {
      socket.emit('join-session', sessionCode);
    };

    const onScoreUpdated = callbacks.onScoreUpdated;

    socket.on('connect', handleConnect);
    if (socket.connected) {
      socket.emit('join-session', sessionCode);
    }

    if (onScoreUpdated) socket.on('score-updated', onScoreUpdated);

    return () => {
      socket.off('connect', handleConnect);
      if (onScoreUpdated) socket.off('score-updated', onScoreUpdated);
    };
  }, [sessionCode]);
}
