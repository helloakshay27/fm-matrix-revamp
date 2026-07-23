import { usePostHog } from 'posthog-js/react';

// Common base properties for all Permit events
const getBaseProperties = () => {
  const companyId = localStorage.getItem('companyId') || 'unknown';
  const siteId = localStorage.getItem('siteId') || 'unknown';
  const userId = localStorage.getItem('userId') || 'unknown';
  const role = localStorage.getItem('role') || 'unknown';

  return {
    platform: 'web',
    company_id: companyId,
    site_id: siteId,
    user_id: userId,
    role: role,
    release_version: '1.0',
    is_test: false,
    timestamp: new Date().toISOString(),
  };
};

export const usePermitEvents = () => {
  const posthog = usePostHog();

  const capture = (eventName: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.capture(eventName, {
        ...getBaseProperties(),
        ...properties,
      });
    }
  };

  return {
    // F1 · Permit Creation
    onPermitCreateFormOpened: (props: { entry_source: string }) => {
      capture('Permit Create Form Opened', props);
    },
    onPermitCreateStepCompleted: (props: { step_key: string; step_index: number }) => {
      capture('Permit Create Step Completed', props);
    },
    onPermitActivityBlockAdded: (props: { block_index: number }) => {
      capture('Permit Activity Block Added', props);
    },
    onPermitDraftSaved: (props: { activity_block_count: number; permit_type: string; time_on_form_sec: number }) => {
      capture('Permit Draft Saved', props);
    },
    onPermitRequestRaised: (props: { permit_type: string; activity_block_count: number; location_depth: number; has_attachments: boolean; time_on_form_sec: number }) => {
      capture('Permit Request Raised', props);
    },
    onPermitCreateFormAbandoned: (props: { last_field_focused: string; activity_block_count: number; time_on_form_sec: number }) => {
      capture('Permit Create Form Abandoned', props);
    },
    onPermitFormValidationFailed: (props: { failed_fields: string[] }) => {
      capture('Permit Form Validation Failed', props);
    },

    // F2 · Approval Decision
    onApprovalQueueViewed: (props: { pending_count: number; type_mix: string[] }) => {
      capture('Approval Queue Viewed', props);
    },
    onApprovalItemOpened: (props: { approval_type: string; level_id: string }) => {
      capture('Approval Item Opened', props);
    },

    // F3 · Extension Request
    onPermitExtensionRequested: (props: { reason_length: number; has_attachment: boolean }) => {
      capture('Permit Extension Requested', props);
    },

    // F4 · Closure
    onPermitClosureSubmitted: (props: { comment_length: number; has_attachment: boolean }) => {
      capture('Permit Closure Submitted', props);
    },

    // F5 · Findability
    onPermitListViewed: (props: { status_mix: string[]; result_count: number }) => {
      capture('Permit List Viewed', props);
    },
    onPermitStatusTileClicked: (props: { status: string }) => {
      capture('Permit Status Tile Clicked', props);
    },
    onPermitSearchPerformed: (props: { query_length: number; returned_zero: boolean }) => {
      capture('Permit Search Performed', props);
    },
    onPermitDetailOpened: (props: { permit_status: string; open_source: string }) => {
      capture('Permit Detail Opened', props);
    },

    // F6 · Checklist Template Setup
    onChecklistCreateOpened: () => {
      capture('Checklist Create Opened');
    },
    onChecklistSaved: (props: { question_count: number; category: string }) => {
      capture('Checklist Saved', props);
    },

    // F7 · Field Consumption
    onPermitFormPrinted: () => {
      capture('Permit Form Printed');
    },
    onJSAPrinted: () => {
      capture('JSA Printed');
    },
    onQRDownloaded: () => {
      capture('QR Downloaded');
    },
    onPermitListExported: (props: { row_count: number; after_filter: boolean }) => {
      capture('Permit List Exported', props);
    },
  };
};
