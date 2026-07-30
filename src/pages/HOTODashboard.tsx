import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HandedOverToSection } from '@/components/HandedOverToSection';
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
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
        <h1 className="text-2xl font-bold text-gray-900">HOTO - HAND OVER TAKE OVER</h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Section: Handover Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3 bg-[#E5E0D3]">
                <Handshake size={16} color="#C72030" />
              </span>
              Handover Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <HandedOverToSection
              handedOverTo={handedOverTo}
              onHandedOverToChange={setHandedOverTo}
              vendor={vendor}
              onVendorChange={setVendor}
              vendorBids={vendorBids}
              onVendorBidsChange={setVendorBids}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button type="submit" variant="ghost" className="fm-button-fix fm-button-brand px-8 py-2">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
            className="fm-button-fix border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HOTODashboard;
