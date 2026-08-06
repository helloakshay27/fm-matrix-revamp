import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const InvoiceTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="invoice"
    moduleLabel="Invoice"
    defaultHeading="INVOICE"
    sampleDocumentNumber="INV-00001"
    backRoute="/accounting/invoices/list"
    detailsRoutePrefix="/accounting/dashboard/invoices"
  />
);

export default InvoiceTemplateEditPage;
