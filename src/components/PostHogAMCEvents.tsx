import posthog from 'posthog-js';

export const useAMCEvents = () => {
    const getBaseProperties = () => {
        return {
            company_id: localStorage.getItem('companyId') || localStorage.getItem('company_id'),
            site_id: localStorage.getItem('selectedSiteId') || localStorage.getItem('site_id'),
            user_id: localStorage.getItem('userId') || localStorage.getItem('user_id'),
            role: localStorage.getItem('role') || localStorage.getItem('userRole'),
            release_version: '1.0',
            is_test: false,
            timestamp: new Date().toISOString()
        };
    };

    const safeCapture = (eventName: string, properties: any = {}) => {
        const baseProps = getBaseProperties();
        
        // Skip tracking if essential properties are missing
        if (!baseProps.company_id || !baseProps.site_id || !baseProps.user_id) {
            console.warn(`PostHog: Skipped '${eventName}' due to missing session context.`);
            return;
        }

        // Data-quality guard
        if (properties.amc_name && properties.amc_name.match(/test|tesr|oiuytdftyj/i)) {
             console.warn(`PostHog: Skipped '${eventName}' due to test contract name.`);
             return;
        }

        posthog.capture(eventName, {
            ...baseProps,
            ...properties
        });
    };

    const onAMCCreated = (properties: {
        amc_id: string;
        coverage: string;
        amc_type: string;
        grouping: string;
        associated_count: number;
        supplier_id: string;
        cost: number;
        payment_terms: string;
        no_of_visits: number;
        frequency: string;
        start_date: string;
        end_date: string;
        first_service_date: string;
        critical_assets_covered: number;
    }) => {
        safeCapture('AMC Created', properties);
    };

    const onAMCRenewed = (properties: {
        amc_id: string;
        prior_amc_id: string;
        gap_days: number;
        cost_delta: number;
    }) => {
        safeCapture('AMC Renewed', properties);
    };

    const onAMCStatusChanged = (properties: {
        amc_id: string;
        from_status: string;
        to_status: string;
        auto_or_manual: string;
    }) => {
        safeCapture('AMC Status Changed', properties);
    };

    const onAMCExpired = (properties: {
        amc_id: string;
        was_renewed: boolean;
        days_active: number;
        supplier_id: string;
    }) => {
        safeCapture('AMC Expired', properties);
    };

    const onAMCVisitScheduled = (properties: {
        amc_id: string;
        visit_no: number;
        schedule_date: string;
        assets_covered: number;
    }) => {
        safeCapture('AMC Visit Scheduled', properties);
    };

    const onAMCVisitCompleted = (properties: {
        amc_id: string;
        visit_no: number;
        attendant_id: string;
        visit_date: string;
        on_time: boolean;
        has_attachment: boolean;
    }) => {
        safeCapture('AMC Visit Completed', properties);
    };

    const onAMCVisitMissed = (properties: {
        amc_id: string;
        visit_no: number;
        days_overdue: number;
    }) => {
        safeCapture('AMC Visit Missed', properties);
    };

    const onAMCRedFlagged = (properties: {
        amc_id: string;
        reason: string;
        supplier_id: string;
    }) => {
        safeCapture('AMC Red Flagged', properties);
    };

    const onAMCAssetLinked = (properties: {
        amc_id: string;
        asset_id: string;
        is_critical: boolean;
    }) => {
        safeCapture('AMC Asset Linked', properties);
    };

    const onAMCSLARecorded = (properties: {
        amc_id: string;
        sla_pct: number;
    }) => {
        safeCapture('AMC SLA Recorded', properties);
    };

    const onAMCDocumentAttached = (properties: {
        amc_id: string;
        doc_type: string;
    }) => {
        safeCapture('AMC Document Attached', properties);
    };

    return {
        onAMCCreated,
        onAMCRenewed,
        onAMCStatusChanged,
        onAMCExpired,
        onAMCVisitScheduled,
        onAMCVisitCompleted,
        onAMCVisitMissed,
        onAMCRedFlagged,
        onAMCAssetLinked,
        onAMCSLARecorded,
        onAMCDocumentAttached
    };
};
