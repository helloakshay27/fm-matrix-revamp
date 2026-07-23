import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';

const APP_RELEASE_VERSION = "1.0.0"; // Adjust based on your build variables

export const useUtilityEvents = () => {
  const posthog = usePostHog();

  const trackEvent = useCallback((eventName: string, properties: Record<string, any>) => {
    if (posthog) {
      posthog.capture(eventName, {
        platform: 'web',
        release_version: APP_RELEASE_VERSION,
        is_test: false, // Ensure this isn't polluting live metrics
        ...properties,
      });
    }
  }, [posthog]);

  // F2: Reading Correction
  const onDailyReadingsListViewed = useCallback((props: { row_count: number; filter_used: string }) => {
    trackEvent('Daily Readings List Viewed', props);
  }, [trackEvent]);

  const onMeterReadingEditOpened = useCallback((props: { reading_id: string; asset_id: string }) => {
    trackEvent('Meter Reading Edit Opened', props);
  }, [trackEvent]);

  const onMeterReadingUpdated = useCallback((props: { 
    fields_changed: string[]; 
    consumption_overridden: boolean; 
    old_consumption_sign: 'positive' | 'negative' | 'zero'; 
    new_consumption_sign: 'positive' | 'negative' | 'zero';
  }) => {
    trackEvent('Meter Reading Updated', props);
  }, [trackEvent]);

  // F3: Bulk Import
  const onReadingsImportOpened = useCallback(() => {
    trackEvent('Readings Import Opened', {});
  }, [trackEvent]);

  const onReadingsImportSubmitted = useCallback((props: { row_count: number; error_count: number }) => {
    trackEvent('Readings Import Submitted', props);
  }, [trackEvent]);

  // F4: Bill Generation
  const onUtilityBillWizardOpened = useCallback(() => {
    trackEvent('Utility Bill Wizard Opened', {});
  }, [trackEvent]);

  const onUtilityBillScopeSelected = useCallback((props: { 
    utility_type: string; 
    has_kiosk: boolean; 
    tower_set: string; 
    wing_set: string; 
    total_consumption: number 
  }) => {
    trackEvent('Utility Bill Scope Selected', props);
  }, [trackEvent]);

  const onUtilityBillAdjustmentGenerated = useCallback((props: { 
    adjustment_factor: number; 
    transmission_loss: number; 
    consumption_loss: number; 
    total_loss: number 
  }) => {
    trackEvent('Utility Bill Adjustment Generated', props);
  }, [trackEvent]);

  const onUtilityBillSubmitted = useCallback((props: { 
    rate_per_kwh: number; 
    amount: number; 
    client_id: string; 
    meter_id: string 
  }) => {
    trackEvent('Utility Bill Submitted', props);
  }, [trackEvent]);

  // F5: Manual Compile
  const onCustomerConsumptionFormOpened = useCallback(() => {
    trackEvent('Customer Consumption Form Opened', {});
  }, [trackEvent]);

  const onCustomerConsumptionSubmitted = useCallback((props: { 
    entity_id: string; 
    period_days: number; 
    total_consumption: number; 
    rate: number; 
    amount: number; 
    reading_type: string 
  }) => {
    trackEvent('Customer Consumption Submitted', props);
  }, [trackEvent]);

  // F6: Analytics & Feed Consumption
  const onUtilityAnalyticsViewed = useCallback((props: { 
    module: string; 
    date_range_days: number; 
    kwh_total_shown: number 
  }) => {
    trackEvent('Utility Analytics Viewed', props);
  }, [trackEvent]);

  const onUtilityAnalyticsConfigured = useCallback((props: { charts_enabled: string[] }) => {
    trackEvent('Utility Analytics Configured', props);
  }, [trackEvent]);

  const onUtilityAnalyticsChartExported = useCallback((props: { chart_name: string }) => {
    trackEvent('Utility Analytics Chart Exported', props);
  }, [trackEvent]);

  const onEVConsumptionListViewed = useCallback((props: { row_count: number }) => {
    trackEvent('EV Consumption List Viewed', props);
  }, [trackEvent]);

  const onSolarGeneratorListViewed = useCallback((props: { row_count: number }) => {
    trackEvent('Solar Generator List Viewed', props);
  }, [trackEvent]);

  // Dashboard View Events
  const onUtilityWasteGenerationDashboardViewed = useCallback(() => {
    trackEvent('Utility Waste Generation Dashboard Viewed', {});
  }, [trackEvent]);

  const onUtilitySTPDashboardViewed = useCallback(() => {
    trackEvent('Utility STP Dashboard Viewed', {});
  }, [trackEvent]);

  const onUtilityEVDashboardViewed = useCallback(() => {
    trackEvent('Utility EV Dashboard Viewed', {});
  }, [trackEvent]);

  const onUtilityDGDashboardViewed = useCallback(() => {
    trackEvent('Utility DG Dashboard Viewed', {});
  }, [trackEvent]);

  const onUtilityDashboardAddAssetStarted = useCallback(() => {
    trackEvent('Utility Dashboard Add Asset Started', {});
  }, [trackEvent]);

  return {
    onDailyReadingsListViewed,
    onMeterReadingEditOpened,
    onMeterReadingUpdated,
    onReadingsImportOpened,
    onReadingsImportSubmitted,
    onUtilityBillWizardOpened,
    onUtilityBillScopeSelected,
    onUtilityBillAdjustmentGenerated,
    onUtilityBillSubmitted,
    onCustomerConsumptionFormOpened,
    onCustomerConsumptionSubmitted,
    onUtilityAnalyticsViewed,
    onUtilityAnalyticsConfigured,
    onUtilityAnalyticsChartExported,
    onEVConsumptionListViewed,
    onSolarGeneratorListViewed,
    onUtilityWasteGenerationDashboardViewed,
    onUtilitySTPDashboardViewed,
    onUtilityEVDashboardViewed,
    onUtilityDGDashboardViewed,
    onUtilityDashboardAddAssetStarted
  };
};
