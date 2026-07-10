import { useMemo, useState } from 'react';

type SortDir = 'asc' | 'desc';

export function useSortedPagination<T>(data: T[], initialSortKey: keyof T | null = null, pageSize = 10) {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  return {
    pageData,
    sortKey,
    sortDir,
    toggleSort,
    currentPage,
    totalPages,
    setPage,
    pageSize,
    totalItems: sorted.length,
  };
}
