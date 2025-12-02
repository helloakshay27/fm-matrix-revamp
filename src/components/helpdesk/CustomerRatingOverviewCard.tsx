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
			<div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
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

				<table className="min-w-[600px] w-full text-sm border-collapse text-center">
					<thead className="bg-[#ded9cd] text-[#b62527] font-semibold">
						<tr className="border-t border-gray-200 border-b border-gray-200">
							<th className="border-x border-gray-200 px-2 py-2 text-left w-48 whitespace-nowrap">Site Name</th>
							{table.headers.map((h, i) => (
								<th key={i} className="border-x border-gray-200 px-2 py-2 text-center whitespace-nowrap">{h}</th>
							))}
						</tr>
					</thead>

					<tbody>
								{table.rows.map((r, idx) => {
									const isTotal = r.label === 'Total %';
									return (
										<tr key={idx} className={isTotal ? 'bg-[#DAD6C9]' : ''}>
											<td className={`border-x border-gray-200 px-2 py-2 font-medium whitespace-nowrap ${isTotal ? '' : 'bg-[#F3F1EB80]'}`}>
												{r.label}
											</td>
											{r.values.map((v, j) => (
												<td key={j} className="border-x border-gray-200 px-2 py-2 text-center whitespace-nowrap">{v}</td>
											))}
										</tr>
									);
								})}
					</tbody>
				</table>
			</div>
	);
};

export default CustomerRatingOverviewCard;
