import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HandedOverToSection } from '@/components/HandedOverToSection';

interface VendorBid {
  vendorName: string;
  biddingCost: string;
}

export const HOTODashboard: React.FC = () => {
  const [handedOverTo, setHandedOverTo] = useState<string>('vendor');
  const [vendor, setVendor] = useState<string>('');
  const [vendorBids, setVendorBids] = useState<VendorBid[]>([{ vendorName: '', biddingCost: '' }]);

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
    <div className="px-6 py-4">
      <header className="flex items-center justify-between mb-6">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex gap-2">
              <li><a href="/transitioning/snagging" className="hover:underline">Transitioning</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">HOTO</li>
            </ol>
          </nav>
          <h1 className="text-2xl font-semibold mt-2">HOTO - Hand Over Take Over</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => history.back()}>Discard</Button>
          <Button variant="default">Save</Button>
        </div>
      </header>

      <main>
        <section aria-labelledby="handover-heading" className="bg-background border rounded-md p-4">
          <h2 id="handover-heading" className="sr-only">Handover Details</h2>
          <HandedOverToSection
            handedOverTo={handedOverTo}
            onHandedOverToChange={setHandedOverTo}
            vendor={vendor}
            onVendorChange={setVendor}
            vendorBids={vendorBids}
            onVendorBidsChange={setVendorBids}
          />
        </section>
      </main>
    </div>
  );
};

export default HOTODashboard;
