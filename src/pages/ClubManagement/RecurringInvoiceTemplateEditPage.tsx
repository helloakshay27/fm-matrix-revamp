import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const RecurringInvoiceTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="recurring_invoice"
    moduleLabel="Recurring Invoice"
    defaultHeading="RECURRING INVOICE"
    sampleDocumentNumber="RINV-00001"
    backRoute="/accounting/recurring-invoices"
    detailsRoutePrefix="/accounting/recurring-invoices/details"
  />
);

export default RecurringInvoiceTemplateEditPage;
