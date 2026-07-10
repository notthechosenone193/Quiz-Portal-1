import React from 'react';
import { ResultRow } from '../../types';
import { Button } from '../ui/Button';

interface ResultsTableProps {
  results: ResultRow[];
  onOverride: (answerId: number, isCorrect: boolean) => void;
  isLoading?: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onOverride, isLoading = false }) => {
  if (results.length === 0) {
    return <p className="text-gray-500">No results yet.</p>;
  }

  const groupedByParticipant = results.reduce(
    (acc, row) => {
      if (!acc[row.participant_id]) {
        acc[row.participant_id] = { name: row.name, answers: [] };
      }
      acc[row.participant_id].answers.push(row);
      return acc;
    },
    {} as Record<number, { name: string; answers: ResultRow[] }>
  );

  return (
    <div className="space-y-6">
      {Object.entries(groupedByParticipant).map(([participantId, { name, answers }]) => (
        <div key={participantId} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-100 px-6 py-3 border-b" style={{ backgroundColor: '#E8F5E9' }}>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Question</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Their Answer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Correct Answer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time (ms)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {answers.map((answer) => {
                  const actualCorrect =
                    answer.admin_override !== null ? answer.admin_override : answer.is_correct;
                  const isCorrect = actualCorrect === 1;

                  const answerIsCorrect = actualCorrect === 1;

                  return (
                    <tr key={answer.answer_id} className="hover:bg-[#F7F7F8]">
                      <td className="px-6 py-3 text-sm text-[#2A2C2E]">{answer.text}</td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className="inline-block px-3 py-1 font-semibold text-sm"
                          style={{
                            borderRadius: '9999px',
                            backgroundColor: answerIsCorrect ? '#F4F9F2' : '#FFF6F8',
                            color: answerIsCorrect ? '#2B8000' : '#C12335',
                            border: `1.5px solid ${answerIsCorrect ? '#2B8000' : '#C12335'}`,
                          }}
                        >
                          {answer.selected_answer || '(No answer)'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#54595F]">{answer.correct_answer}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{answer.time_taken_ms}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-1">
                          <Button
                            variant={isCorrect ? 'primary' : 'secondary'}
                            onClick={() => onOverride(answer.answer_id, true)}
                            isLoading={isLoading}
                            className="text-xs px-2 py-1"
                          >
                            ✓
                          </Button>
                          <Button
                            variant={!isCorrect ? 'danger' : 'secondary'}
                            onClick={() => onOverride(answer.answer_id, false)}
                            isLoading={isLoading}
                            className="text-xs px-2 py-1"
                          >
                            ✗
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
