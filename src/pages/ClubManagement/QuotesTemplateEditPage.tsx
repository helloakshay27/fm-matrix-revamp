import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const QuotesTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="quote"
    moduleLabel="Quote"
    defaultHeading="QUOTE"
    sampleDocumentNumber="QT-00001"
    backRoute="/accounting/quotes"
    detailsRoutePrefix="/accounting/quotes/details"
  />
);

export default QuotesTemplateEditPage;
