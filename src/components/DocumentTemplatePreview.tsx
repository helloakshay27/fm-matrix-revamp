import React from 'react';
import { DocumentTemplateSettings } from '@/utils/documentTemplate';

interface DocumentTemplatePreviewProps {
  settings: DocumentTemplateSettings;
  defaultHeading: string; // e.g. "QUOTE", "SALES ORDER"
  sampleDocumentNumber: string; // e.g. "QT-00001", "SO-00001"
}

// Lightweight mock of the real PDF renderers (QuotesDetails.jsx's
// renderQuotePdf, AccountingDocumentPdf, PurchaseDocumentPdf, ...), used
// purely to give a live "what will this look like" preview while editing
// template settings. Only the sections template settings actually control
// (logo, address, heading, terms fallback, signature) reflect live edits —
// everything else is static sample data so this doesn't need a real record
// to render against, and works the same for every module.
export const DocumentTemplatePreview: React.FC<DocumentTemplatePreviewProps> = ({
  settings,
  defaultHeading,
  sampleDocumentNumber,
}) => (
  <div style={{ zoom: 0.62 }}>
    <div className="bg-white text-black p-8 text-[11px] leading-tight" style={{ width: '794px' }}>
      <div className="relative mx-auto mt-6" style={{ width: '700px' }}>
        <div className="border border-gray-500 bg-white">
          <div className="grid grid-cols-[1fr_210px] border-b border-gray-500">
            <div className="p-3 min-h-[96px]">
              {settings.logo && (
                <img src={settings.logo} alt="Logo" className="mb-2" style={{ maxHeight: '48px', maxWidth: '180px', objectFit: 'contain' }} />
              )}
              <h2 className="text-[17px] font-bold mb-2">{localStorage.getItem('companyName') || 'Lockated'}</h2>
              <div className="space-y-1">
                <p>{settings.organizationAddress || localStorage.getItem('companyAddress') || 'pune Maharashtra 411006'}</p>
                <p>{localStorage.getItem('companyCountry') || 'India'}</p>
                <p>{localStorage.getItem('companyEmail') || 'ajay.pihulkar@lockated.com'}</p>
                <p>GSTIN: {localStorage.getItem('gstin') || '27AGOPL6958QABC'}</p>
              </div>
            </div>
            <div className="p-3 flex flex-col items-end justify-end gap-3">
              <span className="inline-flex items-center border px-3 py-1 text-[11px] font-bold bg-gray-100">
                DRAFT
              </span>
              <h1 className="text-[32px] font-serif font-normal tracking-wide">
                {settings.templateName ? settings.templateName.toUpperCase() : defaultHeading}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-[160px_190px_1fr] border-b border-gray-500 min-h-[50px]">
            <div className="p-2 border-r border-gray-500">#</div>
            <div className="p-2 border-r border-gray-500">
              <p className="font-bold">: {sampleDocumentNumber}</p>
              <p className="font-bold">: 01/01/2026</p>
            </div>
            <div className="p-2">
              <div className="flex items-center">
                <span className="w-24">Status</span>
                <span>: </span>
                <span className="inline-flex items-center border px-2 py-0.5 text-[10px] font-bold ml-1 bg-gray-100">
                  DRAFT
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-gray-500 bg-gray-100 font-bold">
            <div className="px-2 py-1 border-r border-gray-500">Bill To</div>
            <div className="px-2 py-1">Ship To</div>
          </div>
          <div className="grid grid-cols-2 border-b border-gray-500 min-h-[30px]">
            <div className="px-2 py-2 border-r border-gray-500">
              <p className="font-bold text-blue-700">Sample Customer</p>
              <p>Pune, Maharashtra 411001</p>
            </div>
            <div className="px-2 py-2">
              <p className="font-bold text-blue-700">Sample Customer</p>
              <p>Pune, Maharashtra 411001</p>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-r border-gray-500 p-2 text-center w-[36px]">#</th>
                <th className="border-b border-r border-gray-500 p-2 text-left">Item & Description</th>
                <th className="border-b border-r border-gray-500 p-2 text-right w-[74px]">Qty</th>
                <th className="border-b border-r border-gray-500 p-2 text-right w-[90px]">Rate</th>
                <th className="border-b border-gray-500 p-2 text-right w-[100px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-r border-gray-400 p-2 text-center align-top">1</td>
                <td className="border-b border-r border-gray-400 p-2 align-top">
                  <p className="font-bold">Sample Item</p>
                </td>
                <td className="border-b border-r border-gray-400 p-2 text-right align-top">1.00</td>
                <td className="border-b border-r border-gray-400 p-2 text-right align-top">100.00</td>
                <td className="border-b border-gray-400 p-2 text-right align-top">100.00</td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-[1fr_305px] border-b border-gray-500">
            <div className="p-3 border-r border-gray-500 min-h-[70px]">
              <p className="font-bold">Total In Words</p>
              <p className="font-bold italic mt-2">Indian Rupee One Hundred Only</p>
            </div>
            <div className="p-3">
              <div className="flex justify-between border-t border-gray-500 pt-2 font-bold text-[12px]">
                <span>Total</span>
                <span>₹100.00</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_305px]">
            <div className="p-3 border-r border-gray-500 min-h-[190px]">
              <div>
                <p className="font-bold">Terms & Conditions</p>
                <p className="whitespace-pre-wrap mt-1">{settings.termsAndConditions || '—'}</p>
              </div>
            </div>
            <div className="p-3 min-h-[190px] flex flex-col justify-end">
              <div className="text-right">
                <p className="font-bold mb-2">For {localStorage.getItem('companyName') || 'Lockated'}</p>
                {settings.signature ? (
                  <img
                    src={settings.signature}
                    alt="Signature"
                    className="ml-auto mb-2"
                    style={{ maxHeight: '50px', maxWidth: '170px', objectFit: 'contain' }}
                  />
                ) : (
                  <div className="mb-12" />
                )}
                <div className="border-t border-gray-500 ml-auto w-[170px] pt-2 text-center font-bold">
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DocumentTemplatePreview;
