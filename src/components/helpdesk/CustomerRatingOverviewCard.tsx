import React, { useMemo } from 'react';

interface Props { data: any }

// Mirror PDF: headers = site names; rows for Excellent, Good, Average, Bad, Poor, Total %
export const CustomerRatingOverviewCard: React.FC<Props> = ({ data }) => {
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
			<h3 className="font-semibold text-base mb-4">Site Performance: Customer Rating Overview</h3>
			<table className="min-w-[600px] w-full text-sm border">
				<thead className="bg-[#DAD6C9] text-[#C72030]">
					<tr>
						<th className="border px-2 py-2 text-left w-48">Rating</th>
						{table.headers.map((h, i) => (
							<th key={i} className="border px-2 py-2 text-center">{h}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{table.rows.map((r, idx) => (
						<tr key={idx}>
							<td className="border px-2 py-2 font-medium bg-[#F3F1EB80]">{r.label}</td>
							{r.values.map((v, j) => (
								<td key={j} className="border px-2 py-2 text-center">{v}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CustomerRatingOverviewCard;
