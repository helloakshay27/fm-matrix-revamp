import React, { useMemo } from 'react';
import { Download } from 'lucide-react';

interface Props { 
	data: any;
	onDownload?: () => void;
}

// Mirror PDF: headers = site names; rows for Excellent, Good, Average, Bad, Poor, Total %
export const CustomerRatingOverviewCard: React.FC<Props> = ({ data, onDownload }) => {
	// Expect data shape similar to AllContent: data.site_performance.data[] with site fields
	const table = useMemo(() => {
		const sitePerf = data?.data?.site_performance ?? data?.site_performance ?? null;
		const rows: Array<{ label: string; values: string[] }> = [];
		const headers: string[] = Array.isArray(sitePerf?.data) ? sitePerf.data.map((s: any) => s.site_name || s.site || '-') : [];
		const labels: Record<string, string> = {
			excellent: 'Excellent',
			good: 'Good',
			average: 'Average',
			bad: 'Bad',
			poor: 'Poor',
			total_percentage: 'Total %',
		};

		if (Array.isArray(sitePerf?.data)) {
			Object.entries(labels).forEach(([key, label]) => {
				rows.push({
					label,
					values: sitePerf.data.map((site: any) => String(site?.[key] ?? '0%')),
				});
			});
		}
		return { headers, rows };
	}, [data]);

	return (
			<div className="bg-white border border-gray-200 rounded-md p-4">
				<div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3">
					<h3 className="flex-1"
						style={{
							fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
							fontWeight: 600,
							fontSize: '16px',
							lineHeight: '100%',
							letterSpacing: '0%'
						}}>Site Performance: Customer Rating Overview</h3>
					{onDownload && (
						<Download
							data-no-drag="true"
							className="w-5 h-5 cursor-pointer text-[#000000] hover:text-[#333333] transition-colors z-50 flex-shrink-0"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDownload();
							}}
							onPointerDown={(e) => {
								e.stopPropagation();
							}}
							onMouseDown={(e) => {
								e.stopPropagation();
							}}
							style={{ pointerEvents: 'auto' }}
						/>
					)}
				</div>

				<div className="rounded-xl overflow-hidden border border-gray-200">
				<div className="overflow-x-auto">
				<table className="min-w-[600px] w-full text-sm text-center">
					<thead>
						<tr>
							<th className="px-3 py-2.5 text-left w-48 whitespace-nowrap text-white font-semibold analytics-header" style={{ backgroundColor: '#D97655' }}>Site Name</th>
							{table.headers.map((h, i) => (
								<th key={i} className="px-3 py-2.5 whitespace-nowrap text-white font-semibold analytics-header" style={{ backgroundColor: '#D97655' }}>{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{table.rows.map((r, idx) => {
							const isTotal = r.label === 'Total %';
							return (
								<tr key={idx} style={{ backgroundColor: isTotal ? '#EFEFFB' : idx % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
									<td className="px-3 py-2.5 font-medium whitespace-nowrap border-b border-gray-100">{r.label}</td>
									{r.values.map((v, j) => (
										<td key={j} className="px-3 py-2.5 text-center whitespace-nowrap border-b border-gray-100">{v}</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
				</div>
				</div>
			</div>
	);
};

export default CustomerRatingOverviewCard;
