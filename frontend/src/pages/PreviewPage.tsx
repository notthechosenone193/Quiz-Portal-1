import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { QuestionEditor } from '../components/quiz/QuestionEditor';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../components/ui/Modal';
import { Copy, Check, Plus, X, ListChecks, ToggleLeft } from 'lucide-react';
import { getQuiz, updateQuestion, deleteQuestion, createSession, createQuestion } from '../api/quizApi';
import { Quiz, Question } from '../types';

type QuestionFormat = 'MCQ' | 'TF';

const FORMAT_OPTIONS: { type: QuestionFormat; label: string; sub: string; icon: React.ReactNode; defaultOptions: string[]; defaultAnswer: string }[] = [
  {
    type: 'MCQ',
    label: 'Multiple Choice',
    sub: '4 answer options, one correct',
    icon: <ListChecks size={22} />,
    defaultOptions: ['Option A', 'Option B', 'Option C', 'Option D'],
    defaultAnswer: 'Option A',
  },
  {
    type: 'TF',
    label: 'True / False',
    sub: '2 options — True or False',
    icon: <ToggleLeft size={22} />,
    defaultOptions: ['True', 'False'],
    defaultAnswer: 'True',
  },
];

export default function PreviewPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await getQuiz(parseInt(quizId!));
        setQuiz(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [quizId]);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowFormatPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleUpdateQuestion = async (questionId: number, updates: Partial<Question>) => {
    setIsSaving(true);
    try {
      await updateQuestion(parseInt(quizId!), questionId, updates);
      setQuiz((prev) => {
        if (!prev) return null;
        return { ...prev, questions: prev.questions?.map((q) => q.id === questionId ? { ...q, ...updates } : q) };
      });
      setSuccess('Question updated');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    setDeleteTargetId(questionId);
  };

  const confirmDeleteQuestion = async () => {
    if (deleteTargetId === null) return;
    setIsDeleting(true);
    try {
      await deleteQuestion(parseInt(quizId!), deleteTargetId);
      setQuiz((prev) => {
        if (!prev) return null;
        return { ...prev, questions: prev.questions?.filter((q) => q.id !== deleteTargetId) };
      });
      setSuccess('Question deleted');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleGenerateLink = async () => {
    setIsSaving(true);
    try {
      const { shareUrl: url } = await createSession(parseInt(quizId!));
      setShareUrl(url);
      setSuccess('Share link generated!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddQuestion = async (format: typeof FORMAT_OPTIONS[0]) => {
    setShowFormatPicker(false);
    setIsAddingQuestion(true);
    try {
      const newQ = await createQuestion(parseInt(quizId!), {
        text: 'New question',
        options: format.defaultOptions,
        correct_answer: format.defaultAnswer,
        type: format.type,
      });
      setQuiz((prev) => {
        if (!prev) return null;
        return { ...prev, questions: [...(prev.questions || []), newQ] };
      });
      setSuccess(`${format.label} question added — click Edit to fill it in`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!quiz) return <PageWrapper><p className="text-red-600">Quiz not found</p></PageWrapper>;

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: '#4B286D' }}>{quiz.title}</h1>
          <p style={{ color: '#54595F' }}>{quiz.topic}</p>
          <p className="text-sm" style={{ color: '#71757B' }}>Timer: {quiz.timer_seconds}s per question</p>
        </div>

        {shareUrl && (
          <div className="rounded-lg p-4 space-y-2 border" style={{ backgroundColor: '#F2EFF4', borderColor: '#4B286D' }}>
            <p className="text-sm font-semibold" style={{ color: '#4B286D' }}>Share this link with participants:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 p-2 bg-white rounded text-sm text-gray-900 border"
                style={{ borderColor: '#D8D8D8' }}
              />
              <Button onClick={handleCopyUrl} variant="outlined" className="px-3">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold" style={{ color: '#4B286D' }}>
              Questions ({quiz.questions?.length || 0})
            </h2>
            <div className="flex items-center gap-3">

              {/* + button with format picker */}
              <div className="relative" ref={pickerRef}>
                <button
                  onClick={() => setShowFormatPicker((v) => !v)}
                  disabled={isAddingQuestion}
                  title="Add new question"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-md disabled:opacity-50"
                  style={{ backgroundColor: showFormatPicker ? '#1e5c00' : '#2B8000' }}
                >
                  {isAddingQuestion
                    ? <span className="text-sm" style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                    : showFormatPicker ? <X size={18} /> : <Plus size={20} />
                  }
                </button>

                {/* Format picker dropdown */}
                {showFormatPicker && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden z-50"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #D8D8D8', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: '#D8D8D8', backgroundColor: '#F7F7F8' }}>
                      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#54595F' }}>Choose question format</p>
                    </div>
                    {FORMAT_OPTIONS.map((fmt) => (
                      <button
                        key={fmt.type}
                        onClick={() => handleAddQuestion(fmt)}
                        className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all hover:bg-[#F4F9F2] group border-b last:border-b-0"
                        style={{ borderColor: '#F0F0F0' }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors"
                          style={{ backgroundColor: '#F2EFF4', color: '#4B286D' }}
                        >
                          {fmt.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#2A2C2E' }}>{fmt.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#71757B' }}>{fmt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!shareUrl && (
                <Button onClick={handleGenerateLink} isLoading={isSaving} variant="filled">
                  Generate Public Link
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {quiz.questions?.map((question) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onSave={(updates) => handleUpdateQuestion(question.id!, updates)}
                onDelete={() => handleDeleteQuestion(question.id!)}
                isLoading={isSaving}
              />
            ))}
          </div>
        </div>

        {shareUrl && (
          <Button onClick={() => navigate(`/admin/results/${quizId}`)} variant="secondary" className="w-full">
            View Results
          </Button>
        )}

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}

        <ConfirmDialog
          isOpen={deleteTargetId !== null}
          onConfirm={confirmDeleteQuestion}
          onCancel={() => setDeleteTargetId(null)}
          title="Delete question?"
          message="This question will be permanently removed from the quiz. This can't be undone."
          confirmLabel="Delete"
          isDestructive
          isLoading={isDeleting}
        />
      </div>
    </PageWrapper>
  );
}
