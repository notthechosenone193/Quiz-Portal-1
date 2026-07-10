import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConnectionStatus } from '../components/ui/ConnectionStatus';
import { ConfirmDialog } from '../components/ui/Modal';
import { Copy, Check } from 'lucide-react';
import {
  getTambolaGame,
  getTambolaSessionForGame,
  createTambolaSession,
  drawTambolaNumber,
  verifyTambolaClaim,
  getTambolaState,
  endTambolaGame,
} from '../api/tambolaApi';
import { useTambolaSocket } from '../hooks/useTambolaSocket';
import { getSocket } from '../api/socketClient';
import { TambolaClaim } from '../types';

export default function TambolaHostPage() {
  const { gameId } = useParams<{ gameId: string }>();

  const [game, setGame] = useState<any>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [claims, setClaims] = useState<TambolaClaim[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoDrawEnabled, setAutoDrawEnabled] = useState(false);
  const [autoDrawCountdown, setAutoDrawCountdown] = useState(30);
  const [isEnded, setIsEnded] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const [gameData, sessionData] = await Promise.all([
          getTambolaGame(parseInt(gameId!)),
          getTambolaSessionForGame(parseInt(gameId!)),
        ]);
        setGame(gameData);
        if (sessionData.session) {
          const s = sessionData.session;
          setSessionCode(s.sessionCode);
          setShareUrl(s.shareUrl);
          setDrawnNumbers(s.drawnNumbers);
          setTicketCount(s.ticketCount);
          setClaims(s.claims);
          setIsEnded(!s.isActive);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      await endTambolaGame(parseInt(gameId!));
      setIsEnded(true);
      setShowEndConfirm(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsEnding(false);
    }
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const result = await createTambolaSession(parseInt(gameId!));
      setSessionCode(result.sessionCode);
      setShareUrl(result.shareUrl);
      setSuccess('Session started! Share the URL with participants.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawNumber = async () => {
    setIsDrawing(true);
    try {
      const result = await drawTambolaNumber(sessionCode!);
      setSuccess(`Number drawn: ${result.number}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDrawing(false);
    }
  };

  const handleVerifyClaim = async (claimId: number, verified: boolean) => {
    setIsVerifying(true);
    try {
      await verifyTambolaClaim(claimId, verified);
      setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, verified: verified ? 1 : 0 } : c)));
      setSuccess(verified ? 'Claim verified!' : 'Claim rejected!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Socket listener setup
  useTambolaSocket(sessionCode, {
    onParticipantJoined: (payload) => {
      setTicketCount(payload.ticketCount);
    },
    onNumberDrawn: (payload) => {
      setDrawnNumbers(payload.drawnNumbers);
    },
    onClaimSubmitted: (payload) => {
      setClaims((prev) => [
        {
          id: payload.claimId,
          ticket_id: -1,
          claim_type: payload.claimType,
          claimed_at: new Date().toISOString(),
          verified: payload.valid ? 1 : null,
          participant_name: payload.participantName,
        },
        ...prev,
      ]);
    },
    onClaimResult: (payload) => {
      setClaims((prev) =>
        prev.map((c) => (c.id === payload.claimId ? { ...c, verified: payload.verified } : c))
      );
    },
    onSessionEnded: () => {
      setIsEnded(true);
    },
  });

  // Auto-draw timer: 30-second countdown that auto-draws a number.
  // The interval only does a pure state transition — no side effects — because React's
  // StrictMode deliberately double-invokes state updater functions to catch impurity;
  // calling drawTambolaNumber() from inside the updater (as this used to) would draw
  // two numbers per tick instead of one.
  useEffect(() => {
    if (!autoDrawEnabled || !sessionCode) return;

    setAutoDrawCountdown(30);
    const interval = setInterval(() => {
      setAutoDrawCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [autoDrawEnabled, sessionCode]);

  // Fires the actual draw exactly once whenever the countdown wraps from 1 back to 30.
  const prevAutoDrawCountdownRef = useRef(autoDrawCountdown);
  useEffect(() => {
    if (autoDrawEnabled && sessionCode && prevAutoDrawCountdownRef.current === 1 && autoDrawCountdown === 30) {
      drawTambolaNumber(sessionCode).then((result) => {
        setSuccess(`Auto-drew: ${result.number}`);
      }).catch(() => {});
    }
    prevAutoDrawCountdownRef.current = autoDrawCountdown;
  }, [autoDrawCountdown, autoDrawEnabled, sessionCode]);

  // Poll for state updates
  useEffect(() => {
    if (!sessionCode) return;

    const interval = setInterval(async () => {
      try {
        const state = await getTambolaState(sessionCode);
        setTicketCount(state.ticketCount);
        setClaims(state.claims);
        if (state.drawnNumbers.length > drawnNumbers.length) {
          setDrawnNumbers(state.drawnNumbers);
        }
      } catch (err) {
        console.error('Failed to fetch state:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionCode, drawnNumbers.length]);

  if (isLoading && !game) return <LoadingSpinner />;
  if (!game) return <PageWrapper><p className="text-red-600">Game not found</p></PageWrapper>;

  const lastNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;
  const remaining = 99 - drawnNumbers.length;

  return (
    <PageWrapper>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{game.title}</h1>
                {isEnded && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#F7F7F8', color: '#71757B' }}
                  >
                    Ended
                  </span>
                )}
              </div>
              {game.host_name && <p className="text-gray-600">Hosted by {game.host_name}</p>}
            </div>
            {sessionCode && !isEnded && <ConnectionStatus socket={getSocket()} />}
          </div>

          {!sessionCode ? (
            <Button onClick={handleStartSession} isLoading={isLoading} className="w-full">
              Start Session
            </Button>
          ) : isEnded ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                <p className="text-sm text-gray-600">Participants Joined</p>
                <p className="text-3xl font-bold text-blue-600">{ticketCount}</p>
              </div>

              {/* Final numbers grid */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Final Numbers Called ({drawnNumbers.length}/99)</h2>
                <div className="grid grid-cols-9 sm:grid-cols-11 gap-0.5 sm:gap-1">
                  {Array.from({ length: 99 }, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      className={`aspect-square w-full min-w-[24px] flex items-center justify-center text-[10px] sm:text-xs font-bold rounded ${
                        drawnNumbers.includes(num)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-blue-900">Session Code</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={sessionCode}
                    className="flex-1 p-3 bg-white border border-blue-300 rounded font-mono text-lg font-bold"
                  />
                  <Button
                    onClick={handleCopyUrl}
                    variant="secondary"
                    className="px-3"
                    title="Copy session code"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-green-900">Share Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl || ''}
                    className="flex-1 p-2 bg-white border border-green-300 rounded text-sm"
                  />
                  <Button
                    onClick={handleCopyUrl}
                    variant="secondary"
                    className="px-3"
                    title="Copy share link"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                <p className="text-sm text-gray-600">Participants Joined</p>
                <p className="text-3xl font-bold text-blue-600">{ticketCount}</p>
              </div>

              {/* 99-Number Grid */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Numbers (1-99)</h2>
                <div className="grid grid-cols-9 sm:grid-cols-11 gap-0.5 sm:gap-1">
                  {Array.from({ length: 99 }, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      className={`aspect-square w-full min-w-[24px] flex items-center justify-center text-[10px] sm:text-xs font-bold rounded ${
                        drawnNumbers.includes(num)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Draw Controls */}
              <div className="bg-white rounded-lg shadow-md p-4 space-y-3 border border-[#D8D8D8]">
                {lastNumber && (
                  <div className="text-center">
                    <p className="text-sm text-[#54595F]">Last Number Drawn</p>
                    <p className="text-5xl font-bold" style={{ color: '#4B286D' }}>{lastNumber}</p>
                  </div>
                )}
                {remaining === 0 ? (
                  <div className="success-bg border border-success rounded-lg p-3 text-center">
                    <p className="font-semibold">All 99 numbers drawn — game complete!</p>
                  </div>
                ) : (
                  <p className="text-center text-[#54595F]">{remaining} numbers remaining</p>
                )}

                {/* Auto-draw toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: autoDrawEnabled ? '#F4F9F2' : '#F7F7F8', border: `1px solid ${autoDrawEnabled ? '#2B8000' : '#D8D8D8'}` }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: autoDrawEnabled ? '#2B8000' : '#54595F' }}>
                      Auto-Draw {autoDrawEnabled ? 'ON' : 'OFF'}
                    </p>
                    {autoDrawEnabled && (
                      <p className="text-xs" style={{ color: '#71757B' }}>
                        Next draw in <span className="font-bold" style={{ color: '#4B286D' }}>{autoDrawCountdown}s</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setAutoDrawEnabled((v) => !v)}
                    className="w-12 h-6 rounded-full transition-all relative"
                    style={{ backgroundColor: autoDrawEnabled ? '#2B8000' : '#D8D8D8' }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                      style={{ left: autoDrawEnabled ? '26px' : '2px' }}
                    />
                  </button>
                </div>

                {/* Auto-draw progress bar */}
                {autoDrawEnabled && (
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#D8D8D8' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${((30 - autoDrawCountdown) / 30) * 100}%`, backgroundColor: '#2B8000' }}
                    />
                  </div>
                )}

                <Button
                  onClick={handleDrawNumber}
                  isLoading={isDrawing}
                  className="w-full"
                  disabled={remaining === 0}
                  variant="filled"
                >
                  Draw Number Manually
                </Button>
              </div>

              <Button
                onClick={() => setShowEndConfirm(true)}
                variant="danger"
                className="w-full"
              >
                End Session
              </Button>
            </>
          )}
        </div>

        {/* Right Panel - Claims */}
        {sessionCode && (
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Claims</h2>
            {claims.length === 0 ? (
              <p className="text-gray-500 text-sm">No claims yet</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{claim.participant_name}</p>
                        <p className="text-sm text-gray-600">{claim.claim_type.replace(/_/g, ' ').toUpperCase()}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          claim.verified === null
                            ? 'bg-yellow-100 text-yellow-800'
                            : claim.verified === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {claim.verified === null ? 'PENDING' : claim.verified === 1 ? 'VALID' : 'REJECTED'}
                      </span>
                    </div>
                    {!isEnded && claim.verified === null && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVerifyClaim(claim.id, true)}
                          isLoading={isVerifying}
                          className="flex-1 text-xs py-1"
                          variant="primary"
                          aria-label={`Verify ${claim.participant_name}'s ${claim.claim_type.replace(/_/g, ' ')} claim`}
                        >
                          ✓ Verify
                        </Button>
                        <Button
                          onClick={() => handleVerifyClaim(claim.id, false)}
                          isLoading={isVerifying}
                          className="flex-1 text-xs py-1"
                          variant="danger"
                          aria-label={`Reject ${claim.participant_name}'s ${claim.claim_type.replace(/_/g, ' ')} claim`}
                        >
                          ✗ Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}

      <ConfirmDialog
        isOpen={showEndConfirm}
        onConfirm={handleEndSession}
        onCancel={() => setShowEndConfirm(false)}
        title="End this session?"
        message="This closes the game for everyone and can't be undone. Anyone still playing will see it as ended."
        confirmLabel="End Session"
        isDestructive
        isLoading={isEnding}
      />
    </PageWrapper>
  );
}
