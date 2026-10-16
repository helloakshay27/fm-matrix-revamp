import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const CreditNoteTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="credit_note"
    moduleLabel="Credit Note"
    defaultHeading="CREDIT NOTE"
    sampleDocumentNumber="CN-00001"
    backRoute="/accounting/credit-note"
    detailsRoutePrefix="/accounting/credit-note"
  />
  );
};

export default CreditNoteTemplateEditPage;
