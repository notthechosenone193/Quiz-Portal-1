import React, { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  socket: Socket;
}

type Status = 'live' | 'reconnecting' | 'offline';

const STATUS_CONFIG: Record<Status, { label: string; Icon: typeof Wifi; className: string }> = {
  live: { label: 'Live', Icon: Wifi, className: 'text-success' },
  reconnecting: { label: 'Reconnecting…', Icon: Loader2, className: 'text-warning' },
  offline: { label: 'Offline', Icon: WifiOff, className: 'text-error' },
};

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ socket }) => {
  const [status, setStatus] = useState<Status>(socket.connected ? 'live' : 'reconnecting');

  useEffect(() => {
    const handleConnect = () => setStatus('live');
    const handleDisconnect = () => setStatus('offline');
    const handleReconnectAttempt = () => setStatus('reconnecting');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect_attempt', handleReconnectAttempt);
    socket.on('reconnect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect_attempt', handleReconnectAttempt);
      socket.off('reconnect', handleConnect);
    };
  }, [socket]);

  const { label, Icon, className } = STATUS_CONFIG[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-md font-medium bg-surface border border-outline-variant ${className}`}
    >
      <Icon size={12} className={status === 'reconnecting' ? 'animate-spin' : ''} />
      {label}
    </div>
  );
};
