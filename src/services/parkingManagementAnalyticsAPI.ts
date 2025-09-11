import { apiClient } from '@/utils/apiClient';

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export type ParkingAllocationRow = {
  site: string;
  Free: number;
  Paid: number;
  Vacant: number;
};

const parkingManagementAnalyticsAPI = {
  async getParkingAllocationOverview(fromDate: Date, toDate: Date): Promise<ParkingAllocationRow[]> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/parking_date_site_wise?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    const payload = resp.data;
    const root = payload?.data ?? payload ?? {};

    // Preferred: data.parking_management.site_wise_details
    const pm = root?.parking_management ?? null;
    if (pm && Array.isArray(pm.site_wise_details)) {
      return pm.site_wise_details.map((d: any) => ({
        site: d.site_name || d.site || '-',
        Free: Number(d.free_parking_available ?? 0),
        Paid: Number(d.paid_parking_available ?? 0),
        Vacant: Number(d.vacant_spaces ?? 0),
      }));
    }

    // Fallback: data.parking_management.chart_data
    if (pm?.chart_data) {
      const categories: any[] = pm?.chart_data?.x_axis?.categories ?? [];
      const series: any[] = pm?.chart_data?.series ?? [];
      if (Array.isArray(categories) && Array.isArray(series) && categories.length) {
        const findSeries = (type: string, namePattern?: RegExp) =>
          series.find((s: any) => (s?.type && s.type === type) || (namePattern && s?.name && namePattern.test(String(s.name))));

        const allocated = findSeries('allocated', /alloc/i);
        const vacant = findSeries('vacant', /vacant/i);

        return categories.map((site: any, idx: number) => ({
          site: String(site ?? '-'),
          Free: 0,
          Paid: Number(allocated?.data?.[idx] ?? 0),
          Vacant: Number(vacant?.data?.[idx] ?? 0),
        }));
      }
    }

    // Legacy: data.parking_summary or parking_summary
    const legacy = root?.parking_summary ?? payload?.parking_summary ?? [];
    if (Array.isArray(legacy)) {
      return legacy.map((r: any) => ({
        site: r.site_name || r.site || '-',
        Free: Number(r.free_parking ?? 0),
        Paid: Number(r.paid_parking ?? 0),
        Vacant: Number(r.vacant_parking ?? 0),
      }));
    }

    return [];
  },
};

export default parkingManagementAnalyticsAPI;
