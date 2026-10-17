import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const QuotesTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="quote"
    moduleLabel="Quote"
    defaultHeading="QUOTE"
    sampleDocumentNumber="QT-00001"
    backRoute="/accounting/quotes"
    detailsRoutePrefix="/accounting/quotes/details"
  />
  );
};

export default QuotesTemplateEditPage;
