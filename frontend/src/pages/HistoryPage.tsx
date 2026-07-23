import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Dices } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  getQuizzesDetail,
  getTambolaGamesDetail,
  QuizDetail,
  TambolaGameDetail,
} from '../api/metricsApi';

type HistoryItem =
  | { type: 'quiz'; data: QuizDetail }
  | { type: 'tambola'; data: TambolaGameDetail };

const ACTIVE_BADGE = { backgroundColor: '#F4F9F2', color: '#2B8000' };
const INACTIVE_BADGE = { backgroundColor: '#F7F7F8', color: '#71757B' };

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<{ type: 'quiz' | 'tambola'; id: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [quizzes, games] = await Promise.all([getQuizzesDetail(), getTambolaGamesDetail()]);
        const merged: HistoryItem[] = [
          ...quizzes.map((q): HistoryItem => ({ type: 'quiz', data: q })),
          ...games.map((g): HistoryItem => ({ type: 'tambola', data: g })),
        ].sort((a, b) => b.data.id - a.data.id);
        setItems(merged);
        if (merged.length > 0) {
          setSelected({ type: merged[0].type, id: merged[0].data.id });
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const selectedItem = items.find((i) => i.type === selected?.type && i.data.id === selected?.id);

  return (
    <PageWrapper>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <p className="text-gray-600">Browse past quizzes and Tambola games</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No quizzes or Tambola games yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-2 space-y-1 max-h-[70vh] overflow-y-auto">
            {items.map((item) => {
              const isSelected = selected?.type === item.type && selected.id === item.data.id;
              const Icon = item.type === 'quiz' ? BookOpen : Dices;
              return (
                <button
                  key={`${item.type}-${item.data.id}`}
                  onClick={() => setSelected({ type: item.type, id: item.data.id })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: isSelected ? '#F2EFF4' : 'transparent',
                    color: isSelected ? '#4B286D' : '#2A2C2E',
                  }}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{item.data.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="md:col-span-2">
            {selectedItem && selectedItem.type === 'quiz' && (
              <Card className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedItem.data.title}</h2>
                    <p className="text-sm text-gray-600">{selectedItem.data.topic}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={selectedItem.data.is_published ? ACTIVE_BADGE : INACTIVE_BADGE}
                  >
                    {selectedItem.data.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{selectedItem.data.question_count}</p>
                    <p className="text-xs text-gray-600">Questions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{selectedItem.data.session_count}</p>
                    <p className="text-xs text-gray-600">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{selectedItem.data.participant_count}</p>
                    <p className="text-xs text-gray-600">Participants</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => navigate(`/admin/results/${selectedItem.data.id}`)}>
                    View Results
                  </Button>
                  <Button variant="filled" className="flex-1" onClick={() => navigate(`/leaderboard/${selectedItem.data.id}`)}>
                    View Leaderboard
                  </Button>
                </div>
              </Card>
            )}

            {selectedItem && selectedItem.type === 'tambola' && (
              <Card className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedItem.data.title}</h2>
                    {selectedItem.data.host_name && (
                      <p className="text-sm text-gray-600">Hosted by {selectedItem.data.host_name}</p>
                    )}
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={selectedItem.data.is_active ? ACTIVE_BADGE : INACTIVE_BADGE}
                  >
                    {selectedItem.data.is_active ? 'Active' : 'Ended'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{selectedItem.data.ticket_count}</p>
                    <p className="text-xs text-gray-600">Tickets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{selectedItem.data.claim_count}</p>
                    <p className="text-xs text-gray-600">Claims</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: '#4B286D' }}>{selectedItem.data.verified_wins}</p>
                    <p className="text-xs text-gray-600">Verified Wins</p>
                  </div>
                </div>
                <Button variant="filled" className="w-full" onClick={() => navigate(`/admin/tambola/${selectedItem.data.id}/host`)}>
                  View Game
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
