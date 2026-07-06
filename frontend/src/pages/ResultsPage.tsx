import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { ResultsTable } from '../components/admin/ResultsTable';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { getResults, overrideAnswer, publishLeaderboard } from '../api/quizApi';
import { ResultRow } from '../types';

const PARTICIPANTS_PER_PAGE = 10;

export default function ResultsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<ResultRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getResults(parseInt(quizId!));
        setResults(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [quizId]);

  const handleOverride = async (answerId: number, isCorrect: boolean) => {
    try {
      await overrideAnswer(answerId, isCorrect);
      setResults((prev) =>
        prev.map((r) =>
          r.answer_id === answerId
            ? { ...r, admin_override: isCorrect ? 1 : 0 }
            : r
        )
      );
      setSuccess('Answer updated');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishLeaderboard(parseInt(quizId!));
      setSuccess('Leaderboard published!');
      setShowPublishConfirm(false);
      setTimeout(() => navigate(`/leaderboard/${quizId}`), 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  // Filter results based on search query
  const filteredResults = results.filter((result) =>
    result.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Results are grouped and rendered per-participant, so paginate by participant rather than raw row.
  const participantIds = Array.from(new Set(filteredResults.map((r) => r.participant_id)));
  const totalPages = Math.max(1, Math.ceil(participantIds.length / PARTICIPANTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageParticipantIds = new Set(
    participantIds.slice((currentPage - 1) * PARTICIPANTS_PER_PAGE, currentPage * PARTICIPANTS_PER_PAGE)
  );
  const pageResults = filteredResults.filter((r) => pageParticipantIds.has(r.participant_id));

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
          <p className="text-gray-600">Review and adjust participant answers</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-gray-600">No responses yet</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <input
                type="text"
                placeholder="Search by participant name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary transition-all"
              />
              <p className="text-sm text-gray-600 mt-2">
                Showing {filteredResults.length} of {results.length} responses across {participantIds.length} participant{participantIds.length === 1 ? '' : 's'}
              </p>
            </div>

            <ResultsTable
              results={pageResults}
              onOverride={handleOverride}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={PARTICIPANTS_PER_PAGE}
              totalItems={participantIds.length}
            />

            <Button
              onClick={() => setShowPublishConfirm(true)}
              className="w-full text-lg py-3"
              variant="filled"
            >
              Publish Leaderboard
            </Button>
          </>
        )}

        {error && (
          <Toast message={error} type="error" onClose={() => setError(null)} />
        )}

        {success && (
          <Toast message={success} type="success" onClose={() => setSuccess(null)} />
        )}

        <ConfirmDialog
          isOpen={showPublishConfirm}
          onConfirm={handlePublish}
          onCancel={() => setShowPublishConfirm(false)}
          title="Publish leaderboard?"
          message={`This makes rankings for ${participantIds.length} participant${participantIds.length === 1 ? '' : 's'} publicly visible at the leaderboard link. You can still override individual answers afterward.`}
          confirmLabel="Publish"
          isLoading={isPublishing}
        />
      </div>
    </PageWrapper>
  );
}
