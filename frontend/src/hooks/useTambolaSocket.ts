import { useEffect } from 'react';
import { getSocket } from '../api/socketClient';
import { ClaimType } from '../types';

interface TambolaSocketCallbacks {
  onNumberDrawn?: (payload: { number: number; remaining: number; drawnNumbers: number[] }) => void;
  onClaimSubmitted?: (payload: { claimId: number; participantName: string; claimType: ClaimType; valid: boolean }) => void;
  onClaimResult?: (payload: { claimId: number; claimType: ClaimType; participantName: string; verified: number }) => void;
  onParticipantJoined?: (payload: { participantName: string; ticketCount: number }) => void;
}

export function useTambolaSocket(sessionCode: string | null, callbacks: TambolaSocketCallbacks) {
  useEffect(() => {
    if (!sessionCode) return;

    const socket = getSocket();

    const handleConnect = () => {
      socket.emit('join-tambola-session', sessionCode);
    };

    // Capture handler refs so cleanup removes only the exact listeners we registered
    const onNumberDrawn = callbacks.onNumberDrawn;
    const onClaimSubmitted = callbacks.onClaimSubmitted;
    const onClaimResult = callbacks.onClaimResult;
    const onParticipantJoined = callbacks.onParticipantJoined;

    socket.on('connect', handleConnect);
    if (socket.connected) {
      socket.emit('join-tambola-session', sessionCode);
    }

    if (onNumberDrawn) socket.on('tambola-number-drawn', onNumberDrawn);
    if (onClaimSubmitted) socket.on('tambola-claim-submitted', onClaimSubmitted);
    if (onClaimResult) socket.on('tambola-claim-result', onClaimResult);
    if (onParticipantJoined) socket.on('tambola-participant-joined', onParticipantJoined);

    return () => {
      socket.off('connect', handleConnect);
      if (onNumberDrawn) socket.off('tambola-number-drawn', onNumberDrawn);
      if (onClaimSubmitted) socket.off('tambola-claim-submitted', onClaimSubmitted);
      if (onClaimResult) socket.off('tambola-claim-result', onClaimResult);
      if (onParticipantJoined) socket.off('tambola-participant-joined', onParticipantJoined);
    };
  }, [sessionCode]);
}
