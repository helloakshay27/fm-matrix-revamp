import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const RecurringInvoiceTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="recurring_invoice"
    moduleLabel="Recurring Invoice"
    defaultHeading="RECURRING INVOICE"
    sampleDocumentNumber="RINV-00001"
    backRoute="/accounting/recurring-invoices"
    detailsRoutePrefix="/accounting/recurring-invoices/details"
  />
  );
};

export default RecurringInvoiceTemplateEditPage;
