import { useEffect } from 'react';
import { getSocket, disconnect } from '../api/socketClient';

export function useSocket(sessionCode: string | null, onQuizStarted?: () => void) {
  useEffect(() => {
    if (!sessionCode) return;

    const socket = getSocket();

    const connectHandler = () => socket.emit('join-session', sessionCode);
    const quizStartedHandler = () => { if (onQuizStarted) onQuizStarted(); };

    socket.on('connect', connectHandler);
    if (socket.connected) socket.emit('join-session', sessionCode);
    socket.on('quiz-started', quizStartedHandler);

    return () => {
      socket.off('connect', connectHandler);
      socket.off('quiz-started', quizStartedHandler);
    };
  }, [sessionCode, onQuizStarted]);

  return {
    socket: getSocket(),
    disconnect,
  };
}
