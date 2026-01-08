import React from "react";

const SUPERSET_DASHBOARD_URL =
	"https://superset.lockated.com/superset/dashboard/b21f6dea-788d-4139-b37a-f95d2dca691d/?standalone=3&native_filters_key=GvRU_UwpVX4";

function SupersetDashboard() {
	return (
		<main className="p-4">
			<div className="mb-4">
				{/* <h1 className="text-xl font-semibold">Superset Dashboard</h1> */}
			</div>
			<div className="w-full h-[calc(100vh-160px)] overflow-hidden rounded-lg border border-gray-200 bg-white">
				<iframe
					src={SUPERSET_DASHBOARD_URL}
					title="Superset Dashboard"
					className="w-full h-full border-0"
					allow="clipboard-read; clipboard-write; fullscreen"
					referrerPolicy="no-referrer-when-downgrade"
				/>
			</div>
		</main>
	);
}

export default SupersetDashboard;

