import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const InvoiceTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="invoice"
    moduleLabel="Invoice"
    defaultHeading="INVOICE"
    sampleDocumentNumber="INV-00001"
    backRoute="/accounting/invoices/list"
    detailsRoutePrefix="/accounting/dashboard/invoices"
  />
  );
};

export default InvoiceTemplateEditPage;
