import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const BillTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="bill"
    moduleLabel="Bill"
    defaultHeading="BILL"
    sampleDocumentNumber="BILL-00001"
    backRoute="/accounting/bills"
    detailsRoutePrefix="/accounting/bills"
  />
);

export default BillTemplateEditPage;
