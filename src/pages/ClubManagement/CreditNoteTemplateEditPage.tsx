import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const CreditNoteTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="credit_note"
    moduleLabel="Credit Note"
    defaultHeading="CREDIT NOTE"
    sampleDocumentNumber="CN-00001"
    backRoute="/accounting/credit-note"
    detailsRoutePrefix="/accounting/credit-note"
  />
);

export default CreditNoteTemplateEditPage;
