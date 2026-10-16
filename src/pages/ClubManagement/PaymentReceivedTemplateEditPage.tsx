import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const PaymentReceivedTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="payment_received"
    moduleLabel="Payment Received"
    defaultHeading="PAYMENT RECEIVED"
    sampleDocumentNumber="PR-00001"
    backRoute="/accounting/payments-received"
    detailsRoutePrefix="/accounting/payments-received"
  />
  );
};

export default PaymentReceivedTemplateEditPage;
