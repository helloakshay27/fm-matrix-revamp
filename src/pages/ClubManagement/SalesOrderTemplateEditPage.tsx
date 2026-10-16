import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const SalesOrderTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="sales_order"
    moduleLabel="Sales Order"
    defaultHeading="SALES ORDER"
    sampleDocumentNumber="SO-00001"
    backRoute="/accounting/sales-order"
    detailsRoutePrefix="/accounting/sales-order"
  />
  );
};

export default SalesOrderTemplateEditPage;
