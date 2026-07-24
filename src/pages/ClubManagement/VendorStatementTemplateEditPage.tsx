import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const VendorStatementTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="vendor_statement"
    moduleLabel="Vendor Statement"
    defaultHeading="Vendor Statement"
    sampleDocumentNumber="VS-00001"
    backRoute="/accounting/vendor"
    detailsRoutePrefix="/accounting/vendor/view"
    pdfTabValue="statement"
  />
);

export default VendorStatementTemplateEditPage;
