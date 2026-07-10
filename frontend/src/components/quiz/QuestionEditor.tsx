import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../../types';
import { Trash2, Check, Loader2 } from 'lucide-react';

interface QuestionEditorProps {
  question: Question;
  onSave?: (updates: Partial<Question>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onDelete,
}) => {
  const [text, setText] = useState(question.text);
  const [options, setOptions] = useState<string[]>(question.options);
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirst = useRef(true);

  // Auto-save with 800ms debounce on any field change
  const triggerSave = useCallback((newText: string, newOptions: string[], newCorrect: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus('saving');
    debounceRef.current = setTimeout(async () => {
      await onSave?.({ text: newText, options: newOptions, correct_answer: newCorrect });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  }, [onSave]);

  // Skip first render (don't auto-save on mount)
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    triggerSave(text, options, correctAnswer);
  }, [text, options, correctAnswer]);

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    // If the changed option was the correct answer, follow the rename
    if (options[idx] === correctAnswer) setCorrectAnswer(value);
    setOptions(updated);
  };

  return (
    <div
      className="bg-white rounded-lg border transition-all"
      style={{ borderColor: '#E8E8E8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      {/* Header row: type badge + auto-save indicator + delete */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: '#F0F0F0', backgroundColor: '#FAFAFA', borderRadius: '8px 8px 0 0' }}>
        <span
          className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded"
          style={{
            backgroundColor: question.type === 'TF' ? '#F2EFF4' : '#F4F9F2',
            color: question.type === 'TF' ? '#4B286D' : '#2B8000',
          }}
        >
          {question.type === 'TF' ? 'True / False' : 'Multiple Choice'}
        </span>

        <div className="flex items-center gap-3">
          {/* Auto-save status */}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#71757B' }}>
              <Loader2 size={11} className="animate-spin" /> Saving…
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#2B8000' }}>
              <Check size={11} /> Saved
            </span>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-[#D8D8D8] hover:text-[#C12335] transition-colors"
              title="Delete question"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Question text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Enter your question…"
          className="w-full text-sm resize-none bg-transparent border-0 border-b focus:outline-none focus:border-b-2 transition-all"
          style={{
            color: '#2A2C2E',
            borderColor: '#E8E8E8',
            fontWeight: 500,
            lineHeight: '1.5',
            paddingBottom: '6px',
          }}
        />

        {/* Options */}
        <div className="grid grid-cols-2 gap-2">
          {options.map((option, idx) => {
            const isCorrect = option === correctAnswer;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all group"
                style={{
                  border: `1.5px solid ${isCorrect ? '#2B8000' : '#E8E8E8'}`,
                  backgroundColor: isCorrect ? '#F4F9F2' : '#FAFAFA',
                }}
                onClick={() => setCorrectAnswer(option)}
                title="Click to mark as correct"
              >
                {/* Correct indicator */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all"
                  style={{
                    borderColor: isCorrect ? '#2B8000' : '#D8D8D8',
                    backgroundColor: isCorrect ? '#2B8000' : 'transparent',
                  }}
                >
                  {isCorrect && <Check size={9} color="white" strokeWidth={3} />}
                </div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs bg-transparent border-none focus:outline-none min-w-0"
                  style={{ color: isCorrect ? '#2B8000' : '#54595F', fontWeight: isCorrect ? 600 : 400 }}
                  placeholder={`Option ${idx + 1}`}
                />
              </div>
            );
          })}
        </div>

        <p className="text-xs" style={{ color: '#71757B' }}>Click an option to mark it as correct</p>
      </div>
    </div>
  );
};
