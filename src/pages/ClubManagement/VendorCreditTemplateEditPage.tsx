import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const VendorCreditTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="vendor_credit"
    moduleLabel="Vendor Credit"
    defaultHeading="VENDOR CREDIT"
    sampleDocumentNumber="VC-00001"
    backRoute="/accounting/vendor-credits"
    detailsRoutePrefix="/accounting/vendor-credits/details"
  />
  );
};

export default VendorCreditTemplateEditPage;
