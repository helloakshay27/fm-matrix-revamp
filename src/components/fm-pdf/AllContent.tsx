
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    LabelList,
    Line,
    Scatter
} from "recharts";
import { ArrowRightLeft } from "lucide-react";

import logo from "../../assets/pdf/urbon.svg";

// @ts-ignore
import { getPeriodLabels } from '../../lib/periodLabel';
import GoPhygital from "../../assets/pdf/Gophygital.svg";
import axios from 'axios';


const AllContent = () => {
    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const startDate = params.get('start_date') || '2025-01-15';
    const endDate = params.get('end_date') || '2025-02-15';
    const auto = params.get('auto') === '1';

    const dateQuery = `?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
    const dateRangeLabel = useMemo(() => {
        if (!startDate || !endDate) return '';
        try {
            const s = new Date(startDate);
            const e = new Date(endDate);
            const fmt = (d: Date) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
            // If within same month, show e.g., "Jan 2025"
            if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
                return fmt(e);
            }
            return `${fmt(s)} to ${fmt(e)}`;
        } catch {
            return `${startDate} to ${endDate}`;
        }
    }, [startDate, endDate]);

    // Compute dynamic period labels (Weekly/Monthly/Quarterly/Yearly) from selected dates
    const { periodLabel, periodUnit, lastLabel, currentLabel } = useMemo(
        () => getPeriodLabels(startDate, endDate),
        [startDate, endDate]
    );


    const [meetingRoomData, setMeetingRoomData] = useState<any>(null);
    const [utilizationData, setUtilizationData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [siteAdoptionData, setSiteAdoptionData] = useState<any>(null);
    const [loadingSiteAdoption, setLoadingSiteAdoption] = useState<boolean>(true);
    const [helpdeskSnapshotData, setHelpdeskSnapshotData] = useState<any>(null);
    const [loadingHelpdeskSnapshot, setLoadingHelpdeskSnapshot] = useState<boolean>(true);
    // Separate effect to fetch helpdesk management snapshot
    useEffect(() => {
        const fetchHelpdeskSnapshot = async () => {
            setLoadingHelpdeskSnapshot(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/helpdesk_management_snapshot${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setHelpdeskSnapshotData(resp.data);
                console.log('helpdesk_snapshot ->', resp.data);
            } catch (err) {
                console.error('Error fetching helpdesk_snapshot:', err);
            } finally {
                setLoadingHelpdeskSnapshot(false);
            }
        };

        fetchHelpdeskSnapshot();
    }, [dateQuery]);


    useEffect(() => {
        const fetchMeetingRoomReport = async () => {
            setLoading(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/meeting_room_day_pass_performance${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(url, { headers });
                setMeetingRoomData(response.data);
                console.log('meeting_room_day_pass_performance ->', response.data);
            } catch (err) {
                console.error('Error fetching meeting_room_day_pass_performance:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetingRoomReport();
    }, [dateQuery]);

    const [loadingUtilization, setLoadingUtilization] = useState<boolean>(true);
    useEffect(() => {
        const fetchUtilization = async () => {
            setLoadingUtilization(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const utilEndpoint = `/api/pms/reports/center_wise_meeting_room_utilization${dateQuery}`;
                const utilUrl = `https://${baseUrl}${utilEndpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const utilResp = await axios.get(utilUrl, { headers });
                setUtilizationData(utilResp.data);
                console.log('center_wise_meeting_room_utilization ->', utilResp.data);
            } catch (utilErr) {
                console.error('Error fetching center_wise_meeting_room_utilization:', utilErr);
            } finally {
                setLoadingUtilization(false);
            }
        };

        fetchUtilization();
    }, [dateQuery]);

    // Separate effect to fetch site-wise adoption rate
    useEffect(() => {
        const fetchSiteAdoption = async () => {
            setLoadingSiteAdoption(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/site_wise_adoption_rate${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setSiteAdoptionData(resp.data);
                console.log('site_wise_adoption_rate ->', resp.data);
            } catch (err) {
                console.error('Error fetching site_wise_adoption_rate:', err);
            } finally {
                setLoadingSiteAdoption(false);
            }
        };

        fetchSiteAdoption();
    }, [dateQuery]);

    // Asset Overview - fetch and log separately
    const [assetOverviewData, setAssetOverviewData] = useState<any>(null);
    const [loadingAssetOverview, setLoadingAssetOverview] = useState<boolean>(true);
    useEffect(() => {
        const fetchAssetOverview = async () => {
            setLoadingAssetOverview(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/asset_overview${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setAssetOverviewData(resp.data);
                console.log('asset_overview ->', resp.data);
            } catch (err) {
                console.error('Error fetching asset_overview:', err);
            } finally {
                setLoadingAssetOverview(false);
            }
        };

        fetchAssetOverview();
    }, [dateQuery]);

    console.log("Meeting Room Data:", meetingRoomData?.data?.revenue_generation_overview?.total_revenue ?? null);
    console.log('Asset Overview Data:', assetOverviewData ?? null);


    const [ticketAgingClosureData, setTicketAgingClosureData] = useState<any>(null);
    const [loadingTicketAgingClosure, setLoadingTicketAgingClosure] = useState<boolean>(true);
    // Separate effect to fetch ticket aging closure efficiency
    useEffect(() => {
        const fetchTicketAgingClosure = async () => {
            setLoadingTicketAgingClosure(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/ticket_aging_closure_efficiency${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setTicketAgingClosureData(resp.data);
                console.log('ticket_aging_closure_efficiency ->', resp.data);
            } catch (err) {
                console.error('Error fetching ticket_aging_closure_efficiency:', err);
            } finally {
                setLoadingTicketAgingClosure(false);
            }
        };
        fetchTicketAgingClosure();
    }, [dateQuery]);

    const [ticketPerformanceMetricsData, setTicketPerformanceMetricsData] = useState<any>(null);
    const [loadingTicketPerformanceMetrics, setLoadingTicketPerformanceMetrics] = useState<boolean>(true);
    // Separate effect to fetch ticket performance metrics
    useEffect(() => {
        const fetchTicketPerformanceMetrics = async () => {
            setLoadingTicketPerformanceMetrics(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/ticket_performance_metrics${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setTicketPerformanceMetricsData(resp.data);
                console.log('ticket_performance_metrics ->', resp.data);
            } catch (err) {
                console.error('Error fetching ticket_performance_metrics:', err);
            } finally {
                setLoadingTicketPerformanceMetrics(false);
            }
        };
        fetchTicketPerformanceMetrics();
    }, [dateQuery]);

    const [customerExperienceFeedbackData, setCustomerExperienceFeedbackData] = useState<any>(null);
    const [loadingCustomerExperienceFeedback, setLoadingCustomerExperienceFeedback] = useState<boolean>(true);
    // Separate effect to fetch customer experience feedback
    useEffect(() => {
        const fetchCustomerExperienceFeedback = async () => {
            setLoadingCustomerExperienceFeedback(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/customer_experience_feedback${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setCustomerExperienceFeedbackData(resp.data);
                console.log('customer_experience_feedback ->', resp.data);
            } catch (err) {
                console.error('Error fetching customer_experience_feedback:', err);
            } finally {
                setLoadingCustomerExperienceFeedback(false);
            }
        };
        fetchCustomerExperienceFeedback();
    }, [dateQuery]);

    // Response TAT Quarterly - fetch and log separately
    const [responseTATQuarterlyData, setResponseTATQuarterlyData] = useState<any>(null);
    const [loadingResponseTATQuarterly, setLoadingResponseTATQuarterly] = useState<boolean>(true);
    useEffect(() => {
        const fetchResponseTATQuarterly = async () => {
            setLoadingResponseTATQuarterly(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = '/api/pms/reports/response_tat_performance_quarterly';
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setResponseTATQuarterlyData(resp.data);
                console.log('response_tat_performance_quarterly ->', resp.data);
            } catch (err) {
                console.error('Error fetching response_tat_performance_quarterly:', err);
            } finally {
                setLoadingResponseTATQuarterly(false);
            }
        };
        fetchResponseTATQuarterly();
    }, []);

    // Resolution TAT Quarterly - fetch and log separately
    const [resolutionTATQuarterlyData, setResolutionTATQuarterlyData] = useState<any>(null);
    const [loadingResolutionTATQuarterly, setLoadingResolutionTATQuarterly] = useState<boolean>(true);
    useEffect(() => {
        const fetchResolutionTATQuarterly = async () => {
            setLoadingResolutionTATQuarterly(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = '/api/pms/reports/resolution_tat_performance_quarterly';
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setResolutionTATQuarterlyData(resp.data);
                console.log('resolution_tat_performance_quarterly ->', resp.data);
            } catch (err) {
                console.error('Error fetching resolution_tat_performance_quarterly:', err);
            } finally {
                setLoadingResolutionTATQuarterly(false);
            }
        };

        fetchResolutionTATQuarterly();
    }, []);


    // Device Platform Statistics - fetch and log separately
    const [devicePlatformStatsData, setDevicePlatformStatsData] = useState<any>(null);
    const [loadingDevicePlatformStats, setLoadingDevicePlatformStats] = useState<boolean>(true);
    useEffect(() => {
        const fetchDevicePlatformStats = async () => {
            setLoadingDevicePlatformStats(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = '/api/pms/reports/device_platform_statistics';
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setDevicePlatformStatsData(resp.data);
                console.log('device_platform_statistics ->', resp.data);
            } catch (err) {
                console.error('Error fetching device_platform_statistics:', err);
            } finally {
                setLoadingDevicePlatformStats(false);
            }
        };

        fetchDevicePlatformStats();
    }, []);

    // Parking Date Site-wise - fetch separately and log
    const [parkingDateSiteWiseData, setParkingDateSiteWiseData] = useState<any>(null);
    const [loadingParkingDateSiteWise, setLoadingParkingDateSiteWise] = useState<boolean>(true);
    useEffect(() => {
        const fetchParkingDateSiteWise = async () => {
            setLoadingParkingDateSiteWise(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/parking_date_site_wise${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setParkingDateSiteWiseData(resp.data);
                console.log('parking_date_site_wise ->', resp.data);
            } catch (err) {
                console.error('Error fetching parking_date_site_wise:', err);
            } finally {
                setLoadingParkingDateSiteWise(false);
            }
        };

        fetchParkingDateSiteWise();
    }, [dateQuery]);

    // Visitor Trend Analysis - fetch separately and log
    const [visitorTrendAnalysisData, setVisitorTrendAnalysisData] = useState<any>(null);
    const [loadingVisitorTrendAnalysis, setLoadingVisitorTrendAnalysis] = useState<boolean>(true);
    useEffect(() => {
        const fetchVisitorTrendAnalysis = async () => {
            setLoadingVisitorTrendAnalysis(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/visitor_trend_analysis${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setVisitorTrendAnalysisData(resp.data);
                console.log('visitor_trend_analysis ->', resp.data);
            } catch (err) {
                console.error('Error fetching visitor_trend_analysis:', err);
            } finally {
                setLoadingVisitorTrendAnalysis(false);
            }
        };

        fetchVisitorTrendAnalysis();
    }, [dateQuery]);

    // Consumable Inventory Comparison - fetch separately and log
    const [consumableInventoryComparisonData, setConsumableInventoryComparisonData] = useState<any>(null);
    const [loadingConsumableInventoryComparison, setLoadingConsumableInventoryComparison] = useState<boolean>(true);
    useEffect(() => {
        const fetchConsumableInventoryComparison = async () => {
            setLoadingConsumableInventoryComparison(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/consumable_inventory_comparison${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setConsumableInventoryComparisonData(resp.data);
                console.log('consumable_inventory_comparison ->', resp.data);
            } catch (err) {
                console.error('Error fetching consumable_inventory_comparison:', err);
            } finally {
                setLoadingConsumableInventoryComparison(false);
            }
        };

        fetchConsumableInventoryComparison();
    }, [dateQuery]);

    // Center-wise Consumables - fetch separately and log
    const [centerWiseConsumablesData, setCenterWiseConsumablesData] = useState<any>(null);
    const [loadingCenterWiseConsumables, setLoadingCenterWiseConsumables] = useState<boolean>(true);
    useEffect(() => {
        const fetchCenterWiseConsumables = async () => {
            setLoadingCenterWiseConsumables(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/center_wise_consumables${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setCenterWiseConsumablesData(resp.data);
                console.log('center_wise_consumables ->', resp.data);
            } catch (err) {
                console.error('Error fetching center_wise_consumables:', err);
            } finally {
                setLoadingCenterWiseConsumables(false);
            }
        };

        fetchCenterWiseConsumables();
    }, [dateQuery]);

    // Parking Management – derive chart rows from API
    const parkingSummary = useMemo(() => {
        const root = parkingDateSiteWiseData?.data?.parking_summary
            ?? parkingDateSiteWiseData?.parking_summary
            ?? [];
        return Array.isArray(root) ? root : [];
    }, [parkingDateSiteWiseData]);

    const parkingChartData = useMemo(() => {
        const pm = parkingDateSiteWiseData?.data?.parking_management
            ?? parkingDateSiteWiseData?.parking_management
            ?? null;
        if (pm) {
            const details = Array.isArray(pm.site_wise_details) ? pm.site_wise_details : null;
            if (details) {
                return details.map((d: any) => ({
                    site: d.site_name || d.site || '-',
                    Free: Number(d.free_parking_available ?? 0),
                    Paid: Number(d.paid_parking_available ?? 0),
                    Vacant: Number(d.vacant_spaces ?? 0),
                }));
            }
            const categories: any[] = pm?.chart_data?.x_axis?.categories ?? [];
            const series: any[] = pm?.chart_data?.series ?? [];
            if (Array.isArray(categories) && Array.isArray(series) && categories.length) {
                // Attempt to align series by index if names aren't explicit
                return categories.map((cat: any, idx: number) => ({
                    site: String(cat || '-'),
                    Free: Number(series[0]?.data?.[idx] ?? 0),
                    Paid: Number(series[1]?.data?.[idx] ?? 0),
                    Vacant: Number(series[2]?.data?.[idx] ?? 0),
                }));
            }
        }
        // Legacy fallback from parkingSummary
        return parkingSummary.map((r: any) => ({
            site: r.site_name || r.site || '-',
            Free: Number(r.free_parking ?? 0),
            Paid: Number(r.paid_parking ?? 0),
            Vacant: Number(r.vacant_parking ?? 0),
        }));
    }, [parkingDateSiteWiseData, parkingSummary]);

    // Visitor Management – derive chart rows
    const visitorTrendRows = useMemo(() => {
        const vm = visitorTrendAnalysisData?.data?.visitor_management
            ?? visitorTrendAnalysisData?.visitor_management
            ?? null;
        if (vm) {
            const swa: any[] = Array.isArray(vm.site_wise_analysis) ? vm.site_wise_analysis : [];
            if (swa.length) {
                return swa.map((siteRow: any) => {
                    const site = siteRow.site_name || siteRow.site || '-';
                    const cur = Number(
                        siteRow?.current_period?.total_visitors
                        ?? siteRow?.current_period?.total
                        ?? 0
                    );
                    const prev = Number(
                        siteRow?.previous_period?.total_visitors
                        ?? siteRow?.previous_period?.total
                        ?? 0
                    );
                    return { site, last: prev, current: cur };
                });
            }
            const categories: any[] = vm?.chart_data?.x_axis?.categories ?? [];
            const charts: any[] = Array.isArray(vm?.chart_data?.charts) ? vm.chart_data.charts : [];
            if (Array.isArray(categories) && categories.length && charts.length) {
                const lastChart = charts.find((c: any) => /last/i.test(c?.name || ''));
                const currentChart = charts.find((c: any) => /current/i.test(c?.name || ''));
                const lastSeries: number[] = Array.isArray(lastChart?.data) ? lastChart.data : [];
                const currentSeries: number[] = Array.isArray(currentChart?.data) ? currentChart.data : [];
                return categories.map((cat: any, idx: number) => ({
                    site: String(cat || '-'),
                    last: Number(lastSeries[idx] ?? 0),
                    current: Number(currentSeries[idx] ?? 0),
                }));
            }
        }
        const root = visitorTrendAnalysisData?.data?.visitor_trend_analysis
            ?? visitorTrendAnalysisData?.visitor_trend_analysis
            ?? visitorTrendAnalysisData
            ?? [];
        const arr = Array.isArray(root) ? root : [];
        return arr.map((r: any) => ({
            site: r.site_name || r.site || '-',
            last: Number(r.last_quarter ?? r?.last_quarter_total ?? 0),
            current: Number(r.current_quarter ?? r?.current_quarter_total ?? 0),
        }));
    }, [visitorTrendAnalysisData]);

    const visitorChartHeight = useMemo(() => {
        const rows = visitorTrendRows.length || 1;
        // 40px per row + padding; clamp to sensible range for print
        return Math.min(800, Math.max(240, rows * 40 + 80));
    }, [visitorTrendRows]);

    // Inventory Overstock Report - fetch separately and log
    const [inventoryOverstockReportData, setInventoryOverstockReportData] = useState<any>(null);
    const [loadingInventoryOverstockReport, setLoadingInventoryOverstockReport] = useState<boolean>(true);
    useEffect(() => {
        const fetchInventoryOverstockReport = async () => {
            setLoadingInventoryOverstockReport(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/inventory_overstock_report${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setInventoryOverstockReportData(resp.data);
                console.log('inventory_overstock_report ->', resp.data);
            } catch (err) {
                console.error('Error fetching inventory_overstock_report:', err);
            } finally {
                setLoadingInventoryOverstockReport(false);
            }
        };
        fetchInventoryOverstockReport();
    }, [dateQuery]);

    // Site-wise Checklist - fetch separately and log
    const [siteWiseChecklistData, setSiteWiseChecklistData] = useState<any>(null);
    const [loadingSiteWiseChecklist, setLoadingSiteWiseChecklist] = useState<boolean>(true);
    useEffect(() => {
        const fetchSiteWiseChecklist = async () => {
            setLoadingSiteWiseChecklist(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/site_wise_checklist${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setSiteWiseChecklistData(resp.data);
                console.log('site_wise_checklist ->', resp.data);
            } catch (err) {
                console.error('Error fetching site_wise_checklist:', err);
            } finally {
                setLoadingSiteWiseChecklist(false);
            }
        };
        fetchSiteWiseChecklist();
    }, [dateQuery]);

    // AMC Contract Summary - fetch separately and log
    const [amcContractSummaryData, setAmcContractSummaryData] = useState<any>(null);
    const [loadingAmcContractSummary, setLoadingAmcContractSummary] = useState<boolean>(true);
    useEffect(() => {
        const fetchAmcContractSummary = async () => {
            setLoadingAmcContractSummary(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/amc_contract_summary${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setAmcContractSummaryData(resp.data);
                console.log('amc_contract_summary ->', resp.data);
            } catch (err) {
                console.error('Error fetching amc_contract_summary:', err);
            } finally {
                setLoadingAmcContractSummary(false);
            }
        };

        fetchAmcContractSummary();
    }, [dateQuery]);

    // Highest Maintenance Assets - fetch separately and log
    const [highestMaintenanceAssetsData, setHighestMaintenanceAssetsData] = useState<any>(null);
    const [loadingHighestMaintenanceAssets, setLoadingHighestMaintenanceAssets] = useState<boolean>(true);
    useEffect(() => {
        const fetchHighestMaintenanceAssets = async () => {
            setLoadingHighestMaintenanceAssets(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const endpoint = `/api/pms/reports/highest_maintenance_assets${dateQuery}`;
                const url = `https://${baseUrl}${endpoint}`;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await axios.get(url, { headers });
                setHighestMaintenanceAssetsData(resp.data);
                console.log('highest_maintenance_assets ->', resp.data);
            } catch (err) {
                console.error('Error fetching highest_maintenance_assets:', err);
            } finally {
                setLoadingHighestMaintenanceAssets(false);
            }
        };

        fetchHighestMaintenanceAssets();
    }, [dateQuery]);

    // Asset Overview derived selections (support both {data: {...}} and flat JSON)
    const assetOverview = useMemo(() => assetOverviewData?.data ?? assetOverviewData ?? null, [assetOverviewData]);
    const companyAssetOverview = assetOverview?.company_asset_overview;
    const centerMetrics = useMemo(
        () => (Array.isArray(assetOverview?.center_metrics) ? assetOverview.center_metrics : []),
        [assetOverview]
    );

    // Highest Maintenance Assets: derive normalized structures for easy rendering
    const highestReport = useMemo(() => {
        // Support both { data: {...} } and flat JSON
        return highestMaintenanceAssetsData?.data ?? highestMaintenanceAssetsData ?? null;
    }, [highestMaintenanceAssetsData]);

    const highestAssets = useMemo(() => {
        const arr = highestReport?.assets_with_highest_maintenance_spend;
        return Array.isArray(arr) ? arr : [];
    }, [highestReport]);

    const highestTotals = useMemo(() => {
        const total_cost = Number(highestReport?.total_maintenance_cost ?? 0);
        const total_percent = Number(highestReport?.total_maintenance_percent ?? 0);
        return { total_cost, total_percent };
    }, [highestReport]);

    // Checklist Progress – normalize site_wise_checklist shape
    const checklistProgress = useMemo(() => {
        const root = siteWiseChecklistData?.data ?? siteWiseChecklistData ?? null;

        // New shape: data.site_wise_breakdown with current_quarter and last_quarter status buckets
        const swb: any[] = (root?.site_wise_breakdown ?? root?.data?.site_wise_breakdown) as any[];
        if (Array.isArray(swb) && swb.length) {
            return swb.map((row: any) => {
                const site = row?.site_name ?? row?.center_name ?? row?.site ?? '-';
                const current = row?.current_quarter ?? {};
                const last = row?.last_quarter ?? {};

                const curOpen = Number(current?.not_completed ?? current?.open ?? 0);
                const curInProg = Number(current?.in_progress ?? 0);
                const curOverdue = Number(current?.delayed ?? current?.overdue ?? 0);
                const curPartial = Number(current?.partial ?? current?.partially_closed ?? 0);
                const curClosed = Number(current?.completed ?? current?.closed ?? 0);

                const lastOpen = Number(last?.not_completed ?? last?.open ?? 0);
                const lastInProg = Number(last?.in_progress ?? 0);
                const lastOverdue = Number(last?.delayed ?? last?.overdue ?? 0);
                const lastPartial = Number(last?.partial ?? last?.partially_closed ?? 0);
                const lastClosed = Number(last?.completed ?? last?.closed ?? 0);

                return {
                    site_name: site,
                    current: {
                        open: curOpen,
                        in_progress: curInProg,
                        overdue: curOverdue,
                        partially_closed: curPartial,
                        closed: curClosed,
                    },
                    difference: {
                        open: curOpen - lastOpen,
                        in_progress: curInProg - lastInProg,
                        overdue: curOverdue - lastOverdue,
                        partially_closed: curPartial - lastPartial,
                        closed: curClosed - lastClosed,
                    },
                };
            });
        }

        // Legacy shapes
        const list = root?.checklist_progress ?? root?.progress ?? [];
        return Array.isArray(list) ? list : [];
    }, [siteWiseChecklistData]);

    // Inventory Overstock Report – Overview Summary derivation
    const overstockSummary = useMemo(() => {
        const src = inventoryOverstockReportData?.data?.overview_summary
            ?? inventoryOverstockReportData?.summary
            ?? null;
        return src && typeof src === 'object' ? src : null;
    }, [inventoryOverstockReportData]);

    const formatINR = (n: any) => {
        if (n === null || n === undefined) return '₹ 0';
        if (typeof n === 'string') {
            const s = n.trim();
            // If already formatted with a rupee symbol, normalize spacing and return
            if (s.startsWith('₹')) {
                return `₹ ${s.replace(/^₹\s*/, '').trim()}`;
            }
            const parsed = parseFloat(s.replace(/[^0-9.\-]/g, ''));
            if (!Number.isNaN(parsed)) return `₹ ${parsed.toLocaleString('en-IN')}`;
            return '₹ 0';
        }
        const num = Number(n);
        return Number.isNaN(num) ? '₹ 0' : `₹ ${num.toLocaleString('en-IN')}`;
    };

    // Format numeric values to "k" (e.g., 932813.75 -> 93.2k), trimming trailing .0
    const formatToK = (n: any) => {
        const val = Number(n || 0);
        // Divide by 10,000 to match the provided example mapping
        const scaled = val / 10000;
        if (!Number.isFinite(scaled)) return '0k';
        // Keep one decimal only when needed
        const s = scaled.toFixed(1).replace(/\.0$/, '');
        return `${s}k`;
    };

    // Helpers for Overstock Top 10 mapping (new API shape)
    const normalizeSiteKey = (name: string) => {
        if (!name) return '';
        return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    };

    const parseCapitalBook = (val: any): number => {
        if (val === null || val === undefined) return 0;
        const s = String(val).trim().toLowerCase();
        const num = parseFloat(s.replace(/[^0-9.\-]/g, ''));
        if (Number.isNaN(num)) return 0;
        if (s.includes('l')) return num * 100000; // Lakh
        if (s.includes('k')) return num * 1000;   // Thousand
        return num; // already in units (assume INR)
    };

    const parsePercentSimple = (val: any): number => {
        if (val === null || val === undefined) return 0;
        const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
        return Number.isFinite(n) ? n : 0;
    };

    const inventoryOverviewCards = useMemo(() => {
        const s: any = overstockSummary ?? {};
        return [
            { label: 'Over Stock Items', value: String(s.over_stock_items ?? 0) },
            { label: 'Under Stock Items', value: String(s.under_stock_items ?? 0) },
            { label: 'Total Value Of Inventory', value: formatINR(s.total_value_of_inventory) },
            { label: 'Capital Blocked In Overstocking', value: formatINR(s.capital_blocked_in_overstock) },
            { label: 'Total Value Of Spares', value: formatINR(s.total_value_of_spares) },
            { label: 'Total Value Of Consumables', value: formatINR(s.total_value_of_consumables) },
        ];
    }, [overstockSummary]);

    // Inventory Overstock – Top 10 Items grid derived from API (supports new and legacy shapes)
    const overstockTopItems = useMemo(() => {
        const root = inventoryOverstockReportData?.data?.overstock_top_items_by_site
            ?? inventoryOverstockReportData?.overstock_top_items_by_site
            ?? [];
        return Array.isArray(root) ? root : [];
    }, [inventoryOverstockReportData]);

    // Consumable Inventory Comparison – derive chart rows from API
    const consumableComparisonRows = useMemo(() => {
        const root = consumableInventoryComparisonData?.data?.consumable_inventory_comparison
            ?? consumableInventoryComparisonData?.consumable_inventory_comparison
            ?? consumableInventoryComparisonData
            ?? [];
        const arr = Array.isArray(root) ? root : [];
        return arr.map((r: any) => ({
            site: r.site_name || r.site || '-',
            lastQuarter: Number(r.last_quarter ?? 0),
            currentQuarter: Number(r.current_quarter ?? 0),
        }));
    }, [consumableInventoryComparisonData]);

    // Compute dynamic domain and ticks for the consumable comparison chart (based on raw values)
    const consumableMaxRaw = useMemo(() => {
        if (!Array.isArray(consumableComparisonRows) || consumableComparisonRows.length === 0) return 0;
        const vals = consumableComparisonRows.flatMap(r => [r.lastQuarter, r.currentQuarter]);
        const max = Math.max(0, ...vals);
        // Round up to nearest 100k for headroom
        const rounded = Math.ceil(max / 100000) * 100000;
        return Math.max(rounded, max || 0);
    }, [consumableComparisonRows]);

    const consumableTicks = useMemo(() => {
        const max = consumableMaxRaw || 0;
        if (max === 0) return [0];
        const steps = 5;
        const step = max / steps;
        return Array.from({ length: steps + 1 }, (_, i) => Math.round(step * i));
    }, [consumableMaxRaw]);

    const overstockTopGrid = useMemo(() => {
        // New shape: inventory_overstock_report { sites: string[], matrix_data: [...] }
        const inv = inventoryOverstockReportData?.data?.inventory_overstock_report
            ?? inventoryOverstockReportData?.inventory_overstock_report
            ?? null;
        if (inv) {
            const matrix = Array.isArray(inv.matrix_data) ? inv.matrix_data : [];
            // Prefer sites from API; if absent/empty, derive from matrix row keys
            let sites: string[] = Array.isArray(inv.sites) ? inv.sites.slice() : [];
            let siteKeys: string[] = [];

            if (sites.length > 0) {
                siteKeys = sites.map(normalizeSiteKey);
            } else if (matrix.length > 0) {
                const first = matrix[0] || {};
                // Derive keys where value is an object with capital_book/current_stock
                siteKeys = Object.keys(first).filter((k) => {
                    if (k === 'item_name') return false;
                    const v = (first as any)[k];
                    return v && typeof v === 'object' && ('capital_book' in v || 'current_stock' in v);
                });
                // Create human-readable site names from derived keys
                sites = siteKeys.map((k) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
            }

            if (sites.length > 0 && matrix.length > 0) {
                const items = matrix.map((row: any) => {
                    const capital = siteKeys.map((k) => {
                        const raw = row?.[k]?.capital_book ?? row?.[k]?.blocked_value ?? row?.[k]?.capital ?? 0;
                        const num = parseFloat(String(raw).replace(/[^0-9.\-]/g, ''));
                        return isNaN(num) ? 0 : num;
                    });
                    const capitalText = siteKeys.map((k) => {
                        const raw = row?.[k]?.capital_book ?? row?.[k]?.blocked_value ?? row?.[k]?.capital ?? '';
                        return String(raw).trim(); // show as provided (e.g., '4', '12k', '1L')
                    });
                    const stock = siteKeys.map((k) => {
                        const raw = row?.[k]?.current_stock ?? 0;
                        const num = parseFloat(String(raw).replace(/[^0-9.\-]/g, ''));
                        return isNaN(num) ? 0 : num;
                    });
                    return { name: row?.item_name ?? '-', capital, capitalText, stock };
                });
                try {
                    console.log('overstockTopGrid (new) -> sites:', sites.length, 'items:', items.length);
                } catch { }
                return { sites, items };
            }
        }

        // Legacy shape fallback: overstock_top_items_by_site
        const sites: string[] = overstockTopItems.map((s: any) => s?.site_name).filter(Boolean);
        if (!sites.length) return { sites: [] as string[], items: [] as any[] };
        const totals = new Map<string, number>();
        overstockTopItems.forEach((site: any) => {
            const items = Array.isArray(site?.items) ? site.items : [];
            items.forEach((it: any) => {
                const name = it?.item_name || '';
                if (!name) return;
                const bv = Number(it?.blocked_value ?? 0);
                totals.set(name, (totals.get(name) ?? 0) + bv);
            });
        });
        const itemNames = Array.from(totals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name]) => name);
        const items = itemNames.map((name) => {
            const capitalsRaw = sites.map((siteName) => {
                const site = overstockTopItems.find((s: any) => s?.site_name === siteName);
                const it = (site?.items || []).find((x: any) => x?.item_name === name);
                return it?.capital_book ?? 0;
            });
            const stocksRaw = sites.map((siteName) => {
                const site = overstockTopItems.find((s: any) => s?.site_name === siteName);
                const it = (site?.items || []).find((x: any) => x?.item_name === name);
                return it?.current_stock ?? 0;
            });
            const capital = capitalsRaw.map((v) => {
                const num = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
                return isNaN(num) ? 0 : num;
            });
            const capitalText = capitalsRaw.map((v) => String(v).trim());
            const stock = stocksRaw.map((v) => {
                const num = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
                return isNaN(num) ? 0 : num;
            });
            return { name, capital, capitalText, stock };
        });
        try {
            console.log('overstockTopGrid (legacy) -> sites:', sites.length, 'items:', items.length);
        } catch { }
        return { sites, items };
    }, [inventoryOverstockReportData, overstockTopItems]);

    // Top 10 Overdue Checklists – normalize shape from site_wise_checklist
    const top10Overdue = useMemo(() => {
        const root = siteWiseChecklistData?.data?.top_10_overdue_checklists
            ?? siteWiseChecklistData?.top_10_overdue_checklists
            ?? null;
        if (!root || typeof root !== 'object') return { categories: [] as string[], siteRows: [] as any[] };
        const categories: string[] = Array.isArray((root as any).categories) ? (root as any).categories : [];
        const siteRows: any[] = Array.isArray((root as any).site_wise) ? (root as any).site_wise : [];
        return { categories, siteRows };
    }, [siteWiseChecklistData]);

    // AMC summary derived object
    const amcSummary = useMemo(() => {
        // Support multiple shapes:
        // 1) { data: { summary: { active_amc_contracts, contract_expiry_in_90_days, contract_expired } } }
        // 2) { card_overview: { active_contracts: {count}, expiring_soon: {count}, expired_contracts: {count} } }
        // 3) Flat keys as in (1) at root
        const root = amcContractSummaryData ?? null;
        if (!root || typeof root !== 'object') return null;

        // Try legacy/summary first
        const legacy = (root as any)?.data?.summary ?? (root as any)?.summary ?? null;
        if (legacy && typeof legacy === 'object') {
            return {
                active: Number((legacy as any).active_amc_contracts ?? 0),
                expiry90: Number((legacy as any).contract_expiry_in_90_days ?? 0),
                expired: Number((legacy as any).contract_expired ?? 0),
            };
        }

        // Try new card_overview shape
        const cards = (root as any)?.card_overview ?? (root as any)?.data?.card_overview ?? null;
        if (cards && typeof cards === 'object') {
            const active = Number((cards as any)?.active_contracts?.count ?? 0);
            const expiry90 = Number((cards as any)?.expiring_soon?.count ?? 0);
            const expired = Number((cards as any)?.expired_contracts?.count ?? 0);
            // If totals are present and individual counts are zero, still accept zeros.
            return { active, expiry90, expired };
        }

        // Fallback: flat keys on root
        return {
            active: Number((root as any).active_amc_contracts ?? 0),
            expiry90: Number((root as any).contract_expiry_in_90_days ?? 0),
            expired: Number((root as any).contract_expired ?? 0),
        };
    }, [amcContractSummaryData]);

    // AMC expiring contracts (90 days) list – supports new and legacy shapes
    const amcExpiringContracts = useMemo(() => {
        const root: any = amcContractSummaryData?.data ?? amcContractSummaryData ?? {};
        let arr: any =
            root?.expiring_contracts
            ?? root?.contract_details // new shape
            ?? root?.expiring_in_90_days
            ?? [];
        arr = Array.isArray(arr) ? arr : [];

        // Only include rows explicitly marked as Expiring Soon
        const filtered = (arr as any[]).filter((row: any) => {
            const s = String(row?.status ?? row?.contract_status ?? '')
                .toLowerCase()
                .replace(/_/g, ' ')
                .trim();
            return s === 'expiring soon';
        });

        // Normalize to the fields our table expects
        return filtered.map((row: any) => ({
            site_name: row?.site_name || row?.center_name || row?.site || '-',
            amc_name: row?.amc_name || row?.contract_name || row?.asset_name || row?.service_name || '-',
            contract_start_date: row?.contract_start_date || row?.start_date || '',
            contract_end_date: row?.contract_end_date || row?.end_date || '',
            renewal_reminder: row?.renewal_reminder || row?.renewal_alert || row?.renewal_status || '',
            projected_renewal_cost: Number(row?.projected_renewal_cost ?? row?.contract_value ?? row?.projected_value ?? 0),
            vendor_contact: row?.vendor_contact || row?.vendor_name || row?.vendor_email || row?.vendor_details || '',
            status: row?.status || row?.contract_status || '',
        }));
    }, [amcContractSummaryData]);

    // AMC expired contracts list – supports new and legacy shapes
    const amcExpiredContracts = useMemo(() => {
        const root: any = amcContractSummaryData?.data ?? amcContractSummaryData ?? {};
        let arr: any =
            root?.expired_contracts
            ?? root?.expired_contract_details
            ?? (root?.expired && root?.expired?.contract_details)
            ?? root?.contract_details // new shape: direct contract_details array for expired
            ?? [];
        arr = Array.isArray(arr) ? arr : [];

        // Only include rows explicitly marked as Expired
        const filtered = (arr as any[]).filter((row: any) => {
            const s = String(row?.status ?? row?.contract_status ?? '')
                .toLowerCase()
                .replace(/_/g, ' ')
                .trim();
            return s === 'expired';
        });

        return filtered.map((row: any) => ({
            site_name: row?.site_name || row?.center_name || row?.site || '-',
            amc_name: row?.amc_name || row?.contract_name || row?.asset_name || row?.service_name || '-',
            contract_start_date: row?.contract_start_date || row?.start_date || '',
            contract_end_date: row?.contract_end_date || row?.end_date || '',
            renewal_reminder: row?.renewal_reminder || row?.renewal_alert || row?.renewal_status || '',
            projected_renewal_cost: Number(row?.projected_renewal_cost ?? row?.contract_value ?? row?.projected_value ?? 0),
            vendor_contact: row?.vendor_contact || row?.vendor_name || row?.vendor_email || row?.vendor_details || '',
            status: row?.status || row?.contract_status || 'Expired',
        }));
    }, [amcContractSummaryData]);


    // Derived list of site names from customer experience feedback (safe, defensive)
    const customerExperienceSiteNames = useMemo(() => {
        const apiArr = customerExperienceFeedbackData?.data?.site_performance?.data
            ?? customerExperienceFeedbackData?.site_performance?.data
            ?? [];

        if (!Array.isArray(apiArr) || apiArr.length === 0) return [];

        const names = apiArr.map((site: any) => site.site_name ?? '');
        console.log('customerExperienceSiteNames ->', names);
        return names;
    }, [customerExperienceFeedbackData]);

    const transformCustomerRatingData = (sitePerformance) => {
        if (!sitePerformance?.data) return { rows: [], headers: [] };

        const labels = {
            excellent: "Excellent",
            good: "Good",
            average: "Average",
            bad: "Bad",
            poor: "Poor",
            total_percentage: "Total %"
        };

        // Table headers = all site names
        const headers = sitePerformance.data.map((site) => site.site_name);

        // Build rows (one per label)
        const rows = Object.keys(labels).map((key) => ({
            label: labels[key],
            values: sitePerformance.data.map(
                (site) => site[key] ?? "0%" // pick directly from site object
            ),
        }));

        return { headers, rows };
    };

    const customerRatingData = transformCustomerRatingData(
        customerExperienceFeedbackData?.data?.site_performance
    );


    const Arrow = ({ up }) => (
        <span style={{ color: up ? "green" : "red" }}>
            {up ? "▲" : "▼"}
        </span>
    );

    // Derive center list and utilization ranges from API when available
    const centerList = useMemo(() => {
        const apiCenters = utilizationData?.data?.center_utilization_data ?? utilizationData?.center_utilization_data ?? null;
        if (Array.isArray(apiCenters) && apiCenters.length > 0) return apiCenters;
        return [];
    }, [utilizationData]);

    const rangeList = useMemo(() => {
        const apiRanges = utilizationData?.data?.utilization_ranges ?? utilizationData?.utilization_ranges ?? null;
        if (apiRanges && typeof apiRanges === 'object') return Object.keys(apiRanges);
        return [];
    }, [utilizationData]);

    const parseRange = (label: string) => {
        if (!label || typeof label !== 'string') return { min: -Infinity, max: Infinity };
        const lessMatch = label.match(/Less\s*(\d+)%?/i);
        if (lessMatch) {
            const max = Number(lessMatch[1]);
            return { min: -Infinity, max };
        }
        const rangeMatch = label.match(/(\d+)[^\d]*(\d+)?/);
        if (rangeMatch) {
            const a = Number(rangeMatch[1]);
            const b = rangeMatch[2] ? Number(rangeMatch[2]) : a;
            return { min: a, max: b };
        }
        return { min: -Infinity, max: Infinity };
    };

    const getRoomsForRange = (center: any, rangeLabel: string) => {
        const rooms = center?.rooms ?? [];
        if (!Array.isArray(rooms) || rooms.length === 0) return '';
        const { min, max } = parseRange(rangeLabel);
        const matched = rooms.filter((r: any) => {
            const pct = Number(r.utilization_percentage ?? r.utilization_percentage_percentage ?? NaN);
            if (Number.isNaN(pct)) return false;
            return pct >= min && pct <= max;
        }).map((r: any) => r.room_name || '').filter(Boolean);
        return matched.join(', ');
    };



    const getCellColor = (range) => {
        if (range === "Less 30%" || range === "30%-39%") {
            return "bg-red-100"
        } else if (range === "40%-50%" || range === "50%-60%" || range === "60%-69%") {
            return "bg-yellow-100"
        } else {
            return "bg-green-100"
        }
    }



    //   const walletOverviewData = useMemo(
    //     () => [
    //       {
    //         label: "Total Wallet Balance",
    //         value: `₹${Number(overSumData.total_wallet_balance || 0).toLocaleString()}`,
    //         bg: "bg-[#f7f4ed]",
    //       },
    //       {
    //         label: "Total Wallet Top-ups",
    //         value: `₹${Number(overSumData.total_wallet_topups || 0).toLocaleString()}`,
    //         bg: "bg-[#f7f4ed]",
    //       },
    //       {
    //         label: "Total Wallet Usage (deductions)",
    //         value: `₹${Number(overSumData.total_wallet_usage || 0).toLocaleString()}`,
    //         bg: "bg-[#c2a791]",
    //       },
    //       {
    //         label: "Complimentary Credits Points",
    //         value: Number(overSumData.complimentary_credit_points || 0).toLocaleString(),
    //         bg: "bg-[#c2a791]",
    //       },
    //       {
    //         label: "Expired Wallet Points",
    //         value: Number(overSumData.expired_wallet_points || 0).toLocaleString(),
    //         bg: "bg-[#d7d0bf]",
    //       },
    //       {
    //         label: "Total Active Wallet Users (Last Vs Current Quarter)",
    //         value: (
    //           <>
    //             {Number(overSumData.total_active_wallet_users || 0).toLocaleString()}{" "}
    //             <span className="text-green-600 text-xs">↑18%</span>
    //           </>
    //         ),
    //         bg: "bg-[#d7d0bf]",
    //       },
    //     ],
    //     [overSumData]
    //   );




    const getColor = (value) => {
        if (value >= 70) return "border-b-2 border-green-600";
        if (value >= 40) return "border-b-2 border-yellow-500";
        return "border-b-2 border-red-500";
    };


    const displayCustomerExperienceData = useMemo(() => {
        const summary = customerExperienceFeedbackData?.data?.overall_summary;
        if (summary && typeof summary === 'object') {
            const order = ['excellent', 'good', 'average', 'bad', 'poor'];
            const colors: Record<string, string> = {
                excellent: '#F6F4EE',
                good: '#DAD6C9',
                average: '#C4B89D',
                bad: '#C4AE9D',
                poor: '#D5DBDB',
            };
            return order.map((k) => ({
                label: k.charAt(0).toUpperCase() + k.slice(1),
                value: summary[k]?.count ?? 0,
                percent: summary[k]?.percentage ?? '0%',
                bg: colors[k] || '#fff',
                text: summary[k]?.text || undefined,
            }));
        }

        // Fallback default when API data is not available
        return [
            { label: 'Excellent', value: 0, percent: '0%', bg: '#F6F4EE' },
            { label: 'Good', value: 0, percent: '0%', bg: '#DAD6C9' },
            { label: 'Average', value: 0, percent: '0%', bg: '#C4B89D' },
            { label: 'Bad', value: 0, percent: '0%', bg: '#C4AE9D' },
            { label: 'Poor', value: 0, percent: '0%', bg: '#D5DBDB' },
        ];
    }, [customerExperienceFeedbackData]);







    // Center-wise Consumables – compute top 10 items across centers and per-site values
    const centerWiseConsumables = useMemo(() => {
        const root = centerWiseConsumablesData?.data?.center_wise_consumables
            ?? centerWiseConsumablesData?.center_wise_consumables
            ?? [];
        return Array.isArray(root) ? root : [];
    }, [centerWiseConsumablesData]);

    const topConsumableHeaders = useMemo(() => {
        const totals = new Map<string, number>();
        centerWiseConsumables.forEach((row: any) => {
            const cons = row?.consumables && typeof row.consumables === 'object' ? row.consumables : {};
            Object.entries(cons).forEach(([name, val]) => {
                const n = Number(val) || 0;
                totals.set(name, (totals.get(name) ?? 0) + n);
            });
        });
        return Array.from(totals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name]) => name);
    }, [centerWiseConsumables]);

    const consumablesTableData = useMemo(() => {
        return centerWiseConsumables.map((row: any) => {
            const cons = row?.consumables && typeof row.consumables === 'object' ? row.consumables : {};
            const values = topConsumableHeaders.map((name) => Number((cons as any)[name] ?? 0));
            return {
                inventory: row?.site_name || row?.site || '-',
                values,
            };
        });
    }, [centerWiseConsumables, topConsumableHeaders]);


    const inventoryData = [
        { site: "Sai Radhe, Bund Garden", lastQuarter: 15000, currentQuarter: 14000 },
        { site: "Westport, Baner", lastQuarter: 10000, currentQuarter: 9000 },
        { site: "Peninsula Corporate Park, Lower Parel", lastQuarter: 13000, currentQuarter: 12000 },
        { site: "Koncord Towers, Bund Garden", lastQuarter: 7000, currentQuarter: 8000 },
        { site: "Nandan Probiz, Balewadi", lastQuarter: 11000, currentQuarter: 13000 },
        { site: "Aeromall, Viman nagar", lastQuarter: 7500, currentQuarter: 7000 },
        { site: "Raheja Mindspace, Hitec City", lastQuarter: 12000, currentQuarter: 10000 },
        { site: "Technopolis, Salt Lake", lastQuarter: 8500, currentQuarter: 7000 },
        { site: "Max House, Okhla", lastQuarter: 10500, currentQuarter: 9000 },
        { site: "Baani- The Statement, Gurgaon", lastQuarter: 10000, currentQuarter: 8500 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border text-sm px-3 py-1 rounded shadow">
                    <p className="font-semibold">{label}</p>
                    <p>{lastLabel}: {payload[0].value}</p>
                    <p>{currentLabel}: {payload[1].value}</p>
                </div>
            );
        }
        return null;
    };

    // Unified section container styling for equal padding and consistent left/right alignment
    // Applies to major section boxes across pages
    const sectionBox = "bg-white border border-gray-300 w-[95%] mx-auto p-5 mb-10 print:w-[95%] print:mx-auto print:p-2 print:mb-4 no-break";


    // removed unused CustomResolutionDots and sample Bardata


    const sitesk = useMemo(() => overstockTopGrid.sites, [overstockTopGrid]);

    const itemss = useMemo(() => overstockTopGrid.items, [overstockTopGrid]);

    const Block = ({ capital, capitalText, stock }) => {
        // Decide which raw value to use first (explicit text if provided, else numeric/string capital)
        const rawCapital = (capitalText !== undefined && capitalText !== null && capitalText !== '') ? capitalText : capital;

        const formatCapital = (val: any) => {
            if (val === null || val === undefined) return '-';
            let str = String(val).trim();
            if (!str) return '-';
            // If already has a suffix (k/K, lakh, L, cr, m) leave as-is
            if (/[kK]$/.test(str) || /(lakh|L|cr|CR|m|M)$/.test(str)) return str; // backend decided format
            // Pure number (int/float) -> show as-is (do NOT append a forced 'k')
            if (/^\d+(\.\d+)?$/.test(str)) return str; // just the number
            // Fallback: return original
            return str;
        };

        const formatStock = (val: any) => {
            if (val === null || val === undefined) return '-';
            let str = String(val).trim();
            if (!str) return '-';
            // Remove duplicate % signs then ensure exactly one at end
            str = str.replace(/%+$/g, '');
            if (!str) return '-';
            // If value already contained a %, we stripped it above—append one back.
            return `${str}%`;
        };

        const displayCapital = formatCapital(rawCapital);
        const displayStock = formatStock(stock);

        return (
            <td className="border border-black w-20 h-14 p-1">
                <div className="relative w-full h-full bg-white">
                    <svg
                        className="absolute top-0 left-0 w-full h-full"
                        viewBox="0,0 100,100"
                        preserveAspectRatio="none"
                        style={{ pointerEvents: 'none' }}
                    >
                        <polygon points="0,0 100,0 100,100" style={{ fill: '#C4B89D' }} />
                    </svg>

                    <div className="absolute top-[2px] right-[4px] text-white font-semibold text-xs print:text-black">
                        {displayCapital}
                    </div>
                    <div className="absolute bottom-[2px] left-[4px] text-black text-xs print:text-black">
                        {displayStock}
                    </div>
                </div>
            </td>
        );
    };


    // removed old static fallbacks (categories, sites, sample grid)

    // Map ticket performance API into categories, unique sites and per-category×site grid
    const ticketCategories = useMemo(() => {
        const apiMetrics = ticketPerformanceMetricsData?.data?.metrics ?? ticketPerformanceMetricsData?.metrics ?? null;
        if (Array.isArray(apiMetrics) && apiMetrics.length > 0) return apiMetrics.map((m: any) => m.category_name ?? m.category ?? 'Unknown');
        return [] as string[];
    }, [ticketPerformanceMetricsData]);

    const ticketSites = useMemo(() => {
        const apiMetrics = ticketPerformanceMetricsData?.data?.metrics ?? ticketPerformanceMetricsData?.metrics ?? null;
        if (Array.isArray(apiMetrics) && apiMetrics.length > 0) {
            const set = new Set<string>();
            apiMetrics.forEach((m: any) => {
                if (Array.isArray(m.sites)) {
                    m.sites.forEach((s: any) => {
                        if (s && (s.site_name || s.site)) set.add(s.site_name ?? s.site);
                    });
                }
            });
            const arr = Array.from(set);
            if (arr.length > 0) return arr;
        }
        return [] as string[];
    }, [ticketPerformanceMetricsData]);




    // Normalize ageing labels coming from API (e.g., "0_10", "0-10 days", "40_plus", "40+_days") into canonical keys
    const normalizeAgingBucket = (key: string): string => {
        if (!key) return '';
        let s = String(key).toLowerCase();
        s = s.replace(/days?/g, '');
        s = s.replace(/\s+/g, '');
        s = s.replace(/_/g, '-');
        s = s.replace(/to/g, '-');
        // Handle 40+ variations
        if (s.includes('40') && (s.includes('+') || s.includes('plus') || s.includes('above') || s.includes('more'))) {
            return '40+';
        }
        if (/^0-?10$/.test(s)) return '0-10';
        if (/^11-?20$/.test(s)) return '11-20';
        if (/^21-?30$/.test(s)) return '21-30';
        if (/^31-?40$/.test(s)) return '31-40';
        const dashMatch = s.match(/(\d+)-(\d+)/);
        if (dashMatch) {
            const a = parseInt(dashMatch[1], 10);
            const b = parseInt(dashMatch[2], 10);
            if (a === 0 && b === 10) return '0-10';
            if (a === 11 && b === 20) return '11-20';
            if (a === 21 && b === 30) return '21-30';
            if (a === 31 && b === 40) return '31-40';
        }
        return s;
    };

    // Parse a percentage value that may come as a number or a string like "38.46%"
    const parsePercentValue = (p: any): number => {
        if (p === null || p === undefined) return NaN;
        if (typeof p === 'number') return p;
        const s = String(p).replace(/[^0-9.\-]/g, '');
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : NaN;
    };

    // Map a numeric percentage (e.g., 7.69, 15.38) to the ageing color band labels
    const percentToAgeBand = (p: number | string | null | undefined): string => {
        const n = typeof p === 'number' ? p : parsePercentValue(p);
        if (!Number.isFinite(n) || Number.isNaN(n)) return '';
        if (n <= 10) return '0-10';
        if (n <= 20) return '11-20';
        if (n <= 30) return '21-30';
        if (n <= 40) return '31-40';
        return '40+';
    };

    const ticketGridData = useMemo(() => {
        const apiMetrics = ticketPerformanceMetricsData?.data?.metrics ?? ticketPerformanceMetricsData?.metrics ?? null;
        if (!Array.isArray(apiMetrics) || apiMetrics.length === 0) {
            return [] as any[];
        }

        const grid: any[] = [];
        const cats = ticketCategories && ticketCategories.length ? ticketCategories : apiMetrics.map((m: any) => m.category_name ?? m.category ?? 'Unknown');
        const sites = ticketSites && ticketSites.length ? ticketSites : (() => {
            const set = new Set<string>();
            apiMetrics.forEach((m: any) => {
                if (Array.isArray(m.sites)) m.sites.forEach((s: any) => s && set.add(s.site_name ?? s.site));
            });
            return Array.from(set);
        })();

        cats.forEach((cat) => {
            const metric = apiMetrics.find((m: any) => (m.category_name ?? m.category) === cat) || {};
            sites.forEach((site) => {
                const siteObj = Array.isArray(metric.sites)
                    ? metric.sites.find((s: any) => (s.site_name ?? s.site) === site)
                    : undefined;

                // Derive ageing ONLY from this site's distribution (no category-level fallback)
                let aging = '';
                const agingObj = siteObj?.aging_distribution;
                if (agingObj && typeof agingObj === 'object') {
                    let maxKey = '';
                    let maxVal = -Infinity;
                    Object.entries(agingObj).forEach(([k, v]) => {
                        const num = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^\d.]/g, '')) || 0;
                        if (num > maxVal) { maxVal = num; maxKey = k; }
                    });
                    aging = normalizeAgingBucket(maxKey);
                }

                const volumeVal = siteObj?.total_ticket_percentage ?? siteObj?.volume_percentage ?? siteObj?.volume ?? '';
                const closureVal = siteObj?.closed_ticket_percentage ?? siteObj?.closure_rate_percentage ?? '';

                // Color band: choose volume first, then closure; ignore category aggregates
                const chosenForBand = (() => {
                    const vNum = parsePercentValue(volumeVal);
                    if (Number.isFinite(vNum)) return vNum;
                    const cNum = parsePercentValue(closureVal);
                    if (Number.isFinite(cNum)) return cNum;
                    return undefined;
                })();
                const agingBand = chosenForBand !== undefined ? percentToAgeBand(chosenForBand) : aging;

                grid.push({
                    category: cat,
                    site,
                    volume: volumeVal,
                    closure: closureVal,
                    agingBand,
                    aging,
                });
            });
        });

        return grid;
    }, [ticketPerformanceMetricsData, ticketCategories, ticketSites]);

    // Normalize display of percentage values, avoiding double "%"
    const displayPercent = (p: any): string => {
        if (p === null || p === undefined || p === '') return '';
        const s = String(p).trim();
        return s.endsWith('%') ? s : `${s}%`;
    };

    const agingColors = {
        "0-10": "bg-[#F6F4EE]", // Beige
        "11-20": "bg-[#C4B89D]", // Light gray
        "21-30": "bg-[#DAD6C9]", // Light grayish-beige
        "31-40": "bg-[#D5DBDB]", // Light beige
        "40+": "bg-[#C5AF9E]", // White
    };

    const getTextColor = (aging) => {
        switch (aging) {
            case "0-10":
            case "11-20":
            case "21-30":
            case "31-40":
            case "40+":
                return "text-black"; // All colors are light, so black text is readable
            default:
                return "text-black";
        }
    };
    // removed static fallbacks for response/resolution achieved

    // If API provides quarterly response/resolution performance, map it into chart shape
    const dynamicResponseAchieved = useMemo(() => {
        const perf = responseTATQuarterlyData?.data?.performance_data
            ?? responseTATQuarterlyData?.performance_data
            ?? [];
        if (!Array.isArray(perf) || perf.length === 0) return [] as any[];

        return perf.map((row: any) => {
            const site = row.center_name || row.site_name || row.site || '';

            // Support both legacy flat percentages and new nested structure
            const lastNested = row.previous_period?.response_tat?.achieved_percentage;
            const currentNested = row.current_period?.response_tat?.achieved_percentage;

            const responseLast = Number(
                lastNested ?? row.previous_period?.response_achieved_percentage ?? 0
            );
            const responseCurrent = Number(
                currentNested ?? row.current_period?.response_achieved_percentage ?? 0
            );

            return { site, responseLast, responseCurrent };
        });
    }, [responseTATQuarterlyData]);

    const dynamicResolutionAchieved = useMemo(() => {
        // Prefer resolution-specific API if available, otherwise fall back to response API if it embeds resolution
        const perf = resolutionTATQuarterlyData?.data?.performance_data
            ?? resolutionTATQuarterlyData?.performance_data
            ?? responseTATQuarterlyData?.data?.performance_data
            ?? responseTATQuarterlyData?.performance_data
            ?? [];
        if (!Array.isArray(perf) || perf.length === 0) return [] as any[];

        return perf.map((row: any) => {
            const site = row.center_name || row.site_name || row.site || '';

            const lastNested = row.previous_period?.resolution_tat?.achieved_percentage;
            const currentNested = row.current_period?.resolution_tat?.achieved_percentage;

            const resolutionLast = Number(
                lastNested ?? row.previous_period?.resolution_achieved_percentage ?? 0
            );
            const resolutionCurrent = Number(
                currentNested ?? row.current_period?.resolution_achieved_percentage ?? 0
            );

            return { site, resolutionLast, resolutionCurrent };
        });
    }, [responseTATQuarterlyData, resolutionTATQuarterlyData]);

    // Compute dynamic max for X axis so charts scale to API values (rounded up to nearest 10, minimum 100)
    const chartMaxResponse = useMemo(() => {
        const values = dynamicResponseAchieved.flatMap(d => [Number(d.responseLast) || 0, Number(d.responseCurrent) || 0]);
        const max = values.length ? Math.max(...values) : 100;
        const rounded = Math.ceil(Math.max(max, 100) / 10) * 10;
        return rounded;
    }, [dynamicResponseAchieved]);

    const chartMaxResolution = useMemo(() => {
        const values = dynamicResolutionAchieved.flatMap(d => [Number((d as any).resolutionLast) || 0, Number((d as any).resolutionCurrent) || 0]);
        const max = values.length ? Math.max(...values) : 100;
        const rounded = Math.ceil(Math.max(max, 100) / 10) * 10;
        return rounded;
    }, [dynamicResolutionAchieved]);

    const scatterDataLast = dynamicResolutionAchieved.map(item => ({ site: item.site, value: (item as any).resolutionLast }));
    const scatterDataCurrent = dynamicResolutionAchieved.map(item => ({ site: item.site, value: (item as any).resolutionCurrent }));

    // Normalize center performance rows to an array so .map is always safe.
    // Prefer API shape meetingRoomData.center_performance.data, then meetingRoomData.data, then fallback to revenueData.table
    // If none present, use empty array.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Handle API shapes like:
    // { data: { center_performance: { data: [...] } } }
    const _centerRowsSource: any = (
        meetingRoomData?.data?.center_performance?.data
        ?? meetingRoomData?.data?.center_performance
        ?? meetingRoomData?.center_performance?.data
        ?? meetingRoomData?.data
        ?? meetingRoomData
        ?? []
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const centerRows: any[] = Array.isArray(_centerRowsSource) ? _centerRowsSource : (_centerRowsSource ? [_centerRowsSource] : []);

    // Global loading: keep the loader visible until ALL APIs have finished loading
    const isGlobalLoading = (
        loading ||
        loadingUtilization ||
        loadingSiteAdoption ||
        loadingHelpdeskSnapshot ||
        loadingTicketAgingClosure ||
        loadingTicketPerformanceMetrics ||
        loadingCustomerExperienceFeedback ||
        loadingResponseTATQuarterly ||
        loadingResolutionTATQuarterly ||
        loadingDevicePlatformStats ||
        loadingAssetOverview ||
        loadingParkingDateSiteWise ||
        loadingVisitorTrendAnalysis ||
        loadingConsumableInventoryComparison ||
        loadingCenterWiseConsumables ||
        loadingInventoryOverstockReport ||
        loadingSiteWiseChecklist ||
        loadingAmcContractSummary ||
        loadingHighestMaintenanceAssets
    );

    // If auto flag is on and all data is ready, trigger print once.
    useEffect(() => {
        if (auto && !isGlobalLoading) {
            const w = window;
            try {
                const handleAfter = () => {
                    try { w.close(); } catch { }
                    w.removeEventListener('afterprint', handleAfter as any);
                };
                w.addEventListener('afterprint', handleAfter as any);
                setTimeout(() => {
                    try { w.focus(); w.print(); } catch { }
                }, 300);
            } catch { }
        }
    }, [auto, isGlobalLoading]);

    if (isGlobalLoading) {
        return (
            <div data-loading="true" className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-red-600 mx-auto mb-3" />
                    <div className="text-gray-700">Loading report...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* readiness marker for external polling */}
            <div data-component="all-content" data-loading="false" style={{ display: 'none' }} />

            <style>{`@media print {
    @page {
        size: A4;
        margin: 0;
    }

    html,
    body {
        font-size: 18px;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .print-page {
        page-break-before: always;
        break-before: page;
      }

    .page-break {
        break-before: page;
    }

    .print-small li {
        font-size: 0.75rem;
        line-height: 1.25rem;
    }

    .print-removespace {
        padding-top: 12px !important;
    }

    .print-footer-bar {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    h3 {
        font-size: 0.85rem;
        line-height: 1rem;
    }

    .print-avoid-break {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    .print-avoid-break * {
        break-inside: avoid;
        page-break-inside: avoid;
    }
    .clip-triangle-tr {
        clip-path: polygon(0 0, 100% 0, 100% 100%);
      }
      
      .clip-triangle-bl {
        clip-path: polygon(0 100%, 0 0, 100% 100%);
      }
      img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    
      .print-bg-force {
        background-color: #bf0c0c !important;
        color: white !important;
      }     
            /* Compact vertical header labels for dense tables in print */
            .rotate-header-print {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
                white-space: nowrap;
                text-align: center;
            }
            .print-th-vertical {
                width: 28px !important;
                min-width: 28px !important;
                max-width: 28px !important;
                padding: 2px !important;
            }
            .print-th-site {
                width: 90px !important;
                min-width: 90px !important;
                max-width: 120px !important;
            }
            .print-td-narrow {
                width: 28px !important;
                min-width: 28px !important;
                max-width: 28px !important;
                padding: 2px !important;
                font-size: 9px !important;
            }
                    /* Keep grouped sections on the same printed page */
                    .print-keep-together {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    .print-avoid-before {
                        break-before: avoid !important;
                        page-break-before: avoid !important;
                    }
                    .print-avoid-after {
                        break-after: avoid !important;
                        page-break-after: avoid !important;
                    }
                    .print-tight {
                        margin-top: 0 !important;
                        margin-bottom: 8px !important;
                        padding-top: 8px !important;
                        padding-bottom: 8px !important;
                    }
}
`}</style>

            {/* main page */}
            <div className="font-sans bg-white min-h-screen print:h-screen print:scale-95">
                <div className="relative h-[700px] w-full print:h-[600px] print:overflow-hidden">
                    {/* Background Image */}
                    <img
                        src="https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        alt="Meeting Room"
                        className="w-full h-full object-cover print:h-[600px] print:object-cover"
                    />

                    {/* Black Overlay */}
                    <div className="absolute inset-0 bg-black opacity-50 print:opacity-40" />

                    {/* Overlay Text */}
                    <div className="absolute bottom-6 right-10 text-white text-sm leading-relaxed print:text-white print:bottom-4 print:right-8">
                        <p>
                            <span className="font-semibold">Company</span>: {localStorage.getItem('selectedCompany') || 'URBZ NWRK'}
                        </p>
                    </div>
                </div>


                <div className="relative flex flex-col items-center justify-center py-24 px-6 bg-white print:py-0 print:px-0">
                    {/* Red Rectangle */}
                    <div className="absolute left-[200px] top-[-100px] w-[450px] print:h-[750px] h-[600px] bg-[#bf0c0c] z-10 flex flex-col items-end justify-center space-y-6 text-white 
                    print:left-[50px] print:top-[-300px] print:w-[50%] print:text-right  print:items-end print:justify-center print:space-y-1">
                        <div className="text-5xl print:ml-10 font-bold print:text-4xl">GOPHYGITAL</div>
                        <div className="text-6xl font-extrabold print:text-4xl">REP</div>
                    </div>

                    {/* White Box with Right Half */}
                    <div className="border border-gray-300 px-10 py-12 text-center w-[55vw] h-[60vh] bg-white flex flex-col items-center justify-center space-y-6 
                print:ml-[50%] print:w-[50%] print:h-[100%] print:border print:border-gray-400 print:bg-white print:justify-center print:px-10 print:py-20">

                        {/* Overlaid Report Letters */}
                        <div className="absolute top-[-100px] print:top-[-76px] print:left-[45%] left-[45%] w-[450px] h-[600px] z-10 flex flex-col items-start print:justify-start justify-center space-y-6 text-left text-red-700
                       print:space-y-1 print:text-left print:text-red-700 print:items-start">
                            <div className="text-5xl print:ml-20 print:mt-[105px] font-bold ml-2 print:text-4xl">WORK</div>
                            <div className="text-6xl  print:ml-20  font-extrabold ml-2 print:text-4xl">ORT</div>
                        </div>

                        <div className="flex justify-end items-end print:mt-[110px]  print:mr-[110px] mb-4 mt-[10px] ml-[120px] print:w-full">
                            <p className="text-xl print:text-[18px] font-medium text-red-700 print:text-red-700 print:mt-[40px]">
                                {dateRangeLabel}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow" />
                <div className="flex justify-center items-end print:mb-1 print:pt-[140px] pb-8 text-center">
                    <img
                        src={GoPhygital} // update this path to the actual path of your image
                        alt="goPhygital"
                        className="h-6 print:h-5" // adjust height as needed
                    />
                </div>

            </div>




            {/* Disclaimer Page */}
            {/* <div className="flex flex-col min-h-screen font-sans bg-white px-6 py-10 relative">
                <div className="flex justify-center w-full">
                    <img
                        src={logo} // change this path as per your folder structure
                        alt="URBZ NWRK Logo"
                        className="h-12 md:h-16" // adjust height as needed
                    />
                </div>
                <div className="mt-6 flex justify-start">
                    <div className="inline-block font-bold px-6 py-2 border-2 border-red-700 text-white bg-red-700 transform -skew-x-12">
                        <div className="transform skew-x-12">DISCLAIMER</div>
                    </div>
                </div>
                <div className="mt-10 max-w-3xl mx-auto text-gray-800 text-base leading-7 text-justify">
                    <p className="mb-6">
                        The contents of this report reflect operational and performance data sourced from multiple internal systems.
                        The analysis provided is based on the available data at the time of compilation and may be subject to future
                        updates or corrections.
                    </p>
                    <p>
                        This report is designed to support strategic decision-making, resource planning, and process optimization.
                        Readers are advised to consult the relevant teams for clarification before drawing conclusions from the
                        information presented. Unauthorized use or external sharing is strictly prohibited.
                    </p>
                </div>
                <div className="flex-grow" />
                <div className="text-center flex justify-center align-bottom pb-8 text-sm text-gray-700 print:text-gray-700">
                    <img
                        src={GoPhygital} // update this path to the actual path of your image
                        alt="goPhygital"
                        className="h-6 print:h-5" // adjust height as needed
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-4 bg-red-700 print-footer-bar"></div>
                <div className="absolute bottom-6 right-0 w-30 h-3 bg-red-700 print-footer-small"></div>
            </div> */}

            {/* Table of Contents Page */}
            <div className="min-h-screen flex flex-col justify-between font-sans text-black bg-white px-10 py-2 relative">
                {/* Header */}
                <div>
                    {/* <div className="flex justify-center w-full mt-0">
                        <img
                            src={logo} // change this path as per your folder structure
                            alt="URBZ NWRK Logo"
                            className="h-12 md:h-16" // adjust height as needed
                        />
                    </div> */}


                    {/* Table of Content Title */}
                    <div className="mb-2 mt-4">
                        <h1 className="text-red-600 font-bold text-xl border-b-4 border-red-600 inline-block pb-1">
                            TABLE OF CONTENT
                        </h1>
                    </div>

                    {/* Annexure I */}
                    <div className="mb-2 text-sm">
                        <h2 className="text-red-600 font-semibold text-lg">Annexure I</h2>
                        <div className="mt-1 ml-4">
                            <h3 className="font-semibold">1- Meeting Room / Day Pass Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Revenue Generation Overview</li>
                                <li>Center Wise - Meeting Room / Day Pass Performance Overview</li>
                                <li>Center Wise - Meeting Room Utilization</li>
                            </ul>

                            {/* <h3 className="font-semibold mt-2">2- Wallet Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Overview Summary</li>
                                <li>Site-wise Wallet Summary</li>
                                <li>Top 10 Customers by Wallet Usage</li>
                            </ul> */}

                            <h3 className="font-semibold mt-2">2- Community Programs Dashboard</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                {/* <li>Community Health and Engagement Summary</li> */}
                                <li>Site Wise Adoption Rate</li>
                            </ul>
                        </div>
                    </div>

                    {/* Annexure II */}
                    <div className="mb-2 text-sm">
                        <h2 className="text-red-600 font-semibold text-lg">Annexure II</h2>
                        <div className="mt-1 ml-4">
                            <h3 className="font-semibold">1- Helpdesk Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Snapshot</li>
                                <li>Ticket Ageing, Closure Efficiency & Feedback Overview by Center</li>
                                <li>Ticket Performance Metrics by Category – Volume, Closure Rate & Ageing</li>
                                <li>Customer Experience Feedback</li>
                                <li>Site Performance: Customer Rating Overview</li>
                                <li>Response TAT Performance by Center – {periodUnit}ly Comparison</li>
                            </ul>

                            <h3 className="font-semibold mt-2">2- Asset Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Company-Wise Asset Overview</li>
                                <li>Center Wise - Assets and Downtime Metrics</li>
                                <li>Assets with Highest Maintenance Spend</li>
                                <li>AMC Contract Summary</li>
                                <li>AMC Contract Summary – Expiry in 90 Days</li>
                                <li>AMC Contract Summary – Expired</li>
                            </ul>

                            <h3 className="font-semibold mt-2">3- Checklist Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Checklist Progress Status – Center-wise {periodUnit}ly Comparison</li>
                                <li>Top 10 Overdue Checklists – Center-wise Contribution Comparison</li>
                            </ul>

                            <h3 className="font-semibold mt-2">4- Inventory Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Overview Summary</li>
                                <li>Overstock Analysis – Top 10 Items</li>
                                <li>Top Consumables – Centre-wise Overview</li>
                                <li>Consumable Inventory Value – {periodUnit}ly Comparison</li>
                            </ul>

                            <h3 className="font-semibold mt-2">5- Parking Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Parking Allocation Overview – Paid, Free & Vacant</li>
                            </ul>

                            <h3 className="font-semibold mt-2">6- Visitor Management</h3>
                            <ul className="list-disc list-inside pl-6 print-small">
                                <li>Visitor Trend Analysis</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex-grow" />
                <div className="text-center flex justify-center align-bottom pb-5 text-sm text-gray-700 print:text-gray-700">
                    <img
                        src={GoPhygital} // update this path to the actual path of your image
                        alt="goPhygital"
                        className="h-6 print:h-5" // adjust height as needed
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-4 bg-red-700 print-footer-bar"></div>
                <div className="absolute bottom-6 right-0 w-30 h-3 bg-red-700 print-footer-small"></div>
            </div>


            {/* First Section: Meeting Room / Hot Desk Performance Overview */}

            <div className="print-only-enhanced print-page break-before-page revenue-section">
                <h1 className="report-title text-2xl font-bold text-center mb-6 py-4 bg-[#C4B89D33]">
                    Meeting Room
                </h1>

                {/* Unified section container */}
                <div className={sectionBox}>
                    <div className="border p-6 bg-white text-black shadow print:text-black print:bg-white print:p-6 print:border print:shadow-none">
                        <h2 className="text-lg font-bold mb-4 print:text-[15px] print:font-bold">
                            Revenue Generation Overview
                        </h2>

                        <hr className="mb-6 border-gray-400 print:border-gray-400" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
                            <div className="bg-[#dfd9ce] p-6 print:bg-[#dfd9ce]">
                                <p className="italic text-lg mb-1 print:italic print:text-lg">
                                    Total Revenue from
                                </p>
                                <div className="flex justify-between items-center print:flex print:justify-between">
                                    <p className="text-2xl font-bold print:text-1xl print:font-bold">
                                        {localStorage.getItem('selectedCompany')}
                                    </p>
                                    <p className="text-3xl font-bold text-red-600 print:text-red-600 print:text-2xl">
                                        {meetingRoomData?.data?.revenue_generation_overview?.total_revenue ?? '-'}
                                    </p>
                                </div>
                            </div>
                            {/* Optional second card removed for now */}
                        </div>
                    </div>

                    {/* Center-wise Meeting Room Performance */}
                    <div className="bg-white p-4 mt-4 avoid-break">
                        <h2 className="text-lg md:text-lg font-bold tracking-wide text-black mb-4 print:text-[15px] print:font-bold">
                            Center Wise - Meeting Room Performance Overview
                        </h2>
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="min-w-full border text-sm text-center print:text-xs print:w-full print:table-fixed">
                                <thead className="bg-[#ded9cd] text-[#b62527] font-extrabold uppercase tracking-wide text-[13px] md:text-sm print:text-[10px]">
                                    <tr>
                                        <th className="border border-black p-3 text-left align-middle text-[13px] md:text-sm print:text-[10px]" rowSpan={2}>
                                            Site Name
                                        </th>
                                        <th className="border border-black p-3 text-center text-[13px] md:text-sm print:text-[10px]" colSpan={3}>
                                            Meeting Room
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="border border-black p-2 text-center text-[13px] md:text-sm print:text-[10px]">Utilization<br />Rate (in %)</th>
                                        <th className="border border-black p-2 text-center text-[13px] md:text-sm print:text-[10px]">Cancellation<br />Rate (in %)</th>
                                        <th className="border border-black p-2 text-center text-[13px] md:text-sm print:text-[10px]">Revenue<br />(in ₹)</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {centerRows.map((row: any, idx: number) => {
                                        const meeting = row.meeting_room || row.meeting || {};
                                        const utilTrend = meeting.utilization_trend || meeting.utilization_trend === undefined ? meeting.utilization_trend : null;
                                        const cancelTrend = meeting.cancellation_trend || null;
                                        const revenueTrend = meeting.revenue_trend || null;

                                        return (
                                            <tr key={idx} className="border-t">
                                                <td className="p-2 border font-medium text-left print:p-1">{row.site_name || row.site || '-'}</td>
                                                <td className="p-2 border print:p-1">
                                                    {meeting.utilization_rate ?? '-'}{' '}
                                                    <Arrow up={utilTrend === '↑'} />
                                                </td>
                                                <td className="p-2 border print:p-1">
                                                    {meeting.cancellation_rate ?? '-'}{' '}
                                                    <Arrow up={cancelTrend === '↑'} />
                                                </td>
                                                <td className="p-2 border print:p-1">
                                                    {meeting.revenue ?? '-'}{' '}
                                                    <Arrow up={revenueTrend === '↑'} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-2 print:text-[10px]">
                                <strong>Note:</strong> This table illustrates meeting room utilization, cancellations, and revenue generation,
                                along with directional arrows indicating growth, decline or neutral trend compared to the previous period.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Section: Center Wise - Meeting Room Utilization */}
            <div className="print-page break-before-page">
                <div className={sectionBox}>
                    <div className="border border-gray-400 p-4 w-full print:max-w-none print:mx-auto">
                        {/* Title */}
                        <h1 className="text-lg text-left font-bold mb-6 print:text-[14px]">
                            Center Wise - Meeting Room Utilization
                        </h1>

                        <div className="border border-gray-100 mb-3"></div>

                        {/* Legend */}
                        <div className="flex justify-end items-center gap-6 mb-6 print:gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 border border-gray-400 rounded-full"></div>
                                <span className="text-base print:text-sm">0-39%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-100 border border-gray-400 rounded-full"></div>
                                <span className="text-base print:text-sm">40-69%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 border border-gray-400 rounded-full"></div>
                                <span className="text-base print:text-sm">70-100%</span>
                            </div>
                        </div>

                        {/* Chart Grid */}
                        <div className="border border-gray-400 no-break">
                            {/* Data Grid (driven by API when available) */}
                            {centerList.map((center: any, siteIndex: number) => (
                                <div key={siteIndex} className="grid grid-cols-9 print:grid-cols-10 border-b border-gray-400">
                                    {/* Site Label (NO left border) */}
                                    <div className="p-3 font-medium text-base text-right border-b border-gray-400 print:p-2 print:text-[10px] print:leading-tight print:whitespace-normal print:break-words print:text-left print:col-span-2">
                                        {center.center_name || center.site_name || center.name || `Center ${siteIndex + 1}`}
                                    </div>

                                    {/* Utilization Range Cells */}
                                    {rangeList.slice(0, 8).map((range: any, rangeIndex: number) => {
                                        const roomName = getRoomsForRange(center, range);
                                        const cellColor = getCellColor(range);
                                        return (
                                            <div
                                                key={rangeIndex}
                                                className={`border-l border-t border-gray-400 p-2 text-sm font-semibold text-center ${cellColor} min-h-[120px] flex items-center justify-center print:p-1 print:text-xs print:min-h-[80px] print:col-span-1`}
                                            >
                                                {roomName ? (
                                                    <div className="leading-tight print:whitespace-normal print:break-words print:leading-tight print:text-[10px]">
                                                        {roomName.includes(",")
                                                            ? roomName.split(",").map((name: string, i: number) => <div key={i}>{name.trim()}</div>)
                                                            : roomName}
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Bottom Header Row: Utilization Rate */}
                            <div className="grid grid-cols-9 print:grid-cols-10">
                                <div className="p-3 font-semibold text-center print:p-2 print:text-sm text-base print:col-span-2 border-t border-gray-400"></div>
                                {rangeList.slice(0, 8).map((range, index) => (
                                    <div
                                        key={index}
                                        className="border-t border-l border-gray-400 p-2 text-sm font-semibold text-center min-h-[60px] flex items-center justify-center print:p-1 print:text-xs print:min-h-[40px] print:col-span-1"
                                    >
                                        {range}
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Bottom Label */}
                        <div className="mt-4 font-semibold w-full text-center centerone text-base print:text-sm">
                            Utilization Rate
                        </div>

                        {/* Note */}
                        <div className="mt-6 text-base print:text-sm">
                            <span className="font-semibold">Note :</span> This table presents meeting room-wise utilization along with
                            corresponding utilization percentages, providing a center-wise comparison to identify performance variations
                            across locations.
                        </div>
                    </div>
                </div>
            </div>

            {/* Third Section: Wallet Management */}
            {/* <div className="print-page break-before-page"> */}
            {/* <h1 className="report-title text-2xl font-bold mb-4 text-center bg-[#F6F4EE] py-4 print:text-2xl print:font-bold print:mb-2 print:bg-[#F6F4EE] print:py-3">
          Wallet Management
        </h1> */}

            {/* Overview Summary */}
            {/* <div className="border p-6 no-break overview-summary-section print:p-3 print:w-[95%] print:mx-auto">
          <h2 className="text-xl font-semibold mb-4 print:text-lg print:font-semibold print:mb-2">
            Overview Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 print:grid-cols-2 print:grid-rows-3 print:gap-1">
            {walletOverviewData.map((item, index) => (
              <div
                key={index}
                className={`overview-box rounded-md p-6 flex flex-col justify-center items-center h-[120px] print:p-2 print:h-[80px] ${item.bg} print:${item.bg}`}
              >
                <div className="text-[28px] font-bold text-[#ba1f2f] print:text-[18px]">
                  {item.value}
                </div>
                <div className="text-[16px] font-semibold text-black text-center mt-1 print:text-[10px] print:mt-0">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div> */}

            {/* Site-wise Wallet Summary and Top 10 Customers */}
            {/* <div className="border py-4 px-4 no-break wallet-tables print:p-3 print:w-[95%] print:mx-auto"> */}
            {/* Site-wise Wallet Summary */}
            {/* <div className="no-break">
            <h2 className="text-lg font-semibold mb-4 print:text-base print:font-semibold print:mb-1">Site-wise Wallet Summary</h2>
            <div className="overflow-x-auto print:overflow-visible">
              <table className="min-w-full divide-y divide-gray-300 border print:text-[10px] print:w-full print:table-fixed">
                <thead>
                  <tr className="bg-[#dfdbcf] text-[#b61624] text-center text-xs font-semibold border border-black print:text-[10px]">
                    {[
                      "Site Name",
                      "Total Wallet\nBalance",
                      "Top-ups",
                      "Usage",
                      "Comp.\nPoints",
                      "Refunds",
                      "Expiry Point",
                    ].map((header, i) => (
                      <th
                        key={i}
                        className="py-1 px-1 whitespace-pre-line border border-black print:py-[2px] print:px-[2px]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>


                <tbody className="text-sm text-black print:text-[10px] text-center align-middle">
                  {siteWiseData.map((row, idx) => (
                    <tr key={idx} className="bg-white border-b border-gray-300 print:border-b print:border-black">
                      <td className="px-4 py-2 bg-[#f8f6f4] font-medium print:px-1 print:py-0.5 text-center align-middle">
                        {row.site_name}
                      </td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5 text-center align-middle">
                        ₹{Number(row.total_wallet_balance || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5 text-center align-middle">
                        ₹{Number(row.topup_balance || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5 text-center align-middle">
                        ₹{Number(row.usage || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5 text-center align-middle">
                        ₹{Number(row.complimentary_points || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5 text-center align-middle">
                        ₹{Number(row.refunds || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5 text-center align-middle">
                        ₹{Number(row.expiry_points || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>



              </table>
              <p className="text-xs text-gray-700 italic mt-2 px-2 pb-2 print:text-[8px] print:mt-1 print:pb-1">
                <strong>Note</strong> : This table presents the total wallet balance across sites along with a
                detailed breakdown of usage, complimentary credits, top-ups, and expired points, offering a
                comprehensive view of wallet activity and status.
              </p>
            </div>
          </div> */}

            {/* Top 10 Customers */}
            {/* <div className="no-break">
            <h2 className="text-lg font-semibold mb-2 print:text-sm print:font-semibold print:mb-1">Top 10 Customers by Wallet Usage</h2>
            <div className="overflow-auto print:overflow-visible">
              <table className="min-w-full table-auto border border-gray-300 print:text-[10px] print:w-full print:table-fixed">
                <thead className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030]">
                  <tr>
                    <th className="px-4 py-2 print:px-1 print:py-0.5 print:w-[20%]">Customer Name</th>
                    <th className="px-4 py-2 print:px-1 print:py-0.5 print:w-[30%]">Site</th>
                    <th className="px-4 py-2 print:px-1 print:py-0.5 print:w-[15%]">Wallet Usage</th>
                    <th className="px-4 py-2 print:px-1 print:py-0.5 print:w-[15%]">Current Wallet Balance</th>
                    <th className="px-4 py-2 print:px-1 print:py-0.5 print:w-[10%]">Active Users</th>
                  </tr>
                </thead>
                <tbody>
                  {custoWallData.map((cust, i) => (
                    <tr key={i} className="text-center">
                      <td className="px-4 py-2 print:px-1 print:py-0.5 bg-[#F3F1EB]">{cust.entity_name}</td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5">{cust.site_name}</td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5">{Number(cust.amount).toLocaleString()}</td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5">{Number(cust.amount).toLocaleString()}</td>
                      <td className="px-4 py-2 print:px-1 print:py-0.5">{cust.total_users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-xs text-gray-700 italic mt-2 px-2 pb-2 print:text-[8px] print:mt-1 print:pb-1">
                <strong>Note</strong> : This table presents the top customers by wallet usage, highlighting key
                clients and their activity across sites.
              </p>
            </div>
          </div> */}
            {/* </div> */}
            {/* </div> */}

            {/* Fourth Section: Community Programs Dashboard */}
            <div className="print-page break-before-page">
                <h1 className="report-title text-3xl bg-[#F6F4EE] py-5 font-bold text-center text-gray-800 mb-6 print:text-black print:text-xl print:py-2 print:mb-1">
                    Community Programs Dashboard
                </h1>
                <div className={sectionBox}>
                    <h2 className="text-lg font-bold md:text-lg text-gray-700 mb-4 print:text-black print:text-[15px]">Community Engagement Metrics</h2>

                    <div className="grid grid-cols-2 gap-4 mb-8 print:gap-1 print:mb-2">
                        {/* Total Active Users Block */}

                        <div className="bg-[#DAD6C9] p-6 rounded shadow print:p-2 print:shadow-none">
                            {/* Top section: 450 + Total Active Users */}
                            <div className="flex items-center justify-center gap-4 mb-6 print:mb-2">
                                <p className="text-4xl font-bold text-[#C72030] print:text-xl">{devicePlatformStatsData?.data?.summary?.total_active_users ?? devicePlatformStatsData?.data?.total_active_users ?? '-'}</p>
                                <div>
                                    <p className="text-lg font-bold text-black leading-tight print:text-sm">Total Active Users</p>
                                    <p className="text-sm text-black print:text-[10px]">(App Downloaded)</p>
                                </div>
                            </div>

                            {/* Bottom section: Android and iOS */}
                            <div className="flex items-center justify-center gap-6 text-[#C72030] print:gap-2">
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold print:text-sm">{devicePlatformStatsData?.data?.summary?.platform_breakdown?.android ?? devicePlatformStatsData?.data?.android ?? '-'}</p>
                                    <p className="text-black font-semibold text-sm print:text-[10px]">Android</p>
                                </div>
                                <div className="border-l h-6 border-black"></div>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold print:text-sm">{devicePlatformStatsData?.data?.summary?.platform_breakdown?.ios ?? devicePlatformStatsData?.data?.ios ?? '-'}</p>
                                    <p className="text-black font-semibold text-sm print:text-[10px]">IOS</p>
                                </div>
                            </div>
                        </div>

                        {/* New Users Block */}
                        <div className="bg-[#DAD6C9] p-6 rounded shadow print:p-2 print:shadow-none">
                            <div className="flex items-center justify-center gap-3">
                                <p className="text-4xl font-bold text-[#C72030] print:text-xl">{devicePlatformStatsData?.data?.new_users ?? devicePlatformStatsData?.data?.summary?.new_users ?? '-'}</p>
                                <span className="text-green-600 text-2xl print:text-base">↑</span>
                            </div>
                            <p className="text-black text-center font-semibold text-lg mt-2 print:text-[10px]">New Users</p>
                        </div>
                    </div>

                    {/*
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 print:text-black print:text-sm print:mb-1">Community Health and Engagement Summary</h2>
                    <hr className="border-t border-gray-400 mb-4 print:border-black print:mb-1" />

                    <div className="overflow-x-auto print:overflow-visible mb-12 community-section print:mb-2">
                        <table className="table-auto w-full border border-black print:table-fixed print:w-full print:text-[10px]">
                            <thead className="bg-[#DAD6C9] text-[#C72030] print-bg-red">
                                <tr>
                                    {[
                                        "Center Name", "Events Held", "Event Attendance %", "Active Chat Users",
                                        "Chat Group Activity", "Post", "Avg Interaction", "Total Members"
                                    ].map((header, idx) => (
                                        <th key={idx} className="p-2 border border-black print:p-1 print:w-[10%] text-center">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {communityData.map((row, i) => (
                                    <tr key={i} className="text-center bg-[#F3F1EB80] print:bg-white">
                                        <td className="p-2 border border-black print:p-1">{row.center}</td>
                                        <td className="p-2 border border-black print:p-1">{row.events}</td>
                                        <td className="p-2 border border-black print:p-1">{row.attendance}</td>
                                        <td className="p-2 border border-black print:p-1">{row.chatUsers}</td>
                                        <td className="p-2 border border-black print:p-1">{row.chatMsgs}</td>
                                        <td className="p-2 border border-black print:p-1">{row.posts}</td>
                                        <td className="p-2 border border-black print:p-1">{row.interaction}</td>
                                        <td className="p-2 border border-black print:p-1">{row.members}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    */}

                    {/* Section Heading & Divider */}
                    <h2 className="text-lg md:text-lg font-bold tracking-wide text-black mb-4 print:text-[15px]">Site Wise Adoption Rate</h2>
                    <hr className="border-t border-gray-400 mb-4 print:border-black " />

                    {/* Legend */}
                    <div className="flex items-end gap-16 mb-4 justify-end print:gap-2  print:text-[10px]">
                        {(() => {
                            // Try to use legend from API, else fallback
                            const legendObj = siteAdoptionData?.data?.legend;
                            const colorMap = {
                                red: 'bg-red-600',
                                yellow: 'bg-yellow-400',
                                green: 'bg-green-600',
                                'bg-red-600': 'bg-red-600',
                                'bg-yellow-400': 'bg-yellow-400',
                                'bg-green-600': 'bg-green-600',
                            };
                            const underlineMap = {
                                red: 'border-red-600',
                                yellow: 'border-yellow-400',
                                green: 'border-green-600',
                                'bg-red-600': 'border-red-600',
                                'bg-yellow-400': 'border-yellow-400',
                                'bg-green-600': 'border-green-600',
                            };
                            let legendArr;
                            if (legendObj && typeof legendObj === 'object') {
                                legendArr = Object.entries(legendObj).filter(([k]) => k.includes('%')).map(([label, color]) => {
                                    const colorKey = String(color);
                                    return {
                                        label,
                                        color: colorMap[colorKey] || colorKey,
                                        underline: underlineMap[colorKey] || colorKey,
                                    };
                                });
                            } else {
                                legendArr = [
                                    { color: "bg-red-600", underline: "border-red-600", label: "0–39%" },
                                    { color: "bg-yellow-400", underline: "border-yellow-400", label: "40–69%" },
                                    { color: "bg-green-600", underline: "border-green-600", label: "70–100%" },
                                ];
                            }
                            // Ensure consistent ascending order based on the starting number (e.g., 0, 40, 70)
                            const sortedLegend = [...legendArr].sort((a: any, b: any) => {
                                const pa = parseInt(String(a?.label ?? ''), 10);
                                const pb = parseInt(String(b?.label ?? ''), 10);
                                return (isNaN(pa) ? 0 : pa) - (isNaN(pb) ? 0 : pb);
                            });

                            return sortedLegend.map(({ color, underline, label }, idx) => {
                                const lbl = String(label ?? '').trim();
                                const displayLabel = lbl.startsWith('>') ? lbl : `> ${lbl}`;
                                return (
                                    <div key={idx} className="flex flex-col items-start gap-1 print:gap-[2px]">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-4 h-4 rounded-full ${color} inline-block print:w-3 print:h-3`} />
                                            <span className="text-sm font-bold text-black print:text-black print:text-[8.8px] inline-block">
                                                {displayLabel}
                                                {/* underline exactly under the label text width */}
                                                <span className={`block border-b-2 ${underline} rounded-full mt-1 print:mt-[2px]`}></span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>



                    {/* Adoption Table */}
                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="table-auto w-full border border-black print:table-fixed print:w-full print:text-[8.8px]">
                            <thead className="bg-[#DAD6C9] text-[#C72030] print-bg-red font-extrabold uppercase tracking-wide text-[13px] md:text-sm print:text-[10px]">
                                <tr>
                                    {[
                                        "Site Name", "Helpdesk", "Assets", "Checklist (Tech)",
                                        "Checklist (Non-Tech)", "Inventory", "Meeting Room",

                                    ].map((header, idx) => (
                                        <th
                                            key={idx}
                                            className="p-2 border border-black print:p-1 print:w-[11%] text-center text-[13px] md:text-sm print:text-[10px]"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(siteAdoptionData?.data?.adoption_rates ?? []).map((row: any, i: number) => {
                                    // If API row is object, extract fields; else fallback to array shape
                                    const isApiObj = row && typeof row === 'object' && !Array.isArray(row);
                                    const fields = isApiObj
                                        ? [
                                            row.site_name || '-',
                                            row.helpdesk || '0%',
                                            row.assets || '0%',
                                            row.checklist_tech || '0%',
                                            row.checklist_nontech || row.checklist_non_tech || '0%',
                                            row.inventory || '0%',
                                            row.meeting_room || '0%',
                                            // row.day_pass || '0%'
                                        ]
                                        : row;
                                    return (
                                        <tr key={i} className="text-center print:even:bg-white">
                                            <td className="p-2 border border-black font-semibold text-left print:p-1">{fields[0]}</td>
                                            {fields.slice(1, 8).map((value: string, idx: number) => {
                                                // Strip % and convert to number for coloring
                                                const num = Number(String(value).replace(/[^\d.\-]+/g, ''));
                                                return (
                                                    <td
                                                        key={idx}
                                                        className="p-2 border border-black print:p-1"
                                                    >
                                                        <div className={`inline-block border-b-2 ${getColor(num)}`}>
                                                            {value}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm text-gray-600 mt-4 print:text-black print:text-[8.8px] print:mt-1 space-y-2 print:space-y-0">
                        <strong>Note :</strong> The table displays module-wise adoption percentages, calculated based on the following logic/formula.<br /><br />
                        <span className="block mt-3 print:mt-0"><strong>Helpdesk</strong> : Total Closed Tickets / Total Raised Tickets * 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Assets</strong> : (Number Of Asset In Use / Total Number Of Assets) * 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Checklist (Tech)</strong> : Total Checklist Completed / Total Schedule Checklist * 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Checklist (Nontech)</strong> : Total Checklist Completed / Total Schedule Checklist * 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Inventory</strong> : (Number Of Items Used / Total Items Available) × 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Meeting Room</strong> : (Booked Slots / Total Available Slots) * 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Day Pass</strong> : (Occupied Desks / Total Available Desks) * 100</span>
                        <span className="block mt-3 print:mt-0"><strong>Customer users</strong> : Total Count Of Active Customer Users</span>
                    </p>


                </div>
            </div>

            {/* Fifth Section: Helpdesk Management */}
            <div className="print-page break-before-page">
                <h1 className="report-title text-3xl font-bold text-center mb-6 bg-[#F6F4EE] py-5 text-gray-800 print:text-black print:text-xl print:mb-5 print:py-2">
                    Helpdesk Management
                </h1>
                <div className={sectionBox}>
                    {/* Snapshot Section */}
                    <div className="mb-10 print:mb-5 border border-gray-300 px-6 py-5 print:px-2 print:py-2">
                        <h2 className="text-lg font-bold md:text-lg mb-4 border-b border-gray-300 pb-2 print:text-[14px] print:mb-1 print:pb-1">Snapshot</h2>
                        <div className="grid grid-cols-3 gap-8 print:gap-3">
                            {/* Total Tickets */}
                            <div className="bg-[#F6F4EE] p-6 text-center print:bg-[#F6F4EE] print:p-4 min-h-[120px] flex flex-col items-center justify-center gap-1">
                                <div className="text-3xl font-bold print:text-xl">{helpdeskSnapshotData?.data?.snapshot?.total_tickets?.count ?? 0}</div>
                                <div className="text-sm font-medium text-gray-500 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.total_tickets?.percentage ?? '-'} %</div>
                                <div className="text-sm font-semibold text-gray-800 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.total_tickets?.label ?? 'Total Tickets'}</div>
                            </div>
                            {/* Closed Tickets */}
                            <div className="bg-[#F6F4EE] p-6 text-center print:bg-[#F6F4EE] print:p-4 min-h-[120px] flex flex-col items-center justify-center gap-1">
                                <div className="text-3xl font-bold text-green-600 print:text-xl print:text-green-600">{helpdeskSnapshotData?.data?.snapshot?.closed_tickets?.count ?? 0}</div>
                                <div className="text-sm font-medium text-gray-500 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.closed_tickets?.percentage ?? '-'} %</div>
                                <div className="text-sm font-semibold text-gray-800 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.closed_tickets?.label ?? 'Closed Tickets'}</div>
                            </div>
                            {/* Open Tickets */}
                            <div className="bg-[#F6F4EE] p-6 text-center print:bg-[#F6F4EE] print:p-4 min-h-[120px] flex flex-col items-center justify-center gap-1">
                                <div className="text-3xl font-bold text-red-600 print:text-xl print:text-red-600">{helpdeskSnapshotData?.data?.snapshot?.open_tickets?.count ?? 0}</div>
                                <div className="text-sm font-medium text-gray-500 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.open_tickets?.percentage ?? '-'} %</div>
                                <div className="text-sm font-semibold text-gray-800 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.open_tickets?.label ?? 'Open Tickets'}</div>
                            </div>
                            {/* Customer Tickets */}
                            <div className="bg-[#F6F4EE] p-6 text-center print:bg-[#F6F4EE] print:p-4 min-h-[120px] flex flex-col items-center justify-center gap-1">
                                <div className="text-3xl font-bold print:text-xl">{helpdeskSnapshotData?.data?.snapshot?.customer_tickets?.count ?? 0}</div>
                                <div className="text-sm font-semibold text-gray-800 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.customer_tickets?.label ?? 'Customer Tickets'}</div>
                            </div>
                            {/* FM Tickets */}
                            <div className="bg-[#F6F4EE] p-6 text-center print:bg-[#F6F4EE] print:p-4 min-h-[120px] flex flex-col items-center justify-center gap-1">
                                <div className="text-3xl font-bold print:text-xl">{helpdeskSnapshotData?.data?.snapshot?.fm_tickets?.count ?? 0}</div>
                                <div className="text-sm font-semibold text-gray-800 print:text-[10px]">{helpdeskSnapshotData?.data?.snapshot?.fm_tickets?.label ?? 'FM Tickets'}</div>
                            </div>
                            {/* Total Average Customer Rating */}
                            <div className="bg-[#F6F4EE] p-6 text-center print:bg-[#F6F4EE] print:p-4 min-h-[120px] flex flex-col items-center justify-center gap-1">
                                <div className="text-3xl font-bold print:text-xl">{helpdeskSnapshotData?.data?.average_customer_rating?.rating ?? 0}</div>
                                <div className="text-sm font-semibold text-gray-800 print:text-[10px]">{helpdeskSnapshotData?.data?.average_customer_rating?.label ?? 'Total Average Customer Rating'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section 1 */}
                    <div className="table-section w-full overflow-x-auto print:overflow-visible border-gray-300  border py-3 px-3 mb-5 print:p-1 print:mb-5">
                        <h2 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2 print:text-[14px] print:mb-5 print:pb-1">Ticket Ageing, Closure Efficiency & Feedback Overview by Center</h2>
                        <table className="w-full border text-sm text-center break-words print:table-fixed print:w-full print:text-[9px]">
                            <thead className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030] font-semibold print-bg-red">
                                <tr>
                                    <th className="border border-gray-200 px-2 py-3 text-[13px] md:text-sm font-semibold print:text-[10px] print:px-1 print:py-1 print-th-site print:min-h-[30px]">Site Name</th>
                                    {ticketAgingClosureData?.data?.centers?.map((center, idx) => (
                                        <th
                                            key={idx}
                                            className="border border-gray-200 px-2 py-3 text-[13px] md:text-sm font-semibold print:text-[10px] print:px-0 print:py-1 print-th-vertical print:min-h-[120px]"
                                        >
                                            <div className="rotate-header-print">{center.center_name ?? '-'}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Aging Buckets Rows */}
                                {[
                                    { label: "40+ days", key: "40+_days" },
                                    { label: "31-40 days", key: "31-40_days" },
                                    { label: "21-30 days", key: "21-30_days" },
                                    { label: "11-20 days", key: "11-20_days" },
                                    { label: "0-10 days", key: "0-10_days" },
                                ].map((row, idx) => (
                                    <tr key={row.key}>
                                        <td className="border border-gray-200 px-2 py-3 font-medium bg-[#F3F1EB80] print:px-1 print:py-1 print:bg-[#F3F1EB80] print:min-h-[30px] print-th-site">
                                            {row.label}
                                        </td>
                                        {ticketAgingClosureData?.data?.centers?.map((center, cIdx) => (
                                            <td
                                                key={cIdx}
                                                className="border border-gray-200 px-2 py-3 print:px-0 print:py-1 print:min-h-[30px] print-td-narrow"
                                            >
                                                {center.aging_buckets?.[row.key] ?? '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {/* Total Closure % Row */}
                                <tr className="bg-[#DAD6C9] font-semibold print:bg-[#DAD6C9]">
                                    <td className="border border-gray-200 px-2 py-3 font-medium bg-[#F3F1EB80] print:px-1 print:py-1 print:bg-[#F3F1EB80] print:min-h-[30px] print-th-site">
                                        Total Closure %
                                    </td>
                                    {ticketAgingClosureData?.data?.centers?.map((center, cIdx) => (
                                        <td
                                            key={cIdx}
                                            className="border border-gray-200 px-2 py-3 print:px-0 print:py-1 print:min-h-[30px] print-td-narrow"
                                        >
                                            {center.total_closure_efficiency ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                                {/* No. of response Row */}
                                <tr>
                                    <td className="border border-gray-200 px-2 py-3 font-medium bg-[#F3F1EB80] print:px-1 print:py-1 print:bg-[#F3F1EB80] print:min-h-[30px] print-th-site">
                                        No. of response
                                    </td>
                                    {ticketAgingClosureData?.data?.centers?.map((center, cIdx) => (
                                        <td
                                            key={cIdx}
                                            className="border border-gray-200 px-2 py-3 print:px-0 print:py-1 print:min-h-[30px] print-td-narrow"
                                        >
                                            {center.feedback_metrics?.response_count ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                                {/* % of Response Row */}
                                <tr>
                                    <td className="border border-gray-200 px-2 py-3 font-medium bg-[#F3F1EB80] print:px-1 print:py-1 print:bg-[#F3F1EB80] print:min-h-[30px] print-th-site">
                                        % of Response
                                    </td>
                                    {ticketAgingClosureData?.data?.centers?.map((center, cIdx) => (
                                        <td
                                            key={cIdx}
                                            className="border border-gray-200 px-2 py-3 print:px-0 print:py-1 print:min-h-[30px] print-td-narrow"
                                        >
                                            {center.feedback_metrics?.response_percentage !== undefined ? `${(center.feedback_metrics.response_percentage).toFixed(2)}%` : '-'}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-xs mt-2 text-gray-600 print:text-[8px] print:mt-1">
                            <strong>Note</strong> : This chart illustrates the number of tickets closed below or above the average aging time, along with the number of customer responses received. It also reflects the percentage of responded tickets relative to the total tickets raised.
                        </p>
                    </div>
                </div>




            </div>

            <div className="print-page break-before-page">
                {/* Ticket Performance Metrics Section */}
                <div className="ticket-metrics-section mb-10 print:mt-8">
                    <div className=" flex flex-col justify-start border border-gray-300  m-auto print:w-[95.5%] w-[95.5%] p-10   print:p-8">
                        <style>{`
          .clip-triangle-tr { clip-path: polygon(100% 0, 0 0, 100% 100%); }
          .clip-triangle-bl { clip-path: polygon(0 0, 0 100%, 100% 100%); }

          @media print {
            .clip-triangle-tr {
              clip-path: polygon(0 0, 100% 0, 100% 100%);
              -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%);
            }
            .clip-triangle-bl {
              clip-path: polygon(0 100%, 0 0, 100% 100%);
              -webkit-clip-path: polygon(0 100%, 0 0, 100% 100%);
            }
            .rotate-print {
              transform: rotate(-45deg);
              font-size: 9px !important;
            }
          }
        `}</style>
                        <div className="print:mt-5">
                            <h1 className="text-lg md:text-lg font-bold mb-2 border-b border-gray-300 pb-2 print:text-[14px] print:mb-1">
                                Ticket Performance Metrics by Category – Volume, Closure Rate & Ageing
                            </h1>
                            <div className="flex items-center justify-between gap-4 flex-wrap text-sm print:text-xs print:gap-2">
                                <div className="flex items-center gap-1">
                                    <span>% of tickets raised by category</span>
                                    <span className="mx-1 text-gray-600" aria-hidden>→</span>
                                    {/* Diagonal split box indicator */}
                                    <span className="relative inline-block w-5 h-5 border border-gray-300 mx-2 print:w-4 print:h-4" aria-hidden>
                                        <span className="absolute inset-0 clip-triangle-tr" style={{ backgroundColor: '#DAD6C9' }} />
                                        <span className="absolute inset-0 clip-triangle-bl" style={{ backgroundColor: '#FFFFFF' }} />
                                    </span>
                                    <span className="mx-1 text-gray-600" aria-hidden>←</span>
                                    <span>% of tickets closure by category</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Ageing:</span>
                                    <div className="flex items-center gap-2 print:gap-1">
                                        {Object.entries(agingColors).map(([range, color]) => (
                                            <div key={range} className="flex items-center gap-1">
                                                <span className={`w-4 h-4 rounded-full ${color} print:w-3 print:h-3`}></span>
                                                <span>{range}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid and Site Row Container */}
                        <div className="flex justify-center mt-10 print:mt-5">
                            <div className="flex">
                                {/* New row-based layout to guarantee proper alignment between category labels and their site cells */}
                                <div className="flex flex-col">
                                    {ticketCategories.map((cat) => {
                                        return (
                                            <div key={cat} className="flex mb-[10px] last:mb-0">
                                                {/* Category label */}
                                                <div className="w-[140px] flex items-center justify-end pr-2 text-[10px] font-medium print:text-[8px] print:w-[120px]">
                                                    {cat}
                                                </div>
                                                {/* Cells for each site within this category */}
                                                <div className="grid grid-cols-10 gap-[10px] print:gap-[6px]">
                                                    {ticketSites.map((site) => {
                                                        const item = ticketGridData.find(d => d.category === cat && d.site === site);
                                                        return (
                                                            <div key={site + cat} className="relative w-[100px] h-16 print:w-[50px] print:h-15 border border-[#C4AE9D] bg-white">
                                                                <div className={`absolute inset-0 clip-triangle-tr ${agingColors[item?.agingBand || item?.aging] || 'bg-white'}`}></div>
                                                                <div className="absolute inset-0 clip-triangle-bl bg-white"></div>
                                                                <div className={`absolute top-1 right-1 text-xs print:text-[9px] ${getTextColor(item?.agingBand || item?.aging)} print:rotate-print`}>
                                                                    <span className="font-bold">{item ? displayPercent(item.closure) : ''}</span>
                                                                </div>
                                                                <div className={`absolute bottom-1 left-2 text-xs print:text-[9px] ${getTextColor(item?.agingBand || item?.aging)}`}>
                                                                    <span>{item ? displayPercent(item.volume) : ''}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* Site header row placed after rows for print width consistency */}
                                    <div className="flex mt-4 print:mt-2">
                                        <div className="w-[140px] print:w-[120px]" />
                                        <div className="grid grid-cols-10 gap-[10px] print:gap-[6px]">
                                            {ticketSites.map((site) => (
                                                <div key={site} className="text-center text-[10px] font-medium print:text-[8px] w-[100px] print:w-[50px]">
                                                    {site}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs mt-4 text-gray-600 print:text-[10px] print:mt-1">
                            <strong>Note</strong> : This chart illustrates the number of tickets closed below or above the average aging time, along with the number of customer responses received. It also reflects the percentage of responded tickets relative to the total tickets raised.
                        </p>
                    </div>

                </div>

            </div>

            {/* Customer Experience Feedback and Site Performance on New Page */}
            <div className="print-page break-before-page   print:m-auto">
                {/* Customer Experience Feedback */}
                <div className="border print:w-[95%] w-[95%] m-auto print:mt-10 border-gray-300 p-6 mb-10 no-break print:p-2 print:mb-2">
                    <h2 className="text-lg md:text-lg font-bold mb-4 border-b border-gray-300 pb-2 print:text-[14px] print:mb-1 print:pb-1">Customer Experience Feedback</h2>
                    <div className="grid grid-cols-5 print:gap-1">
                        {displayCustomerExperienceData.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center justify-center h-[140px] print:h-[100px] border-r last:border-r-0"
                                style={{ backgroundColor: item.bg, color: item.text || "#000" }}
                            >
                                <div className="text-3xl font-bold print:text-xl">{item.value}</div>
                                <div className="text-sm font-medium print:text-[10px]">{item.percent}</div>
                                <div className="text-base font-semibold mt-1 print:text-[10px] print:mt-0">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Site Performance Table 2 */}
                <div className="site-performance print:w-[95%] w-[95%] m-auto bg-white border border-gray-300 p-6 overflow-auto no-break print:p-2">
                    <h2 className="text-lg md:text-lg font-bold mb-4 print:text-[14px] print:mb-2">
                        Site Performance: Customer Rating Overview
                    </h2>
                    <table className="min-w-full text-base text-center border print:table-fixed print:w-full print:text-[10px] print:leading-tight">
                        <thead className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030]">
                            <tr>
                                <th className="border border-gray-200 px-3 py-6 print:px-2 print:py-2 print:min-h-[32px] print:text-[9px] print:whitespace-normal print:break-words print:align-top">
                                    Site Name
                                </th>

                                {customerExperienceSiteNames.map((name, index) => (
                                    <th
                                        key={index}
                                        className="border border-gray-200 px-3 py-6 print:px-1 print:py-2 print:min-h-[32px] print:text-[9px] print:whitespace-normal print:break-words print:align-top"
                                    >
                                        {name}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {customerRatingData.rows.map((row, idx) => {
                                const isTotal = row.label === "Total Responses";
                                return (
                                    <tr
                                        key={idx}
                                        className={isTotal ? "font-semibold bg-[#DAD6C9]" : ""}
                                    >
                                        <td
                                            className={`px-3 py-6 print:px-2 print:py-2 print:min-h-[32px] print:text-[9px] print:leading-snug print:whitespace-normal print:break-words print:align-top font-medium ${isTotal
                                                ? "border border-gray-300"
                                                : "border-l border-r border-gray-200 bg-[#F3F1EB80] print:bg-[#F3F1EB80]"
                                                }`}
                                        >
                                            {row.label}
                                        </td>
                                        {row.values.map((val, vIdx) => (
                                            <td
                                                key={vIdx}
                                                className={`px-3 py-6 print:px-1 print:py-2 print:min-h-[32px] print:text-[9px] print:leading-snug print:whitespace-normal print:break-words print:align-top ${isTotal ? "border border-gray-300" : "border-l border-r border-gray-200"}
                                                    `}
                                            >
                                                {val}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <p className="text-sm mt-3 text-gray-600 print:text-[9px] print:mt-2">
                        <strong>Note</strong>: This table displays customer rating percentages categorized from Excellent to Bad, with a site-level comparison to evaluate performance and satisfaction trends across locations.
                    </p>
                </div>


            </div>


            <div className="print-page break-before-page">
                <div className={sectionBox}>

                    {/* Title */}
                    <h1 className="text-3xl md:text-3xl font-bold text-center bg-[#F6F4EE] py-3 mb-2 print:text-xl print:py-2 print:mb-0 border-b border-dashed border-gray-300">
                        Response TAT Performance by Center – {periodUnit}ly Comparison
                    </h1>

                    {/* Legend Row */}
                    <div className="flex print:w-[95%] w-[95%] m-auto flex-col items-end gap-2 px-6 print:px-4 print:py-4 text-sm print:text-xs mb-4">
                        {/* Row 1: Response Achieved */}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Response Achieved</span>
                            <span className="font-medium">:</span>

                            {/* Striped Circle for Last Quarter */}
                            <div className="w-4 h-4 rounded-full border border-[#8B6D4F] bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,#8B6D4F_2px,#8B6D4F_4px)]" />
                            <span>{lastLabel}</span>

                            {/* Solid Circle for Current Quarter */}
                            <div className="w-4 h-4 rounded-full bg-[#C4AD98] ml-6" />
                            <span>{currentLabel}</span>
                        </div>

                        {/* Row 2: Resolution Achieved */}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Resolution Achieved</span>
                            <span className="font-medium">:</span>

                            {/* Striped Circle for Last Quarter */}
                            <div className="w-4 h-4 rounded-full border border-[#8B6D4F] bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,#8B6D4F_2px,#8B6D4F_4px)]" />
                            <span>{lastLabel}</span>

                            {/* Solid Circle for Current Quarter */}
                            <div className="w-4 h-4 rounded-full bg-[#C4AD98] ml-6" />
                            <span>{currentLabel}</span>
                        </div>
                    </div>


                    {/* Section Header for Chart */}
                    <div className="flex flex-col px-6 print:p-4 mb-6">
                        <h2 className="text-lg print:text-[14px] font-semibold mb-2">Response Achieved (TAT in Percentage)</h2>
                        <div className="border-b border-gray-300 w-full" />
                    </div>

                    {/* Print-only mini legend to ensure visibility in PDF */}
                    <div className="hidden print:flex items-center justify-end gap-4 px-6 print:px-4 print:py-1 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full border border-[#8B6D4F] bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,#8B6D4F_2px,#8B6D4F_4px)]" />
                            <span>{lastLabel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#C4AD98]" />
                            <span>{currentLabel}</span>
                        </div>
                    </div>

                    {/* Screen/Desktop full graph (hidden in print) */}
                    <div className="w-full hidden md:block print:hidden">
                        <div
                            style={{
                                width: '100%',
                                height: `${Math.max(400, Math.min(900, ((dynamicResponseAchieved?.length || 1) * 48) + 160))}px`,
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dynamicResponseAchieved}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    {/* 1. Add pattern defs for striped fill */}
                                    <defs>
                                        <pattern
                                            id="stripedPattern"
                                            patternUnits="userSpaceOnUse"
                                            width="6"
                                            height="6"
                                            patternTransform="rotate(45)"
                                        >
                                            <line x1="0" y="0" x2="0" y2="6" stroke="#C4B89D" strokeWidth="2" />
                                        </pattern>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" />

                                    {/* 2. X Axis at top with % */}
                                    <XAxis
                                        type="number"
                                        domain={[0, chartMaxResponse]}
                                        ticks={Array.from({ length: Math.max(2, chartMaxResponse / 10) }, (_, i) => (i + 1) * 10)}
                                        tickFormatter={(tick) => `${tick}%`}
                                        orientation="top"
                                        tick={{ fontSize: 12 }}
                                        axisLine={{ stroke: '#000' }}
                                        tickLine={{ stroke: '#000' }}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="site"
                                        tick={{ fontSize: 12 }}
                                        width={160}
                                    />

                                    <Tooltip content={(props: any) => <CustomTooltip {...props} />} />
                                    <Legend verticalAlign="top" align="right" />

                                    {/* 3. Apply striped pattern to Last Quarter bar */}
                                    <Bar
                                        dataKey="responseLast"
                                        fill="url(#stripedPattern)"
                                        name={lastLabel}
                                    />

                                    {/* 4. Solid color for Current Quarter bar */}
                                    <Bar
                                        dataKey="responseCurrent"
                                        fill="#C4AE9D"
                                        name={currentLabel}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Print/PDF graph (no in-chart legend to avoid overlap) */}
                    <div className="w-full overflow-x-auto block print:block md:hidden">
                        <BarChart
                            width={750}
                            height={700}
                            data={dynamicResponseAchieved}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            {/* 1. Add pattern defs for striped fill (unique id for Response) */}
                            <defs>
                                <pattern
                                    id="stripedPatternResponse"
                                    patternUnits="userSpaceOnUse"
                                    width="6"
                                    height="6"
                                    patternTransform="rotate(45)"
                                >
                                    <line x1="0" y="0" x2="0" y2="6" stroke="#C4B89D" strokeWidth="2" />
                                </pattern>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />

                            {/* 2. X Axis at top with % */}
                            <XAxis
                                type="number"
                                domain={[0, chartMaxResponse]}
                                ticks={Array.from({ length: Math.max(2, chartMaxResponse / 10) }, (_, i) => (i + 1) * 10)}
                                tickFormatter={(tick) => `${tick}%`}
                                orientation="top"
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#000' }}
                                tickLine={{ stroke: '#000' }}
                            />

                            <YAxis
                                type="category"
                                dataKey="site"
                                tick={{ fontSize: 12 }}
                                width={140}
                            />

                            <Tooltip content={(props: any) => <CustomTooltip {...props} />} />

                            {/* 3. Apply striped pattern to Last Quarter bar */}
                            <Bar
                                dataKey="responseLast"
                                fill="url(#stripedPatternResponse)"
                                name={lastLabel}
                            />

                            {/* 4. Solid color for Current Quarter bar */}
                            <Bar
                                dataKey="responseCurrent"
                                fill="#C4AE9D"
                                name={currentLabel}
                            />
                        </BarChart>
                    </div>

                </div>
            </div>

            <div className="print-page break-before-page">
                <div className={sectionBox}>

                    <div className="flex p-4 flex-col print:p-4 mb-8">
                        <h2 className="text-lg md:text-lg print:text-[14px] font-bold mb-2">Resolution Achieved (TAT in Percentage)</h2>
                        <div className="border-b border-gray-300 w-full" />
                    </div>

                    {/* Print-only mini legend for Resolution section */}
                    <div className="hidden print:flex items-center justify-end gap-4 px-6 print:px-4 print:py-1 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full border border-[#8B6D4F] bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,#8B6D4F_2px,#8B6D4F_4px)]" />
                            <span>{lastLabel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#C4AD98]" />
                            <span>{currentLabel}</span>
                        </div>
                    </div>

                    {/* Screen/Desktop full graph (hidden in print) */}
                    <div className="w-full hidden md:block print:hidden">
                        <div
                            style={{
                                width: '100%',
                                height: `${Math.max(400, Math.min(900, ((dynamicResolutionAchieved?.length || 1) * 48) + 160))}px`,
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dynamicResolutionAchieved}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    {/* Striped Pattern Def */}
                                    <defs>
                                        <pattern
                                            id="stripedPattern"
                                            patternUnits="userSpaceOnUse"
                                            width="6"
                                            height="6"
                                            patternTransform="rotate(45)"
                                        >
                                            <line x1="0" y1="0" x2="0" y2="6" stroke="#C4B89D" strokeWidth="2" />
                                        </pattern>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        type="number"
                                        domain={[0, chartMaxResolution]}
                                        ticks={Array.from({ length: Math.max(2, chartMaxResolution / 10) }, (_, i) => (i + 1) * 10)}
                                        tickFormatter={(tick) => `${tick}%`}
                                        orientation="top"
                                        tick={{ fontSize: 12 }}
                                        axisLine={{ stroke: '#000' }}
                                        tickLine={{ stroke: '#000' }}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="site"
                                        tick={{ fontSize: 12 }}
                                        width={160}
                                    />

                                    <Tooltip content={(props: any) => <CustomTooltip {...props} />} />
                                    <Legend verticalAlign="top" align="right" />

                                    {/* Last Quarter with Stripes */}
                                    <Bar
                                        dataKey="resolutionLast"
                                        fill="url(#stripedPattern)"
                                        name={lastLabel}
                                    />

                                    {/* Current Quarter with Solid Fill */}
                                    <Bar
                                        dataKey="resolutionCurrent"
                                        fill="#C4AE9D"
                                        name={currentLabel}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto block print:block md:hidden">
                        <BarChart
                            width={750}
                            height={700}
                            data={dynamicResolutionAchieved}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            {/* Striped Pattern Def (unique id for Resolution) */}
                            <defs>
                                <pattern
                                    id="stripedPatternResolution"
                                    patternUnits="userSpaceOnUse"
                                    width="6"
                                    height="6"
                                    patternTransform="rotate(45)"
                                >
                                    <line x1="0" y="0" x2="0" y2="6" stroke="#C4B89D" strokeWidth="2" />
                                </pattern>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                domain={[0, chartMaxResolution]}
                                ticks={Array.from({ length: Math.max(2, chartMaxResolution / 10) }, (_, i) => (i + 1) * 10)}
                                tickFormatter={(tick) => `${tick}%`}
                                orientation="top"
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: '#000' }}
                                tickLine={{ stroke: '#000' }}
                            />

                            <YAxis
                                type="category"
                                dataKey="site"
                                tick={{ fontSize: 12 }}
                                width={140}
                            />

                            <Tooltip content={(props: any) => <CustomTooltip {...props} />} />

                            {/* Last Quarter with Stripes */}
                            <Bar
                                dataKey="resolutionLast"
                                fill="url(#stripedPatternResolution)"
                                name={lastLabel}
                            />

                            {/* Current Quarter with Solid Fill */}
                            <Bar
                                dataKey="resolutionCurrent"
                                fill="#C4AE9D"
                                name={currentLabel}
                            />
                        </BarChart>
                    </div>
                    <p className="print:text-[12px] text-sm text-gray-500 p-4 mt-4 print:mt-4">
                        <strong>Note:</strong> This graph shows the total visitor count compared to the previous period,
                        providing a clear view of trends and changes in footfall over time for performance comparison.
                    </p>
                </div>
            </div>

            {/* Ninth Section: Asset Management (New Section) */}
            <div className="print-page break-before-page">
                <h1 className="report-title text-3xl font-bold text-center bg-[#F6F4EE] py-4 mb-10 print:text-black print:text-xl print:mb-1 print:py-2">
                    Asset Management
                </h1>

                {/* Main Container */}
                <div className={sectionBox}>

                    {/* Company Wise Overview */}
                    <div className="bg-white border border-gray-300 p-4 mb-10 print:p-2 print:mb-2 no-break">
                        <h2 className="text-lg font-bold md:text-lg mb-4 border-b border-black py-4 print:text-[14px] print:mb-1 print:py-2.5">
                            Company Wise Asset Overview
                        </h2>
                        <div className="grid grid-cols-3 bg-[#DAD6C9] text-[#C72030] text-center font-bold text-[15px] md:text-[15px] tracking-wide overflow-hidden print-bg-red print:text-[13px]">
                            <div className="py-4 border-r border-white px-2 leading-snug print:py-2.5 print:px-1">Total Available Asset</div>
                            <div className="py-4 border-r border-white px-2 leading-snug print:py-2.5 print:px-1">Asset In Breakdown</div>
                            <div className="py-4 px-2 leading-snug print:py-2.5 print:px-1">Average Downtime</div>
                        </div>
                        <div className="grid grid-cols-3 bg-[#f2f0eb] font-extrabold text-center  text-4xl md:text-xl py-6 border-t border-black print:text-[11px] print:py-2.5">
                            <div className="border-r text-3xl print:text-xl border-black px-2 break-words">{companyAssetOverview?.total_available_asset ?? '-'}</div>
                            <div className="border-r text-3xl print:text-xl border-black px-2 break-words">{companyAssetOverview?.asset_in_breakdown ?? '-'}</div>
                            <div className="px-2 text-3xl print:text-xl break-words">{companyAssetOverview?.average_downtime_days !== undefined ? `${companyAssetOverview?.average_downtime_days} Days` : '-'}</div>
                        </div>
                    </div>

                    {/* Center Wise Metrics Table */}

                    {/* Table 1 */}
                    <div className="center-metrics-table border px-3 border-gray-300  overflow-x-auto print:overflow-visible no-break print:p-1 print:mb-1">
                        <h2 className="text-lg md:text-lg font-bold py-4 border-b border-black mb-4 tracking-wide print:text-[14px] print:py-1 print:mb-1">
                            Center Wise – Assets And Downtime Metrics
                        </h2>

                        <table className="min-w-full border border-black text-sm text-center print:table-fixed print:w-full print:text-[10px] print:leading-tight">
                            <thead>
                                <tr className="bg-[#DAD6C9] text-[#C72030] font-extrabold text-[14px] md:text-[14px] uppercase tracking-wide print:text-[11px]">
                                    <th rowSpan={2} scope="col" className="border border-black px-2 py-2 print:px-1 print:py-1 w-[20%] text-left">Site Name</th>
                                    <th rowSpan={2} scope="col" className="border border-black px-2 py-2 print:px-1 print:py-1">Total No. of Assets</th>
                                    <th colSpan={2} scope="colgroup" className="border border-black px-2 py-2 print:px-1 print:py-1">Critical</th>
                                    <th colSpan={2} scope="colgroup" className="border border-black px-2 py-2 print:px-1 print:py-1">Non-Critical</th>
                                </tr>
                                <tr className="bg-[#DAD6C9] text-[#C72030] font-bold text-[13px] md:text-[14px] uppercase tracking-wide print:text-[10px]">
                                    <th className="border border-black px-2 py-1 print:px-1 print:py-1">Total No. of Breakdown</th>
                                    <th className="border border-black px-2 py-1 print:px-1 print:py-1">Average Day</th>
                                    <th className="border border-black px-2 py-1 print:px-1 print:py-1">Total No. of Breakdown</th>
                                    <th className="border border-black px-2 py-1 print:px-1 print:py-1">Average Day</th>
                                </tr>
                            </thead>

                            <tbody>
                                {centerMetrics.length > 0 ? (
                                    centerMetrics.map((row: any, idx: number) => (
                                        <tr key={idx} className="text-[12px] md:text-[13px] print:text-[10px]">
                                            <td className="border border-black px-2 py-2 text-left bg-[#F3F1EB80] print:px-1 print:py-1">{row.site_name ?? '-'}</td>
                                            <td className="border border-black px-2 py-2 print:px-1 print:py-1">{row.total_assets ?? 0}</td>
                                            <td className="border border-black px-2 py-2 print:px-1 print:py-1">{row.critical?.breakdown ?? 0}</td>
                                            <td className="border border-black px-2 py-2 print:px-1 print:py-1">{row.critical?.average_day ?? 0}</td>
                                            <td className="border border-black px-2 py-2 print:px-1 print:py-1">{row.non_critical?.breakdown ?? 0}</td>
                                            <td className="border border-black px-2 py-2 print:px-1 print:py-1">{row.non_critical?.average_day ?? 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="border border-black px-2 py-2 text-center print:px-1 print:py-1">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <p className="text-xs text-gray-700 mt-2 print:text-[9px] print:mt-1">
                            <strong>Note:</strong> This table presents the center-wise total asset count along with the number of breakdown occurrences. It also includes the average downtime for both critical and non-critical assets, offering insights into operational efficiency and helping identify areas that require maintenance prioritization.
                        </p>
                    </div>


                    {/* Table 2 */}
                    <div className="bg-white border px-3 border-gray-300 mt-4 mb-6 print:mt-2 print:p-1 print:mb-1">
                        <h2 className="text-lg md:text-lg ml-2 border-b border-gray-300 font-bold mb-4 tracking-wide print:text-[14px] print:mb-1">
                            Assets With Highest Maintenance Spend
                        </h2>
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="min-w-full border border-black text-sm text-center align-middle print:text-[10px]">
                                <thead className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030]">
                                    <tr className="uppercase font-extrabold tracking-wide text-[13px] md:text-sm print:text-[10px]">
                                        {["Rank", "Asset Name/ID", "Asset Category", "Site Name", "Maintenance Cost (₹)", "Total Maintenance %", "Remark"].map((col) => (
                                            <th
                                                key={col}
                                                scope="col"
                                                className="border border-black px-2 py-2 print:px-1 print:py-1 whitespace-nowrap"
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingHighestMaintenanceAssets ? (
                                        <tr>
                                            <td colSpan={7} className="border border-black px-2 py-2 text-center print:px-1 print:py-1">Loading...</td>
                                        </tr>
                                    ) : highestAssets.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="border border-black px-2 py-2 text-center print:px-1 print:py-1">No data available</td>
                                        </tr>
                                    ) : (
                                        <>
                                            {highestAssets.map((row: any, idx: number) => (
                                                <tr key={idx} className="bg-white print:bg-white text-[12px] md:text-[13px]">
                                                    <td className="border border-black px-2 py-2 font-semibold print:px-1 print:py-[8px]">{row.rank ?? ''}</td>
                                                    <td className="border border-black px-2 py-2 text-left print:px-1 print:py-[8px]">{row.asset_name_id ?? ''}</td>
                                                    <td className="border border-black px-2 py-2 print:px-1 print:py-[8px]">{row.asset_category ?? '-'}</td>
                                                    <td className="border border-black px-2 py-2 text-left print:px-1 print:py-[8px]">{row.site_name ?? '-'}</td>
                                                    <td className="border border-black px-2 py-2 text-right tabular-nums print:px-1 print:py-[8px]">₹{Number(row.total_maintenance_cost ?? 0).toLocaleString()}</td>
                                                    <td className="border border-black px-2 py-2 font-medium print:px-1 print:py-[8px]">{Number(row.maintenance_percent ?? 0).toFixed(2)}%</td>
                                                    <td className="border border-black px-2 py-2 text-left print:px-1 print:py-[10px]">{row.remark ?? '-'}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-bold bg-[#F6F4EE]">
                                                <td colSpan={4} className="border border-black px-2 py-2 text-right print:px-1 print:py-[8px]">Total</td>
                                                <td className="border border-black px-2 py-2 text-right tabular-nums print:px-1 print:py-[8px]">₹{highestTotals.total_cost.toLocaleString()}</td>
                                                <td className="border border-black px-2 py-2 font-semibold print:px-1 print:py-[8px]">{highestTotals.total_percent.toFixed(2)}%</td>
                                                <td className="border border-black px-2 py-2 print:px-1 print:py-[8px]"></td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>

                            </table>
                        </div>
                        <p className="text-xs text-gray-700 mt-2 print:text-[9px] print:mt-1">
                            <strong>Note:</strong> This table lists the top 10 assets with the highest maintenance spend, highlighting the assets that incur the most significant costs
                        </p>
                    </div>

                </div>

            </div>


            {/*  Active AMC Contracts + 90 Days Expiry (kept together) */}
            <div className="print-page break-before-page print:w-[95%] print:m-auto print-keep-together">
                {/* AMC Contract Summary - standardized section box */}
                <div className={sectionBox}>
                    <h2 className="text-lg md:text-lg font-bold tracking-wide mb-4 border-b border-gray-300 pb-2 print:text-[14px] print:mb-2 print:pb-1">
                        AMC Contract Summary
                    </h2>
                    <div className="grid grid-cols-3 border border-gray-300 bg-[#f2f0eb] text-black font-semibold divide-x divide-gray-300 print:py-2">
                        <div className="px-4 py-6 flex flex-col items-center justify-center gap-1 print:py-2 print:px-2 print:text-[12px]">
                            <span className="uppercase tracking-wide text-[13px] font-bold print:text-[12px]">Active AMC Contracts</span>
                            <span className="text-4xl leading-tight text-[#C72030] font-extrabold tabular-nums print:text-xl">
                                {loadingAmcContractSummary ? '...' : (amcSummary ? amcSummary.active.toLocaleString() : '-')}
                            </span>
                        </div>
                        <div className="px-4 py-6 flex flex-col items-center justify-center gap-1 print:py-2 print:px-2 print:text-[12px]">
                            <span className="uppercase tracking-wide text-[13px] font-bold print:text-[12px] text-center">Contract Expiry in 90 Days</span>
                            <span className="text-4xl leading-tight text-[#C72030] font-extrabold tabular-nums print:text-xl">
                                {loadingAmcContractSummary ? '...' : (amcSummary ? amcSummary.expiry90.toLocaleString() : '-')}
                            </span>
                        </div>
                        <div className="px-4 py-6 flex flex-col items-center justify-center gap-1 print:py-2 print:px-2 print:text-[12px]">
                            <span className="uppercase tracking-wide text-[13px] font-bold print:text-[12px]">Contract Expired</span>
                            <span className="text-4xl leading-tight text-[#C72030] font-extrabold tabular-nums print:text-xl">
                                {loadingAmcContractSummary ? '...' : (amcSummary ? amcSummary.expired.toLocaleString() : '-')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AMC Contract Summary – Expiry in 90 Days - standardized section box */}
                <div className={sectionBox}>
                    <h2 className="text-lg md:text-lg font-bold tracking-wide mb-4 border-b border-gray-300 pb-2 print:text-[14px] print:mb-2 print:pb-1">
                        AMC Contract Summary – Expiry in 90 Days
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-black text-sm text-center align-middle print:text-[9px] print:leading-relaxed print:table-fixed print:w-full">
                            <thead className="bg-[#DAD6C9] text-[#c72030]">
                                <tr className="uppercase font-extrabold tracking-wide text-[13px] md:text-sm print:text-[10px]">
                                    {['Site Name', 'AMC Name', 'Contract Start Date', 'Contract End Date', 'Renewal Reminder', 'Contract Cost (₹)', 'Vendor Contact'].map(h => (
                                        <th
                                            key={h}
                                            scope="col"
                                            className="border border-black px-4 py-2 whitespace-nowrap print:whitespace-normal print:break-words print:leading-tight print:px-1 print:py-1.5"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loadingAmcContractSummary ? (
                                    <tr><td colSpan={7} className="border border-black px-4 py-2 text-center print:px-1 print:py-2">Loading...</td></tr>
                                ) : amcExpiringContracts.length === 0 ? (
                                    <tr><td colSpan={7} className="border border-black px-4 py-2 text-center print:px-1 print:py-2">No data available</td></tr>
                                ) : (
                                    amcExpiringContracts.map((row: any, i: number) => {
                                        // Determine if the contract is expiring within 1 month (<=31 days) or the reminder text mentions 1 month
                                        const daysUntil = (() => {
                                            const d = row.contract_end_date ? new Date(row.contract_end_date) : null;
                                            if (!d || isNaN(d.getTime())) return Infinity;
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            d.setHours(0, 0, 0, 0);
                                            return Math.round((d.getTime() - today.getTime()) / 86400000);
                                        })();
                                        const reminderText = String(row.renewal_reminder || '').toLowerCase();
                                        const highlightRenewal = (
                                            (daysUntil >= 0 && daysUntil <= 31) ||
                                            /within\s*1\s*month/.test(reminderText) ||
                                            /\b1\s*month/.test(reminderText) ||
                                            /30\s*day/.test(reminderText)
                                        );
                                        return (
                                            <tr key={i} className="bg-white text-[12px] md:text-[13px] print:text-[9px]">
                                                <td className="border border-black px-4 py-2 bg-[#F3F1EB] font-semibold print:px-1 print:py-1.5">{row.site_name ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.amc_name ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.contract_start_date ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.contract_end_date ?? '-'}</td>
                                                <td className={`border border-black px-4 py-2 print:px-1 print:py-1.5 ${highlightRenewal ? 'text-[#C72030] font-semibold' : ''}`}>{row.renewal_reminder ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 text-right tabular-nums print:px-1 print:py-1.5">₹{Number(row.projected_renewal_cost ?? 0).toLocaleString()}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.vendor_contact ?? '-'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className="p-3 text-xs text-gray-600 italic border-t border-gray-300 print:p-1 print:text-[8px] print:leading-relaxed print:mt-2">
                        <strong>Note:</strong> Expiring within 90 days – aids proactive renewal and budget planning.
                    </p>
                </div>
                <div className={sectionBox}>
                    <div className="border border-gray-300 py-3 px-3 print:shadow-none break-inside-avoid print:break-inside-avoid">
                        <h2 className="font-bold text-lg md:text-lg tracking-wide mb-3 pb-2 border-b border-gray-300 print:text-[14px] print:mb-1 print:pb-1">
                            AMC Contract Summary – Expired
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-black text-sm text-center align-middle print:table-fixed print:w-full print:text-[9px] print:leading-relaxed">
                                <thead className="bg-[#DAD6C9] text-[#c72030]">
                                    <tr className="uppercase font-extrabold tracking-wide text-[13px] md:text-sm print:text-[10px]">
                                        {['Site Name', 'AMC Name', 'Contract Start Date', 'Contract End Date', 'Status', 'Projected Renewal Cost (₹)', 'Vendor Contact'].map(h => (
                                            <th
                                                key={h}
                                                scope="col"
                                                className="border border-black px-4 py-2 whitespace-nowrap print:whitespace-normal print:break-words print:leading-tight print:px-1 print:py-1.5"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingAmcContractSummary ? (
                                        <tr><td colSpan={7} className="border border-black px-4 py-2 text-center print:px-1 print:py-2">Loading...</td></tr>
                                    ) : amcExpiredContracts.length === 0 ? (
                                        <tr><td colSpan={7} className="border border-black px-4 py-2 text-center print:px-1 print:py-2">No data available</td></tr>
                                    ) : (
                                        amcExpiredContracts.map((row: any, i: number) => (
                                            <tr key={i} className="bg-white text-[12px] md:text-[13px] print:text-[9px]">
                                                <td className="border border-black px-4 py-2 bg-[#F3F1EB] font-semibold print:px-1 print:py-1.5">{row.site_name ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.amc_name ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.contract_start_date ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.contract_end_date ?? '-'}</td>
                                                <td className="border border-black px-4 py-2 font-semibold print:px-1 print:py-1.5">{row.status ?? 'Expired'}</td>
                                                <td className="border border-black px-4 py-2 text-right tabular-nums print:px-1 print:py-1.5">₹{Number(row.projected_renewal_cost ?? 0).toLocaleString()}</td>
                                                <td className="border border-black px-4 py-2 print:px-1 print:py-1.5">{row.vendor_contact ?? '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p className="p-3 text-xs text-gray-600 italic border-t border-gray-300 print:p-1 print:text-[8px] print:leading-relaxed print:mt-2">
                            <strong>Note:</strong> Expired contracts – review for renewal decisions and vendor follow‑ups.
                        </p>
                    </div>
                </div>



            </div>

            {/* Checklist Management */}
            <div className="print-page break-before-page">
                <div className="py-6 bg-white min-h-screen text-black print:bg-white print:text-black print:p-2 print:w-[100%] print:mx-auto no-break">

                    <h1 className="report-title text-2xl font-bold mb-6 text-center bg-[#F6F4EE] py-3 print:text-xl print:mb-1 print:py-2">
                        Checklist Management
                    </h1>

                    {/* Print-specific styles to improve table fit and prevent header/arrow overflow */}
                    <style>{`
                                            @media print {
                                                /* General tightening for both checklist tables */
                                                .checklist-progress-table table,
                                                .overdue-table table {
                                                    font-size: 9px !important;
                                                }
                                                .checklist-progress-table th,
                                                .checklist-progress-table td,
                                                .overdue-table th,
                                                .overdue-table td {
                                                    padding: 2px 4px !important;
                                                    line-height: 1.15 !important;
                                                    vertical-align: middle !important;
                                                }
                                                /* Allow long headers to wrap instead of overflowing */
                                                .overdue-table thead th,
                                                .checklist-progress-table thead th {
                                                    white-space: normal !important;
                                                    word-break: break-word !important;
                                                    overflow-wrap: anywhere !important;
                                                    hyphens: auto !important;
                                                }
                                                /* Slightly smaller header text */
                                                .overdue-table thead th,
                                                .checklist-progress-table thead th {
                                                    font-size: 9px !important;
                                                }
                                                /* Ensure arrows don’t stretch row height */
                                                .arrow-print {
                                                    font-size: 10px !important;
                                                    line-height: 1 !important;
                                                    display: inline-block !important;
                                                    transform: translateY(-1px);
                                                }
                                                /* Narrow the first column a bit to free space for categories */
                                                .overdue-table .site-col {
                                                    width: 16% !important;
                                                }
                                            }
                                        `}</style>

                    {/* Tables block: stretch to fill one print page */}
                    <div className={sectionBox}>
                        <div className="print:flex print:flex-col print:gap-2 print:h-[calc(100vh-180px)]">
                            {/* Table 1: Checklist Progress Status */}
                            <div className="border border-gray-300 px-3 rounded mb-10 comment checklist-progress-table print:mb-2 min-h-[300px] print:flex-1 print:flex print:flex-col print:min-h-0">
                                <div className="p-4 text-lg md:text-lg font-bold border-b border-gray-300 print:p-2 print:text-[14px] ">
                                    Checklist Progress Status – Center-Wise {periodUnit}ly Comparison
                                </div>
                                <div className="print:flex-1">
                                    <table className="w-full border-t border-b border-black print:table-fixed print:w-full print:text-[10px] print:h-full">
                                        <thead>
                                            <tr className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030] text-left print-bg-red border-b border-black">
                                                <th className="py-4 px-4 print:py-2 print:px-2 print:w-[16%]">Site Name</th>
                                                <th className="py-4 px-4 print:py-2 print:px-2 print:w-[16%]">Open</th>
                                                <th className="py-4 px-4 print:py-2 print:px-2 print:w-[16%]">In Progress</th>
                                                <th className="py-4 px-4 print:py-2 print:px-2 print:w-[16%]">Overdue</th>
                                                <th className="py-4 px-4 print:py-2 print:px-2 print:w-[16%]">Partially Closed</th>
                                                <th className="py-4 px-4 print:py-2 print:px-2 print:w-[16%]">Closed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingSiteWiseChecklist ? (
                                                <tr>
                                                    <td colSpan={6} className="py-6 text-center text-gray-500 print:py-2 border-b border-black">
                                                        Loading checklist progress...
                                                    </td>
                                                </tr>
                                            ) : checklistProgress.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-6 text-center text-gray-500 print:py-2 border-b border-black">
                                                        No checklist progress data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                checklistProgress.map((row: any, i: number) => {
                                                    const site = row.site_name ?? row.center_name ?? row.site ?? '-';
                                                    // Only use current_period (or flattened current values) and difference
                                                    const curRaw = row.current_period ?? row.current ?? row.period_current ?? {};
                                                    const diffRaw = row.difference ?? row.delta ?? {};

                                                    // Fallback: some APIs duplicate values at top-level (row.open etc.)
                                                    const pick = (status: string) => {
                                                        const direct = curRaw[status];
                                                        if (direct !== undefined) return direct;
                                                        return row[status];
                                                    };
                                                    const pickDiff = (status: string) => {
                                                        const d = diffRaw[status];
                                                        if (d !== undefined) return d;
                                                        return 0; // no reconstruction without previous period
                                                    };

                                                    const toNum = (v: any) => {
                                                        if (typeof v === 'number') return v;
                                                        if (typeof v === 'string') {
                                                            const s = v.trim().replace(/%/g, '');
                                                            const n = parseFloat(s);
                                                            return Number.isFinite(n) ? n : 0;
                                                        }
                                                        return 0;
                                                    };
                                                    const fmt = (v: any) => {
                                                        const n = toNum(v);
                                                        return Number.isFinite(n) ? (Number.isInteger(n) ? `${n}%` : `${n.toFixed(2)}%`) : '0%';
                                                    };
                                                    const fmtDiff = (v: any) => {
                                                        const n = toNum(v);
                                                        if (!n) return '0%';
                                                        const abs = Math.abs(n);
                                                        const base = Number.isInteger(abs) ? `${abs}%` : `${abs.toFixed(2)}%`;
                                                        return n > 0 ? `+${base}` : `-${base}`;
                                                    };

                                                    const curOpen = pick('open');
                                                    const curInProg = pick('in_progress');
                                                    const curOver = pick('overdue');
                                                    const curPart = pick('partially_closed');
                                                    const curClosed = pick('closed');

                                                    const diffOver = pickDiff('overdue');
                                                    const diffClosed = pickDiff('closed');

                                                    // Arrow logic: Overdue up = red, down = green. Closed up = green, down = red.
                                                    const overdueArrowUp = diffOver > 0;
                                                    const overdueArrowDown = diffOver < 0;
                                                    const closedArrowUp = diffClosed > 0;
                                                    const closedArrowDown = diffClosed < 0;

                                                    return (
                                                        <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50 print:bg-gray-50' : ''} border-b border-gray-300 last:border-b-0`}>
                                                            <td className="py-5 px-4 bg-[#F6F4EE] print:py-2 print:px-2 print:bg-[#F6F4EE]">{site}</td>
                                                            <td className="py-5 px-4 print:py-2 print:px-2">{fmt(curOpen)}</td>
                                                            <td className="py-5 px-4 print:py-2 print:px-2">{fmt(curInProg)}</td>
                                                            <td className="py-5 px-4 flex items-center gap-1 print:py-2 print:px-2">
                                                                {fmt(curOver)} <span className="text-xs text-gray-600">(Δ {fmtDiff(diffOver)})</span>
                                                                {overdueArrowUp && <span className="text-red-600 arrow-print">▲</span>}
                                                                {overdueArrowDown && <span className="text-green-600 arrow-print">▼</span>}
                                                                {!overdueArrowUp && !overdueArrowDown && <span className="text-gray-400">—</span>}
                                                            </td>
                                                            <td className="py-5 px-4 print:py-2 print:px-2">{fmt(curPart)}</td>
                                                            <td className="py-5 px-4 flex items-center gap-1 print:py-2 print:px-2">
                                                                {fmt(curClosed)} <span className="text-xs text-gray-600">(Δ {fmtDiff(diffClosed)})</span>
                                                                {closedArrowUp && <span className="text-green-600 arrow-print">▲</span>}
                                                                {closedArrowDown && <span className="text-red-600 arrow-print">▼</span>}
                                                                {!closedArrowUp && !closedArrowDown && <span className="text-gray-400">—</span>}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-sm mt-4 px-4 py-2 italic text-gray-700 print:text-[8px] print:mt-2 print:px-2 print:py-1 print:text-black">
                                    <strong>Note :</strong> Values show current period status distribution. Δ indicates the reported difference for that status (no previous-period values displayed).
                                </div>
                            </div>

                            {/* Table 2: Top 10 Overdue Checklists */}
                            <div className="border border-gray-300 px-3 rounded comment overdue-table min-h-[300px] print:flex-1 print:flex print:flex-col print:min-h-0">
                                <div className="p-4 text-lg font-bold md:text-lg border-b border-gray-300 print:p-2 print:text-[14px] ">
                                    Top 10 Overdue Checklists – Center-wise Contribution Comparison
                                </div>
                                <div className="print:flex-1">
                                    <table className="w-full border-t border-b border-black text-sm print:table-fixed print:w-full print:text-[10px] print:h-full ">
                                        <thead>
                                            <tr className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030] text-left print-bg-red border-b border-black">
                                                <th className="py-4 px-4 site-col print:py-2 print:px-2 print:w-[18%]">Site Name</th>
                                                {top10Overdue.categories.map((cat, idx) => (
                                                    <th key={idx} className="py-4 px-2 text-center print:py-2 print:px-1">
                                                        {cat}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingSiteWiseChecklist ? (
                                                <tr>
                                                    <td colSpan={(top10Overdue.categories.length || 0) + 1} className="py-6 text-center text-gray-500 print:py-2 border-b border-gray-300">
                                                        Loading top overdue checklists...
                                                    </td>
                                                </tr>
                                            ) : !top10Overdue.categories.length || !top10Overdue.siteRows.length ? (
                                                <tr>
                                                    <td colSpan={(top10Overdue.categories.length || 0) + 1} className="py-6 text-center text-gray-500 print:py-2 border-b border-gray-300">
                                                        No overdue checklist data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                top10Overdue.siteRows.map((site, i) => {
                                                    const byCat = new Map<string, number>();
                                                    if (Array.isArray(site.categories)) {
                                                        site.categories.forEach((c: any) => {
                                                            if (c && typeof c.category === 'string') {
                                                                byCat.set(c.category, Number(c.overdue_percentage ?? 0));
                                                            }
                                                        });
                                                    }
                                                    const fmt = (n: number) => `${Number(n || 0).toFixed(0)}%`;
                                                    return (
                                                        <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50 print:bg-gray-50' : ''} border-b border-gray-300 last:border-b-0`}>
                                                            <td className="py-5 px-4 site-col bg-[#F6F4EE] print:py-2 print:px-2 print:bg-[#F6F4EE]">{site.site_name ?? '-'}</td>
                                                            {top10Overdue.categories.map((cat, j) => (
                                                                <td key={j} className="py-5 px-2 text-center print:py-2 print:px-1">
                                                                    {fmt(byCat.get(cat) ?? 0)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-sm mt-4 px-4 py-2 italic text-gray-700 print:text-[8px] print:mt-2 print:px-2 print:py-1 print:text-black">
                                    <strong>Note :</strong> The table displays the top 10 most overdue checklists, with a center-wise
                                    breakdown of their contribution to the overall overdue count, helping identify key areas of concern.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Inventory Management */}
            <div className="print-page break-before-page">
                <h1 className="report-title text-2xl font-bold mb-6 text-center bg-[#F6F4EE] py-3 print:text-xl print:mb-1 print:py-0">
                    Inventory Management
                </h1>
                <div className={sectionBox}>

                    <div className="border border-gray-300 p-3">
                        <h2 className="text-lg font-bold md:text-lg mb-4 print:text-[14px] print:mb-1 print:py-0">
                            Overview Summary
                        </h2>
                        <hr className="border-t border-gray-300 mb-6 print:mb-2" />

                        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-3 print:w-[92%] print:mx-auto">
                            {loadingInventoryOverstockReport ? (
                                <div className="col-span-2 text-center text-gray-500 print:text-[10px]">Loading overview...</div>
                            ) : !overstockSummary ? (
                                <div className="col-span-2 text-center text-gray-500 print:text-[10px]">No overview data available</div>
                            ) : (
                                inventoryOverviewCards.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#f2eee9] p-6 text-center shadow-sm print:bg-[#f2eee9] print:p-3 print:shadow-none print:text-[10px] print:leading-relaxed"
                                    >
                                        <div className="text-xl font-extrabold mb-1 print:text-[12px] print:mb-2">{item.value}</div>
                                        <div className="text-gray-700 text-sm print:text-[10px]">{item.label}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* OverstockGridExact Component */}
                    <div className=" mt-3 print:p-0  border border-gray-300 p-2">
                        <style>{`
                /* Screen view styles only, scoped to overstock-table class */
                .overstock-table {
                  border-collapse: separate !important;
                        border-spacing: 1px !important; /* Increased gap to 8px */
                }
                .legend-circle-capital {
                    background-color: #8B7D47; /* Darker shade for Capital Book */
                    width: 12px;
                    height: 5px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 4px;
                }
                .legend-circle-stock {
                    background-color: #D3D3D3; /* Lighter shade for Current Stock */
                    width: 12px;
                    height: 5px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 4px;
                }
            `}</style>
                        <div className="mb-4 print:mb-1 print:mt-4 ">
                            <h1 className="text-lg font-bold md:text-lg mb-4 print:text-[14px] print:mb-1 print:py-0">
                                Overstock Analysis – Top 10 Items
                            </h1>
                            <hr className="my-2 border-gray-300 print:border-gray-300" />
                            <div className="flex justify-end items-center space-x-5 mr-2">
                                {/* Capital Book */}
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 print:w-4 print:h-4 rounded-full bg-[#c8bda3] border border-black"></div>
                                    <span className="text-md print:text-[10px] font-medium">Capital Block</span>
                                </div>

                                {/* Current Stock */}
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 print:w-4 print:h-4 rounded-full bg-[#dedace] border border-[#a5a39f]"></div>
                                    <span className="text-md print:text-[10px] font-medium">Current Stock</span>
                                </div>
                            </div>

                        </div>
                        <div className="overflow-x-auto print:overflow-x-visible">
                            {loadingInventoryOverstockReport ? (
                                <div className="text-center text-gray-500 text-sm print:text-[10px]">Loading overstock items...</div>
                            ) : (!itemss?.length || !sitesk?.length) ? (
                                <div className="text-center text-gray-500 text-sm print:text-[10px]">No overstock analysis data available</div>
                            ) : (
                                <>
                                    <table className="overstock-table print:border-separate">
                                        <tbody>
                                            {itemss.map((item, rowIdx) => (
                                                <tr key={rowIdx}>
                                                    <td
                                                        className="p-2 text-xs text-left font-semibold bg-white w-[180px] align-top whitespace-normal break-words leading-tight mx-0 my-0 
                                    print:text-[9px] print:font-semibold print:bg-white print:w-[160px] print:text-left print:mx-0 print:my-1 print:whitespace-normal print:break-words print:leading-tight"
                                                    >
                                                        {item.name}
                                                    </td>
                                                    {item.capital.map((cap, colIdx) => (
                                                        <Block
                                                            key={colIdx}
                                                            capital={cap}
                                                            capitalText={item.capitalText ? item.capitalText[colIdx] : undefined}
                                                            stock={item.stock[colIdx]}
                                                        />
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th
                                                    className="w-[180px] bg-white mx-0 my-0 
                                print:w-[160px] print:bg-white print:mx-0 print:my-1"
                                                ></th>
                                                {sitesk.map((site, idx) => (
                                                    <th
                                                        key={idx}
                                                        className="p-2 text-[10px] font-medium text-center bg-white w-28 mx-0 my-0 whitespace-normal break-words leading-tight 
                                    print:text-[8px] print:font-medium print:text-center print:bg-white print:w-24 print:mx-0 print:my-1 print:whitespace-normal print:break-words print:leading-tight"
                                                    >
                                                        {site}
                                                    </th>
                                                ))}
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div className="text-sm mt-4 px-4 py-2 italic text-gray-700 print:text-[8px] print:mt-2 print:px-2 print:py-1 print:text-black">
                                        <strong>Note :</strong> This grid shows the Top 10 overstocked items per site. Each cell displays the capital blocked (in k) and the current stock (in %).
                                    </div>
                                </>
                            )}
                        </div>
                    </div>


                </div>
            </div>

            {/*Consumables Overview */}
            <div className="print-page break-before-page">
                <h1 className="report-title text-2xl font-bold mb-0 text-center bg-[#F6F4EE] py-3 print:text-xl print:mb-1 print:py-2">
                    Consumables Overview
                </h1>
                <div className={sectionBox}>


                    {/* Top Consumables – Centre-wise Overview */}
                    <div className="border border-gray-300 comment p-4 mt-0 print:border-gray-300 print:p-4 print:mt-0">
                        <h2 className="text-lg md:text-lg font-bold tracking-wide mb-4 border-b border-gray-300 pb-2 print:text-[14px] print:mb-2 print:pb-1">
                            Top Consumables – Centre-wise Overview
                        </h2>
                        <div className="overflow-auto print:overflow-visible">
                            {loadingCenterWiseConsumables ? (
                                <div className="p-4 text-sm text-gray-600">Loading center-wise consumables…</div>
                            ) : topConsumableHeaders.length === 0 ? (
                                <div className="p-4 text-sm text-gray-600">No consumables data available.</div>
                            ) : (
                                <table className="min-w-full border border-black text-sm align-middle print:table-fixed print:w-full print:text-[10px] print:leading-relaxed">
                                    <thead className="bg-[#DAD6C9] text-[#C72030] print:bg-[#DAD6C9] print:text-[#C72030]">
                                        <tr className="uppercase font-extrabold tracking-wide text-[13px] md:text-sm print:text-[9px]">
                                            <th scope="col" className="border border-black py-1 px-4 text-left bg-[#F6F4EE] print:py-1 print:px-2 print:w-[22%] print:whitespace-normal print:break-words print:align-top">Sites</th>
                                            {topConsumableHeaders.map((header, index) => (
                                                <th
                                                    key={index}
                                                    scope="col"
                                                    className="border border-black py-1 px-2 text-right print:py-1 print:px-1 whitespace-nowrap print:whitespace-normal print:break-words print:align-top print:text-[9px]"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {consumablesTableData.map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50 print:bg-gray-50" : "bg-white print:bg-white"}>
                                                <td className="border border-black py-1 px-4 bg-[#F6F4EE] font-semibold text-left print:py-1 print:px-2 print:bg-[#F6F4EE] print:whitespace-normal print:break-words print:align-top">
                                                    {row.inventory}
                                                </td>
                                                {row.values.map((value, j) => (
                                                    <td
                                                        key={j}
                                                        className="border border-black py-1 px-2 text-right tabular-nums print:py-1 print:px-1 print:whitespace-normal print:break-words print:align-top print:text-[9px]"
                                                    >
                                                        {Number(value).toLocaleString()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>


                        <div className="text-sm mt-4 px-4 py-2 italic text-gray-700 print:text-[11px] print:mt-0 print:px-3 print:py-2 print:text-black">
                            <strong>Note :</strong> This table highlights the top 10 consumables (highest overall usage) across each centre. Numeric values are right-aligned with tabular spacing for easier comparison. <br />
                        </div>
                    </div>

                    {/* Consumable Inventory Value – {periodUnit}ly Comparison */}
                    {/* Consumable Inventory Value – Quarterly Comparison */}
                    <div className="p-8 bg-white border border-gray-300   print-page-break print:p-3 print:border-gray-300   print:mt-2">
                        <h2 className="text-lg md:text-lg font-bold mb-4 text-gray-900 border-b pb-2 print:text-[14px] print:mb-1 print:pb-1 print:border-gray-300">
                            Consumable Inventory Value – {periodUnit}ly Comparison
                        </h2>
                        <div className="h-[500px] print:h-[300px]">
                            {loadingConsumableInventoryComparison ? (
                                <div className="p-4 text-sm text-gray-600">Loading consumable comparison…</div>
                            ) : consumableComparisonRows.length === 0 ? (
                                <div className="p-4 text-sm text-gray-600">No consumable comparison data available.</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={consumableComparisonRows}
                                        margin={{ top: 20, right: 20, left: 70, bottom: 80 }}
                                        barCategoryGap={20}
                                    >
                                        <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="site"
                                            angle={-45}
                                            textAnchor="end"
                                            interval={0}
                                            height={100}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            width={80}
                                            domain={[0, consumableMaxRaw || 0]}
                                            ticks={consumableTicks}
                                            tickFormatter={(v) => formatToK(v)}
                                        >
                                            <Label
                                                // value="Total Value of Consumption"
                                                angle={-90}
                                                position="insideLeft"
                                                className="text-sm"
                                            />
                                        </YAxis>
                                        <Tooltip
                                            formatter={(val: any) => formatToK(val)}
                                            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: "12px" }}
                                            verticalAlign="top"
                                            align="right"
                                        />
                                        <Bar
                                            dataKey="lastQuarter"
                                            fill="#D6BBAF"
                                            name={lastLabel}
                                            barSize={40}
                                            label={{ position: "top", formatter: (val: any) => formatToK(val), fill: "#444" }}
                                        />
                                        <Bar
                                            dataKey="currentQuarter"
                                            fill="#D3D6D4"
                                            name={currentLabel}
                                            barSize={40}
                                            label={{ position: "top", formatter: (val: any) => formatToK(val), fill: "#444" }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mt-6 border-t pt-4 print:text-[11px] print:mt-1 print:pt-1 print:border-gray-300">
                            <strong>Note:</strong> This graph illustrates total consumable inventory usage with a comparison to the previous period, highlighting trends in consumption.
                        </p>
                    </div>

                </div>
            </div>

            {/* Parking and vistor Management */}
            <div className="print-page break-before-page">
                <h1 className="report-title text-2xl font-bold mb-6 text-center bg-[#F6F4EE] py-3 print:text-xl print:mb-0 print:py-2">
                    Parking Management
                </h1>
                <div className={sectionBox}>
                    <div className="flex flex-col print:p-4 mb-8">
                        <h2 className="text-lg md:text-xl p-4 print:text-[14px] font-bold mb-2">Parking Allocation Overview – Paid, Free & Vacant</h2>
                        <div className="border-b border-gray-300 w-full" />
                    </div>

                    {/* Print-only mini legend for Parking section */}
                    <div className="hidden print:flex items-center justify-end gap-4 px-6 print:px-4 print:py-1 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#a0b5c1]" />
                            <span>Free</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#c5ae94]" />
                            <span>Paid</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#dad8cf]" />
                            <span>Vacant</span>
                        </div>
                    </div>

                    {/* Chart: Desktop responsive + Print/Mobile fixed */}
                    <div className="w-full">
                        {loadingParkingDateSiteWise ? (
                            <div className="text-center py-6 text-gray-600">Loading parking data…</div>
                        ) : parkingChartData.length === 0 ? (
                            <div className="text-center py-6 text-gray-600">No parking data available.</div>
                        ) : (
                            <>
                                {/* Desktop-only full graph (hidden in print) */}
                                <div className="hidden md:block print:hidden">
                                    <div
                                        style={{
                                            width: '100%',
                                            height: `${Math.max(360, Math.min(900, ((parkingChartData?.length || 1) * 48) + 160))}px`,
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={parkingChartData}
                                                layout="vertical"
                                                margin={{ top: 20, right: 70, bottom: 20 }}
                                                barCategoryGap="10%"
                                                barGap={3}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    type="number"
                                                    label={{ value: "Count of Parking Slots", position: "insideBottom", offset: -5 }}
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={220} />
                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" />
                                                <Bar dataKey="Free" fill="#a0b5c1" name="Free" barSize={28}>
                                                    <LabelList dataKey="Free" position="right" style={{ fontSize: 10 }} />
                                                </Bar>
                                                <Bar dataKey="Paid" fill="#c5ae94" name="Paid" barSize={28}>
                                                    <LabelList dataKey="Paid" position="right" style={{ fontSize: 10 }} />
                                                </Bar>
                                                <Bar dataKey="Vacant" fill="#dad8cf" name="Vacant" barSize={28}>
                                                    <LabelList dataKey="Vacant" position="right" style={{ fontSize: 10 }} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Print/PDF and mobile fixed-size chart */}
                                <div className="overflow-x-auto block print:block md:hidden">
                                    <BarChart
                                        width={800}
                                        height={Math.max(300, parkingChartData.length * 50)}
                                        data={parkingChartData}
                                        layout="vertical"
                                        margin={{ top: 20, right: 60, left: 10, bottom: 20 }}
                                        barCategoryGap="10%"
                                        barGap={3}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            type="number"
                                            label={{ value: "Count of Parking Slots", position: "insideBottom", offset: -5 }}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={200} />
                                        <Tooltip />
                                        <Bar dataKey="Free" fill="#a0b5c1" name="Free" barSize={28}>
                                            <LabelList dataKey="Free" position="right" style={{ fontSize: 10 }} />
                                        </Bar>
                                        <Bar dataKey="Paid" fill="#c5ae94" name="Paid" barSize={28}>
                                            <LabelList dataKey="Paid" position="right" style={{ fontSize: 10 }} />
                                        </Bar>
                                        <Bar dataKey="Vacant" fill="#dad8cf" name="Vacant" barSize={28}>
                                            <LabelList dataKey="Vacant" position="right" style={{ fontSize: 10 }} />
                                        </Bar>
                                    </BarChart>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom note */}
                    <p className="text-sm text-gray-500 p-4 mt-4 print:mt-4">
                        <strong>Note:</strong> This graph presents the current status of parking allocation, showing the distribution between paid, free, and vacant slots.
                    </p>
                </div>
            </div>
            <div className='print-page break-before-page'>
                {/* Visitor Management */}
                <h1 className="report-title text-2xl font-bold mb-6 text-center bg-[#F6F4EE] py-3 print:text-xl print:mb-0 print:py-2">
                    Visitor Management
                </h1>
                <div className={sectionBox}>
                    {/* Header and legend */}
                    <div className="flex p-4 flex-col print:p-4 mb-8">
                        <h2 className="text-lg md:text-lg print:text-[14px] font-bold mb-2">Visitor Trend Analysis</h2>
                        <div className="border-b border-gray-300 w-full" />
                    </div>

                    {/* Print-only mini legend for Visitor section */}
                    <div className="hidden print:flex items-center justify-end gap-4 px-6 print:px-4 print:py-1 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#dad8cf]" />
                            <span>{lastLabel}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#c5ae94]" />
                            <span>{currentLabel}</span>
                        </div>
                    </div>

                    {/* Chart: Desktop responsive + Print/Mobile fixed */}
                    <div className="w-full">
                        {loadingVisitorTrendAnalysis ? (
                            <div className="p-4 text-sm text-gray-600">Loading visitor trends…</div>
                        ) : visitorTrendRows.length === 0 ? (
                            <div className="p-4 text-sm text-gray-600">No visitor trend data available.</div>
                        ) : (
                            <>
                                {/* Desktop-only full graph (hidden in print) */}
                                <div className="hidden md:block print:hidden">
                                    <div
                                        style={{
                                            width: '100%',
                                            height: `${Math.max(360, Math.min(900, ((visitorTrendRows?.length || 1) * 48) + 160))}px`,
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={visitorTrendRows}
                                                layout="vertical"
                                                barCategoryGap="10%"
                                                barGap={3}
                                                margin={{ top: 5, right: 100, left: 0, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" label={{ value: "Counts", position: "insideBottom", offset: -5 }} fontSize={15} />
                                                <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={200} fontSize={15} />
                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" style={{ fontSize: 10 }} />
                                                <Bar dataKey="last" fill="#dad8cf" name={lastLabel} barSize={28}>
                                                    <LabelList dataKey="last" position="right" style={{ fontSize: 10 }} />
                                                </Bar>
                                                <Bar dataKey="current" fill="#c5ae94" name={currentLabel} barSize={28}>
                                                    <LabelList dataKey="current" position="right" style={{ fontSize: 10 }} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Print/PDF and mobile fixed-size chart */}
                                <div className="overflow-x-auto block print:block md:hidden">
                                    <BarChart
                                        width={800}
                                        height={visitorChartHeight}
                                        data={visitorTrendRows}
                                        layout="vertical"
                                        barCategoryGap="10%"
                                        barGap={3}
                                        margin={{ top: 5, right: 100, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" label={{ value: "Counts", position: "insideBottom", offset: -5 }} fontSize={15} />
                                        <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={180} fontSize={15} />
                                        <Tooltip />
                                        {/* Legend removed for print/mobile to avoid overlap; see print-only legend above */}
                                        <Bar dataKey="last" fill="#dad8cf" name={lastLabel} barSize={28}>
                                            <LabelList dataKey="last" position="right" style={{ fontSize: 10 }} />
                                        </Bar>
                                        <Bar dataKey="current" fill="#c5ae94" name={currentLabel} barSize={28}>
                                            <LabelList dataKey="current" position="right" style={{ fontSize: 10 }} />
                                        </Bar>
                                    </BarChart>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Note */}
                    <p className="text-sm text-gray-500 p-4 mt-4 print:mt-4">
                        <strong>Note:</strong> This graph shows the total visitor count compared to the previous period,
                        providing a clear view of trends and changes in footfall over time for performance comparison.
                    </p>
                </div>
            </div>
        </>
    );
};

export default AllContent;
