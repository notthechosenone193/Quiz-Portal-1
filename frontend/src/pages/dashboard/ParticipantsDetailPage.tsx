import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Users } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { useSortedPagination } from '../../hooks/useSortedPagination';
import { getParticipantsDetail, ParticipantDetail } from '../../api/metricsApi';

const COLUMNS: { key: keyof ParticipantDetail; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'quiz_title', label: 'Quiz' },
  { key: 'answers_given', label: 'Answers' },
  { key: 'correct_count', label: 'Correct' },
  { key: 'total_time_ms', label: 'Total Time' },
];

export default function ParticipantsDetailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ParticipantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { pageData, sortKey, sortDir, toggleSort, currentPage, totalPages, setPage, pageSize, totalItems } =
    useSortedPagination(data, null, 10);

  useEffect(() => {
    getParticipantsDetail().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: '#4B286D' }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4F9F2' }}>
            <Users size={18} style={{ color: '#2B8000' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#4B286D' }}>All Participants</h1>
            <p className="text-sm" style={{ color: '#71757B' }}>{data.length} participants across all quizzes</p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-12 text-center">
            <p className="text-sm" style={{ color: '#71757B' }}>No participants yet — they'll show up here once someone takes a quiz.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-[#E8E8E8] overflow-hidden overflow-x-auto" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                    {COLUMNS.map(({ key, label }) => (
                      <th key={key}>
                        <button
                          onClick={() => toggleSort(key)}
                          className="w-full flex items-center gap-1 px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase hover:bg-black/5 transition-colors"
                          style={{ color: '#71757B' }}
                        >
                          {label}
                          {sortKey === key && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                        </button>
                      </th>
                    ))}
                    <th className="px-5 py-3 text-left text-xs font-semibold tracking-widest uppercase" style={{ color: '#71757B' }}>Correct %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {pageData.map((p) => {
                    const pct = p.answers_given > 0 ? Math.round((p.correct_count / p.answers_given) * 100) : 0;
                    const secs = Math.round(p.total_time_ms / 1000);
                    return (
                      <tr key={p.id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#2A2C2E' }}>{p.name}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{p.quiz_title}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{p.answers_given}</td>
                        <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#2B8000' }}>{p.correct_count}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{secs}s</td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: pct >= 60 ? '#F4F9F2' : pct >= 40 ? '#FFF9EE' : '#FFF6F8',
                              color: pct >= 60 ? '#2B8000' : pct >= 40 ? '#8C5415' : '#C12335',
                            }}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              totalItems={totalItems}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
