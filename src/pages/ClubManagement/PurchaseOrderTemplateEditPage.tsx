import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const PurchaseOrderTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="purchase_order"
    moduleLabel="Purchase Order"
    defaultHeading="PURCHASE ORDER"
    sampleDocumentNumber="PO-00001"
    backRoute="/accounting/purchase-order"
    detailsRoutePrefix="/accounting/purchase-order"
    pdfTabValue="pdf-view"
  />
  );
};

export default PurchaseOrderTemplateEditPage;
