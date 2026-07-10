import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronUp, ChevronDown, BookOpen } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { useSortedPagination } from '../../hooks/useSortedPagination';
import { getQuizzesDetail, QuizDetail } from '../../api/metricsApi';

const COLUMNS: { key: keyof QuizDetail; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'topic', label: 'Topic' },
  { key: 'question_count', label: 'Questions' },
  { key: 'session_count', label: 'Sessions' },
  { key: 'participant_count', label: 'Participants' },
  { key: 'is_published', label: 'Status' },
];

export default function QuizzesDetailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { pageData, sortKey, sortDir, toggleSort, currentPage, totalPages, setPage, pageSize, totalItems } =
    useSortedPagination(data, null, 10);

  useEffect(() => {
    getQuizzesDetail().then(setData).finally(() => setLoading(false));
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F2EFF4' }}>
            <BookOpen size={18} style={{ color: '#4B286D' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#4B286D' }}>All Quizzes</h1>
            <p className="text-sm" style={{ color: '#71757B' }}>{data.length} quizzes total</p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-12 text-center">
            <p className="text-sm" style={{ color: '#71757B' }}>No quizzes yet — create one from the Quiz tab to see it here.</p>
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
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {pageData.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => navigate(`/admin/preview/${q.id}`)}
                      className="hover:bg-[#F9F9F9] cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#2A2C2E' }}>{q.title}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{q.topic}</td>
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#4B286D' }}>{q.question_count}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{q.session_count}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{q.participant_count}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: q.is_published ? '#F4F9F2' : '#F7F7F8',
                            color: q.is_published ? '#2B8000' : '#71757B',
                          }}>
                          {q.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ChevronRight size={14} className="text-[#D8D8D8] group-hover:text-[#4B286D] transition-colors" />
                      </td>
                    </tr>
                  ))}
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
