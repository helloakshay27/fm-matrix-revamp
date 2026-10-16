import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const RecurringBillTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="recurring_bill"
    moduleLabel="Recurring Bill"
    defaultHeading="RECURRING BILL"
    sampleDocumentNumber="RBILL-00001"
    backRoute="/accounting/recurring-bills"
    detailsRoutePrefix="/accounting/recurring-bills/details"
  />
  );
};

export default RecurringBillTemplateEditPage;
