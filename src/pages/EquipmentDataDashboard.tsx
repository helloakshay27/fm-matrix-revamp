import React, { useState, useEffect } from 'react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
// Minimal table-only EquipmentDataDashboard. Fetches provided API and shows results using project base URL.

export const EquipmentDataDashboard = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = getFullUrl(`/pms/assets/get_equipments_data.json?page=${currentPage}`);
        const res = await fetch(url, {
          headers: {
            Authorization: getAuthHeader(),
            Accept: 'application/json',
          },
        });
        const payload = await res.json();
        // Support several possible shapes
        let items: any[] = [];
        if (Array.isArray(payload)) items = payload;
        else if (Array.isArray(payload.data)) items = payload.data;
        else if (Array.isArray(payload.equipments)) items = payload.equipments;
        else if (Array.isArray(payload.assets)) items = payload.assets;
        else if (Array.isArray(payload.records)) items = payload.records;
        else if (payload && typeof payload === 'object') items = [payload];
        setRows(items);
        // handle pagination info if present
        if (payload && payload.pagination) {
          const p = payload.pagination;
          setCurrentPage(Number(p.current_page) || currentPage);
          setPerPage(Number(p.per_page) || perPage);
          setTotalPages(Number(p.total_pages) || 1);
          setTotalRecords(Number(p.total_records) || 0);
        }
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  // derive columns from first row
  const columns = rows.length > 0 ? Array.from(new Set(Object.keys(rows[0]))) : [];

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="overflow-auto max-h-[60vh] border rounded">
        <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border px-2 py-1 text-left bg-gray-100">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((col) => (
                <td key={col} className="border px-2 py-1 align-top">
                  {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">{`Showing ${rows.length} of ${totalRecords} records`}</div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => goToPage(1)} disabled={currentPage === 1}>First</button>
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>

          {/* page window */}
          {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
            // center window around current page
            const half = Math.floor(Math.min(7, totalPages) / 2);
            let start = Math.max(1, currentPage - half);
            if (start + 6 > totalPages) start = Math.max(1, totalPages - 6);
            const pageNum = start + i;
            if (pageNum > totalPages) return null;
            return (
              <button key={pageNum} className={`px-2 py-1 border rounded ${pageNum === currentPage ? 'bg-brand text-white' : ''}`} onClick={() => goToPage(pageNum)}>
                {pageNum}
              </button>
            );
          })}

          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>
      </div>
    </div>
  );
}