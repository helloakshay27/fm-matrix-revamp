import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const BillTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="bill"
    moduleLabel="Bill"
    defaultHeading="BILL"
    sampleDocumentNumber="BILL-00001"
    backRoute="/accounting/bills"
    detailsRoutePrefix="/accounting/bills"
  />
  );
};

export default BillTemplateEditPage;
