import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const PaymentMadeTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="payment_made"
    moduleLabel="Payment Made"
    defaultHeading="PAYMENT MADE"
    sampleDocumentNumber="PM-00001"
    backRoute="/accounting/payments-made"
    detailsRoutePrefix="/accounting/payments-made"
  />
);

export default PaymentMadeTemplateEditPage;
