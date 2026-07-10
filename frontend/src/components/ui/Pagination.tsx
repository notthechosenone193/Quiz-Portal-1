import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const rangeStart = pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const rangeEnd =
    pageSize && totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : undefined;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 px-2 py-3">
      <p className="text-label-md text-outline">
        {rangeStart !== undefined && rangeEnd !== undefined && totalItems !== undefined
          ? `Showing ${rangeStart}-${rangeEnd} of ${totalItems}`
          : ''}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-outline text-on-surface disabled:opacity-38 disabled:cursor-not-allowed hover:bg-surface-dim transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-label-md text-on-surface px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="p-2 rounded-lg border border-outline text-on-surface disabled:opacity-38 disabled:cursor-not-allowed hover:bg-surface-dim transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};
