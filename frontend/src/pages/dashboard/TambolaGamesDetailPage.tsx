import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronUp, ChevronDown, Dices } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { useSortedPagination } from '../../hooks/useSortedPagination';
import { getTambolaGamesDetail, TambolaGameDetail } from '../../api/metricsApi';

const COLUMNS: { key: keyof TambolaGameDetail; label: string }[] = [
  { key: 'title', label: 'Game Title' },
  { key: 'host_name', label: 'Host' },
  { key: 'session_count', label: 'Sessions' },
  { key: 'ticket_count', label: 'Tickets' },
  { key: 'claim_count', label: 'Claims' },
  { key: 'verified_wins', label: 'Verified Wins' },
  { key: 'is_active', label: 'Status' },
];

export default function TambolaGamesDetailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<TambolaGameDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { pageData, sortKey, sortDir, toggleSort, currentPage, totalPages, setPage, pageSize, totalItems } =
    useSortedPagination(data, null, 10);

  useEffect(() => {
    getTambolaGamesDetail().then(setData).finally(() => setLoading(false));
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
            <Dices size={18} style={{ color: '#2B8000' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#4B286D' }}>All Tambola Games</h1>
            <p className="text-sm" style={{ color: '#71757B' }}>{data.length} games created</p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-12 text-center">
            <p className="text-sm" style={{ color: '#71757B' }}>No Tambola games yet — create one from the Tambola tab to see it here.</p>
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
                  {pageData.map((g) => (
                    <tr
                      key={g.id}
                      onClick={() => navigate(`/admin/tambola/${g.id}/host`)}
                      className="hover:bg-[#F9F9F9] cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#2A2C2E' }}>{g.title}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{g.host_name || '—'}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{g.session_count}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{g.ticket_count}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{g.claim_count}</td>
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#2B8000' }}>{g.verified_wins}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: g.is_active ? '#F4F9F2' : '#F7F7F8',
                            color: g.is_active ? '#2B8000' : '#71757B',
                          }}>
                          {g.is_active ? 'Active' : 'Ended'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ChevronRight size={14} className="text-[#D8D8D8] group-hover:text-[#2B8000] transition-colors" />
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
