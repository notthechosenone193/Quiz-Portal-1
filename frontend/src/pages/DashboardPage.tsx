import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, CheckCircle2, FileQuestion,
  Trophy, Layers, ChevronRight, Dices, Ticket, Star,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { getMetrics, DashboardMetrics, getQuizzesDetail, QuizDetail } from '../api/metricsApi';

const REFRESH_INTERVAL = 45_000;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [data, quizzes] = await Promise.all([getMetrics(), getQuizzesDetail()]);
      setMetrics(data);
      setAllQuizzes(quizzes);
      setLastUpdated(new Date());
    } catch (_) {}
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(() => fetchMetrics(true), REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchMetrics]);

  const statCards = metrics ? [
    {
      label: 'Total Quizzes',
      value: metrics.totalQuizzes,
      icon: BookOpen,
      color: '#4B286D',
      bg: '#F2EFF4',
      sub: `${metrics.totalSessions} sessions run`,
      route: '/admin/dashboard/quizzes',
    },
    {
      label: 'Total Participants',
      value: metrics.totalParticipants,
      icon: Users,
      color: '#2B8000',
      bg: '#F4F9F2',
      sub: 'across all quizzes',
      route: '/admin/dashboard/participants',
    },
    {
      label: 'Total Responses',
      value: metrics.totalAnswers,
      icon: FileQuestion,
      color: '#4B286D',
      bg: '#F2EFF4',
      sub: `${metrics.totalQuestions} questions total`,
      route: '/admin/dashboard/quizzes',
    },
    {
      label: 'Avg. Correct Rate',
      value: `${metrics.avgCorrectPct}%`,
      icon: CheckCircle2,
      color: metrics.avgCorrectPct >= 60 ? '#2B8000' : '#C12335',
      bg: metrics.avgCorrectPct >= 60 ? '#F4F9F2' : '#FFF6F8',
      sub: 'across all answers',
      route: '/admin/dashboard/participants',
    },
  ] : [];

  return (
    <PageWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#4B286D' }}>Live Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#71757B' }}>
            Auto-refreshes every 45s
            {lastUpdated && ` · Last updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>

        {/* Metric cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E8E8E8] p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.label}
                  onClick={() => navigate(card.route)}
                  className="group text-left bg-white rounded-xl border border-[#E8E8E8] p-5 space-y-3 hover:shadow-md hover:border-[#4B286D] transition-all cursor-pointer"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold" style={{ color: '#71757B' }}>{card.label}</p>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                      <Icon size={14} style={{ color: card.color }} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#71757B' }}>{card.sub}</p>
                    <ChevronRight size={12} className="text-[#D8D8D8] group-hover:text-[#4B286D] transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Charts */}
        {metrics && (
          <div className="grid md:grid-cols-2 gap-4">

            {/* Top quizzes */}
            <button
              onClick={() => navigate('/admin/dashboard/quizzes')}
              className="group text-left bg-white rounded-xl border border-[#E8E8E8] p-5 hover:shadow-md hover:border-[#4B286D] transition-all cursor-pointer"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy size={15} style={{ color: '#4B286D' }} />
                  <h3 className="text-sm font-bold" style={{ color: '#2A2C2E' }}>Top Quizzes by Participants</h3>
                </div>
                <ChevronRight size={14} className="text-[#D8D8D8] group-hover:text-[#4B286D] transition-colors" />
              </div>
              {metrics.topQuizzes.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: '#71757B' }}>No sessions run yet</p>
              ) : (
                <div className="space-y-3">
                  {metrics.topQuizzes.map((q, i) => {
                    const max = metrics.topQuizzes[0]?.participants || 1;
                    const pct = Math.round((q.participants / max) * 100);
                    return (
                      <div key={q.quiz_id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium truncate max-w-[70%]" style={{ color: '#2A2C2E' }}>
                            {i + 1}. {q.title}
                          </span>
                          <span className="text-xs font-bold" style={{ color: '#4B286D' }}>{q.participants} players</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F0F0F0' }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: i === 0 ? '#4B286D' : '#2B8000' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </button>

            {/* Quiz History — all quizzes */}
            <div className="bg-white rounded-xl border border-[#E8E8E8] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={15} style={{ color: '#2B8000' }} />
                  <h3 className="text-sm font-bold" style={{ color: '#2A2C2E' }}>Quiz History</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F2EFF4', color: '#4B286D' }}>
                  {allQuizzes.length} total
                </span>
              </div>
              {allQuizzes.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: '#71757B' }}>No quizzes yet</p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {allQuizzes.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => navigate(`/admin/preview/${q.id}`)}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all hover:bg-[#F7F7F8] group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: '#2A2C2E' }}>{q.title}</p>
                        <p className="text-xs truncate" style={{ color: '#71757B' }}>{q.topic} · {q.question_count} questions · {q.participant_count} participants</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: q.is_published ? '#F4F9F2' : '#F7F7F8',
                            color: q.is_published ? '#2B8000' : '#71757B',
                          }}
                        >
                          {q.is_published ? 'Published' : 'Draft'}
                        </span>
                        <ChevronRight size={13} className="text-[#D8D8D8] group-hover:text-[#4B286D] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── Tambola Section ── */}
        {metrics?.tambola && (
          <div className="space-y-4">

            {/* Section header */}
            <div className="flex items-center gap-2 pt-2">
              <Dices size={16} style={{ color: '#2B8000' }} />
              <h2 className="text-base font-bold" style={{ color: '#2A2C2E' }}>Tambola</h2>
              {metrics.tambola.topClaimType && (
                <span
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#F4F9F2', color: '#2B8000', border: '1px solid #2B8000' }}
                >
                  <Star size={11} />
                  Most claimed: {metrics.tambola.topClaimType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              )}
            </div>

            {/* 3 Tambola stat chips — clickable */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Games', value: metrics.tambola.totalGames, icon: Dices, color: '#4B286D', bg: '#F2EFF4', sub: `${metrics.tambola.totalSessions} sessions`, route: '/admin/dashboard/tambola-games' },
                { label: 'Tickets Issued', value: metrics.tambola.totalTickets, icon: Ticket, color: '#2B8000', bg: '#F4F9F2', sub: 'across all games', route: '/admin/dashboard/tambola-games' },
                { label: 'Verified Wins', value: metrics.tambola.verifiedWins, icon: CheckCircle2,
                  color: metrics.tambola.verifiedWins > 0 ? '#2B8000' : '#71757B',
                  bg: metrics.tambola.verifiedWins > 0 ? '#F4F9F2' : '#F7F7F8',
                  sub: `${metrics.tambola.totalClaims} total claims`,
                  route: '/admin/dashboard/tambola-claims' },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.label}
                    onClick={() => navigate(card.route)}
                    className="group text-left bg-white rounded-xl border border-[#E8E8E8] p-4 space-y-2 hover:shadow-md hover:border-[#4B286D] transition-all cursor-pointer"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold" style={{ color: '#71757B' }}>{card.label}</p>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                        <Icon size={13} style={{ color: card.color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs" style={{ color: '#71757B' }}>{card.sub}</p>
                      <ChevronRight size={11} className="text-[#D8D8D8] group-hover:text-[#4B286D] transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recent Tambola games */}
            <div className="bg-white rounded-xl border border-[#E8E8E8] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={15} style={{ color: '#2B8000' }} />
                <h3 className="text-sm font-bold" style={{ color: '#2A2C2E' }}>Recent Tambola Games</h3>
              </div>
              {metrics.tambola.recentGames.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: '#71757B' }}>No games created yet</p>
              ) : (
                <div className="space-y-1">
                  {metrics.tambola.recentGames.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => navigate(`/admin/tambola/${g.id}/host`)}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all hover:bg-[#F7F7F8] group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#2A2C2E' }}>{g.title}</p>
                        {g.host_name && (
                          <p className="text-xs truncate" style={{ color: '#71757B' }}>Hosted by {g.host_name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: g.is_active ? '#F4F9F2' : '#F7F7F8',
                            color: g.is_active ? '#2B8000' : '#71757B',
                          }}
                        >
                          {g.is_active ? 'Active' : 'Ended'}
                        </span>
                        <ChevronRight size={13} className="text-[#D8D8D8] group-hover:text-[#2B8000] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </PageWrapper>
  );
}
