import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { useSortedPagination } from '../../hooks/useSortedPagination';
import { getTambolaClaimsDetail, TambolaClaimDetail } from '../../api/metricsApi';

const COLUMNS: { key: keyof TambolaClaimDetail; label: string }[] = [
  { key: 'participant_name', label: 'Participant' },
  { key: 'game_title', label: 'Game' },
  { key: 'claim_type', label: 'Claim Type' },
  { key: 'verified', label: 'Status' },
  { key: 'claimed_at', label: 'Time' },
];

const CLAIM_LABELS: Record<string, string> = {
  early_five:   'Early Five',
  top_line:     'Top Line',
  middle_line:  'Middle Line',
  bottom_line:  'Bottom Line',
  full_house:   'Full House',
};

export default function TambolaClaimsDetailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<TambolaClaimDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { pageData, sortKey, sortDir, toggleSort, currentPage, totalPages, setPage, pageSize, totalItems } =
    useSortedPagination(data, null, 10);

  useEffect(() => {
    getTambolaClaimsDetail().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const verified = data.filter(c => c.verified === 1).length;
  const rejected = data.filter(c => c.verified === 0).length;
  const pending  = data.filter(c => c.verified === null).length;

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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4F9F2' }}>
              <CheckCircle2 size={18} style={{ color: '#2B8000' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#4B286D' }}>Tambola Claims</h1>
              <p className="text-sm" style={{ color: '#71757B' }}>{data.length} total claims</p>
            </div>
          </div>
          {/* Summary chips */}
          <div className="flex gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#F4F9F2', color: '#2B8000' }}>✓ {verified} Verified</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF6F8', color: '#C12335' }}>✗ {rejected} Rejected</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF9EE', color: '#8C5415' }}>⏳ {pending} Pending</span>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E8E8] p-12 text-center">
            <p className="text-sm" style={{ color: '#71757B' }}>No claims yet — they'll show up here once players start claiming wins.</p>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {pageData.map((c) => {
                    const isVerified = c.verified === 1;
                    const isRejected = c.verified === 0;
                    return (
                      <tr key={c.id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#2A2C2E' }}>{c.participant_name}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: '#54595F' }}>{c.game_title}</td>
                        <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#4B286D' }}>
                          {CLAIM_LABELS[c.claim_type] ?? c.claim_type}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: isVerified ? '#F4F9F2' : isRejected ? '#FFF6F8' : '#FFF9EE',
                              color: isVerified ? '#2B8000' : isRejected ? '#C12335' : '#8C5415',
                            }}>
                            {isVerified ? '✓ Verified' : isRejected ? '✗ Rejected' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: '#71757B' }}>
                          {new Date(c.claimed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
