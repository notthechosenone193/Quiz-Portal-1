import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { createTambolaGame } from '../api/tambolaApi';
import { ClaimType } from '../types';

const CLAIM_TYPES: { id: ClaimType; label: string }[] = [
  { id: 'early_five', label: 'Early Five' },
  { id: 'top_line', label: 'Top Line' },
  { id: 'middle_line', label: 'Middle Line' },
  { id: 'bottom_line', label: 'Bottom Line' },
  { id: 'full_house', label: 'Full House' },
];

export default function TambolaSetupPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [hostName, setHostName] = useState('');
  const [winConditions, setWinConditions] = useState<Set<ClaimType>>(
    new Set(CLAIM_TYPES.map((ct) => ct.id))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggleCondition = (id: ClaimType) => {
    const newSet = new Set(winConditions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setWinConditions(newSet);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please enter a game title');
      return;
    }
    if (winConditions.size === 0) {
      setError('Please select at least one win condition');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createTambolaGame(title, hostName, Array.from(winConditions));
      setSuccess('Game created! Redirecting to host page...');
      setTimeout(() => navigate(`/admin/tambola/${result.gameId}/host`), 1500);
    } catch (err) {
      setError((err as Error).message || 'Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Tambola Game</h1>
          <p className="text-gray-600">Set up a new game and start playing with Telus Digital</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Game Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., 'Office Tambola' or 'Family Game Night'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Host Name (optional)</label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Win Conditions (select at least one)
            </label>
            <div className="space-y-2">
              {CLAIM_TYPES.map((claim) => (
                <label key={claim.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={winConditions.has(claim.id)}
                    onChange={() => handleToggleCondition(claim.id)}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-gray-700">{claim.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreate}
            isLoading={isLoading}
            className="w-full text-lg py-3"
            disabled={isLoading || !title.trim() || winConditions.size === 0}
          >
            Create Game
          </Button>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        {success && (
          <Toast message={success} type="success" onClose={() => setSuccess(null)} autoClose={1500} />
        )}
      </div>
    </PageWrapper>
  );
}
