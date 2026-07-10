import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConnectionStatus } from '../components/ui/ConnectionStatus';
import { joinTambolaSession, submitTambolaClaim } from '../api/tambolaApi';
import { useTambolaSocket } from '../hooks/useTambolaSocket';
import { getSocket } from '../api/socketClient';
import { ClaimType } from '../types';

const CLAIM_LABELS: Record<ClaimType, string> = {
  early_five: 'Early Five',
  top_line: 'Top Line',
  middle_line: 'Middle Line',
  bottom_line: 'Bottom Line',
  full_house: 'Full House',
};

type Grid = (number | null)[][];

export default function TambolaGamePage() {
  const { sessionCode } = useParams<{ gameId: string; sessionCode: string }>();

  const [phase, setPhase] = useState<'joining' | 'playing' | 'finished' | 'ended'>('joining');
  const [name, setName] = useState('');
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [manuallyMarked, setManuallyMarked] = useState<Set<number>>(new Set());
  const [claimsSubmitted, setClaimsSubmitted] = useState<Set<ClaimType>>(new Set());
  const [claimResults, setClaimResults] = useState<{ type: ClaimType; valid: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nextDrawCountdown, setNextDrawCountdown] = useState<number>(30);

  // 30-second visual countdown for participant (resets on each new number drawn)
  useEffect(() => {
    if (phase !== 'playing') return;
    setNextDrawCountdown(30);
    const interval = setInterval(() => {
      setNextDrawCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [drawnNumbers.length, phase]);

  const handleJoin = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const data = await joinTambolaSession(sessionCode!, name);
      setTicketId(data.ticketId);
      setGrid(data.ticket);
      setDrawnNumbers(data.drawnNumbers);
      setPhase('playing');
      setSuccess('Joined! Waiting for game to start...');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkCell = (num: number) => {
    if (!drawnNumbers.includes(num)) return; // only allow marking called numbers
    setManuallyMarked((prev) => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  const handleClaim = async (claimType: ClaimType) => {
    setIsLoading(true);
    try {
      const result = await submitTambolaClaim(sessionCode!, ticketId!, claimType);
      setClaimsSubmitted((prev) => new Set([...prev, claimType]));
      setClaimResults((prev) => [...prev, { type: claimType, valid: result.valid }]);
      setSuccess(result.valid ? `${claimType} Claim Valid!` : 'Claim Invalid');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Socket updates
  useTambolaSocket(sessionCode ?? null, {
    onNumberDrawn: (payload) => {
      setDrawnNumbers(payload.drawnNumbers);
    },
    onSessionEnded: () => {
      setPhase('ended');
    },
  });

  const canClaim = (claimType: ClaimType): boolean => {
    if (!grid || claimsSubmitted.has(claimType)) return false;

    const drawn = new Set(drawnNumbers);
    const rowMarked = (r: number) => grid[r].every((c) => c === null || drawn.has(c));
    const ticketNumbers = grid.flat().filter((n): n is number => n !== null);

    switch (claimType) {
      case 'early_five':
        return ticketNumbers.filter((n) => drawn.has(n)).length >= 5;
      case 'top_line':
        return rowMarked(0);
      case 'middle_line':
        return rowMarked(1);
      case 'bottom_line':
        return rowMarked(2);
      case 'full_house':
        return ticketNumbers.every((n) => drawn.has(n));
      default:
        return false;
    }
  };

  // Tells the player how close they are to a claim they can't submit yet, instead of just
  // showing a disabled button with no explanation.
  const getClaimHint = (claimType: ClaimType): string | null => {
    if (!grid || claimsSubmitted.has(claimType) || canClaim(claimType)) return null;

    const drawn = new Set(drawnNumbers);
    const rowRemaining = (r: number) => grid[r].filter((c) => c !== null && !drawn.has(c)).length;
    const ticketNumbers = grid.flat().filter((n): n is number => n !== null);

    switch (claimType) {
      case 'early_five': {
        const matched = ticketNumbers.filter((n) => drawn.has(n)).length;
        return `Need ${5 - matched} more number${5 - matched === 1 ? '' : 's'} called`;
      }
      case 'top_line':
        return `Need ${rowRemaining(0)} more in top row`;
      case 'middle_line':
        return `Need ${rowRemaining(1)} more in middle row`;
      case 'bottom_line':
        return `Need ${rowRemaining(2)} more in bottom row`;
      case 'full_house': {
        const remaining = ticketNumbers.filter((n) => !drawn.has(n)).length;
        return `Need ${remaining} more number${remaining === 1 ? '' : 's'} called`;
      }
      default:
        return null;
    }
  };

  if (phase === 'joining') {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Join Tambola</h1>
            <p className="text-gray-600">Enter your name to begin playing</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
            <Button
              onClick={handleJoin}
              isLoading={isLoading}
              className="w-full"
              disabled={!name.trim()}
            >
              Join Game
            </Button>
          </div>

          {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        </div>
      </PageWrapper>
    );
  }

  if (phase === 'finished') {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">Game Complete!</h1>
          <p className="text-gray-600">Thank you for playing Tambola with Telus Digital</p>
        </div>
      </PageWrapper>
    );
  }

  if (phase === 'ended') {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">This game has ended</h1>
          <p className="text-gray-600">The host closed this session. Thanks for playing.</p>
        </div>
      </PageWrapper>
    );
  }

  if (!grid) {
    return <LoadingSpinner />;
  }

  const allNumbersDrawn = drawnNumbers.length >= 99;


  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-end">
          <ConnectionStatus socket={getSocket()} />
        </div>

        {allNumbersDrawn && (
          <div className="success-bg border border-success rounded-lg p-4 text-center">
            <p className="font-semibold">All numbers have been called — game complete!</p>
            <p className="text-sm text-outline mt-1">Finish submitting any remaining claims below.</p>
          </div>
        )}

        {/* Next draw countdown */}
        <div className="bg-white rounded-lg shadow-sm border border-[#D8D8D8] p-4 flex items-center gap-4">
          <div className="text-center min-w-[60px]">
            <p className="text-3xl font-bold" style={{ color: nextDrawCountdown <= 5 ? '#C12335' : '#4B286D' }}>{nextDrawCountdown}</p>
            <p className="text-xs text-[#71757B]">seconds</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#2A2C2E]">Next number in</p>
            <div className="mt-1 w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#D8D8D8' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${((30 - nextDrawCountdown) / 30) * 100}%`,
                  backgroundColor: nextDrawCountdown <= 5 ? '#C12335' : '#2B8000',
                }}
              />
            </div>
          </div>
          {drawnNumbers.length > 0 && (
            <div className="text-center min-w-[50px]">
              <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{drawnNumbers[drawnNumbers.length - 1]}</p>
              <p className="text-xs text-[#71757B]">last</p>
            </div>
          )}
        </div>

        {/* Called Numbers */}
        {drawnNumbers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#D8D8D8] p-4">
            <p className="text-sm font-semibold text-[#54595F] mb-2">Called Numbers (Last 10)</p>
            <div className="flex gap-1 overflow-x-auto">
              {drawnNumbers.slice(-10).map((num) => (
                <span
                  key={num}
                  className="px-3 py-1 text-sm font-bold whitespace-nowrap rounded-full"
                  style={{ backgroundColor: '#F2EFF4', color: '#4B286D' }}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ticket Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-700">Your Ticket</p>
            <p className="text-xs" style={{ color: '#71757B' }}>Tap a called number to mark it</p>
          </div>
          <div className="grid grid-cols-9 gap-0.5 sm:gap-2">
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isCalled = cell !== null && drawnNumbers.includes(cell);
                const isMarked = cell !== null && manuallyMarked.has(cell);
                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    type="button"
                    onClick={() => cell !== null && handleMarkCell(cell)}
                    disabled={cell === null}
                    aria-label={cell !== null ? `Number ${cell}${isMarked ? ', marked' : isCalled ? ', called' : ''}` : undefined}
                    className={`aspect-square w-full min-w-[28px] flex items-center justify-center rounded font-bold text-[11px] sm:text-sm transition-all select-none
                      ${cell === null
                        ? 'bg-gray-100 border border-gray-200 cursor-default'
                        : isMarked
                        ? 'bg-green-500 text-white border border-green-600 cursor-pointer scale-105'
                        : isCalled
                        ? 'bg-amber-100 border-2 border-amber-400 text-amber-800 cursor-pointer animate-pulse'
                        : 'bg-white text-gray-900 border border-gray-300 cursor-default'
                      }`}
                  >
                    {cell}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Claim Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <p className="text-sm font-medium text-gray-700">Claim Wins</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              ['early_five', 'top_line', 'middle_line', 'bottom_line', 'full_house'] as ClaimType[]
            ).map((claimType) => {
              const hint = getClaimHint(claimType);
              return (
                <div key={claimType} className="space-y-1">
                  <Button
                    onClick={() => handleClaim(claimType)}
                    disabled={!canClaim(claimType) || isLoading}
                    isLoading={isLoading}
                    variant={claimsSubmitted.has(claimType) ? 'secondary' : 'primary'}
                    className="text-xs py-2 w-full"
                  >
                    {claimsSubmitted.has(claimType)
                      ? `${CLAIM_LABELS[claimType]} ✓`
                      : CLAIM_LABELS[claimType]}
                  </Button>
                  {hint && <p className="text-xs text-outline text-center">{hint}</p>}
                </div>
              );
            })}
          </div>

          {/* Claim Results Feedback */}
          {claimResults.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Claim Results</p>
              <div className="space-y-1">
                {claimResults.map((result) => (
                  <p
                    key={result.type}
                    className={`text-sm ${
                      result.valid ? 'text-green-700 font-semibold' : 'text-red-700'
                    }`}
                  >
                    {result.type.replace(/_/g, ' ')}: {result.valid ? '✓ Verified' : '✗ Invalid'}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            {drawnNumbers.length} numbers drawn • {99 - drawnNumbers.length} remaining
          </p>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}
      </div>
    </PageWrapper>
  );
}
