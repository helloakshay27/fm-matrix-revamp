import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const VendorCreditTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="vendor_credit"
    moduleLabel="Vendor Credit"
    defaultHeading="VENDOR CREDIT"
    sampleDocumentNumber="VC-00001"
    backRoute="/accounting/vendor-credits"
    detailsRoutePrefix="/accounting/vendor-credits/details"
  />
);

export default VendorCreditTemplateEditPage;
