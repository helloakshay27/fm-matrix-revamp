import React from 'react';
import { DocumentTemplateEditPage } from './DocumentTemplateEditPage';
import { useAccountingFormOpened } from '@/components/PostHogAccountingEvents';

export const PaymentMadeTemplateEditPage: React.FC = () => {
  useAccountingFormOpened('template', 'edit');
  return (
  <DocumentTemplateEditPage
    documentType="payment_made"
    moduleLabel="Payment Made"
    defaultHeading="PAYMENT MADE"
    sampleDocumentNumber="PM-00001"
    backRoute="/accounting/payments-made"
    detailsRoutePrefix="/accounting/payments-made"
  />
  );
};

export default PaymentMadeTemplateEditPage;
