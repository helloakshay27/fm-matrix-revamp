import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type AssetType = "it_assets" | "non_it_assets";
export type AllocationType = "users" | "department";
export type AmcCategoryType = "comprehensive" | "non_comprehensive";
export type AssetConfigDimension =
  | "amc"
  | "ppm"
  | "readings"
  | "depreciation"
  | "ebom"
  | "purchase";

/**
 * Business-lifecycle events for Asset Management — see the Asset Management
 * Event Catalogue (Object Verb, past tense; NOT UI clicks). Screen-level
 * usage events live separately in PostHogAssetActivity.
 *
 * asset_id is the cross-module join key and is stamped on every event.
 * platform/release_version are stamped here; company/site/actor_role come
 * from the suite-wide PostHog group/person registration.
 */
export function useAssetEvents() {
  const posthog = usePostHog();

  const capture = (event: string, assetId: string | number | null, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      asset_id: assetId,
      ...props,
    });
  };

  return {
    onAssetRegistered: (
      assetId: string | number | null,
      props: {
        asset_type: AssetType;
        group?: string | number | null;
        sub_group?: string | number | null;
        category?: string | null;
        criticality?: string | null;
        allocation_type?: AllocationType | string | null;
        amc_category_type?: AmcCategoryType | string | null;
        site?: string | number | null;
        location_depth?: number;
        has_purchase_cost: boolean;
        has_warranty: boolean;
        is_test: boolean;
        created_via: "web" | "mobile" | "import";
      }
    ) => capture("Asset Registered", assetId, props),

    onAssetClassifiedUpdated: (
      assetId: string | number | null,
      fieldChanged: string,
      oldValue: unknown,
      newValue: unknown
    ) =>
      capture("Asset Classified Updated", assetId, {
        field_changed: fieldChanged,
        old_value: oldValue ?? null,
        new_value: newValue ?? null,
      }),

    onAssetAllocated: (
      assetId: string | number | null,
      allocationType: AllocationType | string,
      allocateeId: string | number | null
    ) =>
      capture("Asset Allocated", assetId, {
        allocation_type: allocationType,
        allocatee_id: allocateeId,
      }),

    onAssetStatusChanged: (
      assetId: string | number | null,
      props: {
        from_status: string | null;
        to_status: string;
        criticality?: string | null;
        asset_type?: AssetType | null;
      }
    ) => capture("Asset Status Changed", assetId, props),

    onAssetBreakdownRecorded: (
      assetId: string | number | null,
      props: {
        criticality?: string | null;
        has_amc?: boolean;
        has_ppm?: boolean;
        site?: string | number | null;
      }
    ) => capture("Asset Breakdown Recorded", assetId, props),

    onAssetRestored: (
      assetId: string | number | null,
      props: {
        downtime_minutes?: number | null;
        criticality?: string | null;
        linked_ticket_id?: string | number | null;
      }
    ) => capture("Asset Restored", assetId, props),

    onAssetMoved: (
      assetId: string | number | null,
      fromSite: string | number | null,
      toSite: string | number | null
    ) =>
      capture("Asset Moved", assetId, {
        from_site: fromSite,
        to_site: toSite,
      }),

    onAssetMasterDataCompleted: (
      assetId: string | number | null,
      dimension: AssetConfigDimension,
      completenessAfter: number | null
    ) =>
      capture("Asset Master Data Completed", assetId, {
        dimension,
        completeness_after: completenessAfter,
      }),

    onAssetPpmLinked: (assetId: string | number | null, scheduleId: string | number | null) =>
      capture("Asset PPM Linked", assetId, { schedule_id: scheduleId }),

    onAssetAmcLinked: (
      assetId: string | number | null,
      props: { amc_id: string | number | null; amc_type?: string | null; expiry_date?: string | null }
    ) => capture("Asset AMC Linked", assetId, props),

    onAssetReadingRecorded: (
      assetId: string | number | null,
      meterType: string | null,
      readingValue: string | number | null
    ) =>
      capture("Asset Reading Recorded", assetId, {
        meter_type: meterType,
        reading_value: readingValue,
      }),

    onAssetDisposed: (
      assetId: string | number | null,
      reason: string | null,
      bookValueAtDisposal: number | string | null
    ) =>
      capture("Asset Disposed", assetId, {
        reason,
        book_value_at_disposal: bookValueAtDisposal,
      }),
  };
}
