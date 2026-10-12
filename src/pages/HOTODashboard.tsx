import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HandedOverToSection } from '@/components/HandedOverToSection';
import { FormSection, FormActionBar } from '@/components/common/FormSection';
import { ArrowLeft, Handshake } from 'lucide-react';

interface VendorBid {
  vendorName: string;
  biddingCost: string;
}

export const HOTODashboard: React.FC = () => {
  const navigate = useNavigate();
  const [handedOverTo, setHandedOverTo] = useState<string>('vendor');
  const [vendor, setVendor] = useState<string>('');
  const [vendorBids, setVendorBids] = useState<VendorBid[]>([{ vendorName: '', biddingCost: '' }]);

  const handleGoBack = () => navigate('/transitioning/snagging');

  useEffect(() => {
    // Basic SEO without extra deps
    const title = 'HOTO - Hand Over Take Over';
    const description = 'Manage Hand Over Take Over (HOTO) with vendor selection and bidding.';
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) {
      metaDesc.content = description;
    } else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = description;
      document.head.appendChild(m);
    }

    const canonicalHref = `${window.location.origin}/transitioning/hoto`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalHref);
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header — Add Asset page jaisa */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Transitioning</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">HOTO</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">HOTO - HAND OVER TAKE OVER</h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6">
        <FormSection title="HANDOVER DETAILS" icon={Handshake}>
          <div className="space-y-6">
            <HandedOverToSection
              handedOverTo={handedOverTo}
              onHandedOverToChange={setHandedOverTo}
              vendor={vendor}
              onVendorChange={setVendor}
              vendorBids={vendorBids}
              onVendorBidsChange={setVendorBids}
            />
          </div>
        </FormSection>

        <FormActionBar
          onCancel={handleGoBack}
          cancelLabel="Discard"
          submitLabel="Save"
          submitAsFormSubmit
        />
      </form>
    </div>
  );
};

export default HOTODashboard;
