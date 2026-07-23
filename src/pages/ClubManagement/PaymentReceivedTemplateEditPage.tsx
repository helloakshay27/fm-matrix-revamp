import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';

export const PaymentReceivedTemplateEditPage: React.FC = () => (
  <DocumentTemplateEditPage
    documentType="payment_received"
    moduleLabel="Payment Received"
    defaultHeading="PAYMENT RECEIVED"
    sampleDocumentNumber="PR-00001"
    backRoute="/accounting/payments-received"
    detailsRoutePrefix="/accounting/payments-received"
  />
);

export default PaymentReceivedTemplateEditPage;
