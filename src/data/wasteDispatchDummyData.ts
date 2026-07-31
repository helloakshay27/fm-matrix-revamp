// Placeholder dispatch records for the Waste Dispatch History / Recycle Entry
// screens. There is no backend endpoint for dispatch history or recycle
// entries yet (see WasteDispatchPage.tsx's submit stub) — this file is the
// single source of dummy data for both pages so they stay in sync, and is
// meant to be deleted once a real fetch is wired up.

export interface DispatchRecord {
  id: string;
  dispatchId: string;
  wasteItem: string;
  category: string;
  dispatchWeight: string;
  destination: string;
  vehicleNumber: string;
  dispatchedBy: string;
  dispatchDate: string;
  manifestNumber: string;
  status: string;
  site: string;
}

export const DUMMY_DISPATCH_RECORDS: DispatchRecord[] = [
  {
    id: 'DSP-1041',
    dispatchId: 'DSP-1041',
    wasteItem: 'Used Transformer Oil',
    category: 'Hazardous',
    dispatchWeight: '210 L',
    destination: 'EcoDispose Pvt Ltd',
    vehicleNumber: 'MH-04-AB-1234',
    dispatchedBy: 'Facilities Management',
    dispatchDate: '28 Jul 2026',
    manifestNumber: 'MN-88291',
    status: 'Delivered',
    site: 'Lockated Site 1',
  },
  {
    id: 'DSP-1040',
    dispatchId: 'DSP-1040',
    wasteItem: 'E-Waste – Server Racks',
    category: 'E-Waste',
    dispatchWeight: '340 kg',
    destination: 'GreenCycle Waste Management',
    vehicleNumber: 'MH-12-CD-5566',
    dispatchedBy: 'EHS Department',
    dispatchDate: '26 Jul 2026',
    manifestNumber: 'MN-88276',
    status: 'In Transit',
    site: 'Lockated Site 1',
  },
  {
    id: 'DSP-1039',
    dispatchId: 'DSP-1039',
    wasteItem: 'Cardboard & Packaging',
    category: 'Recyclable',
    dispatchWeight: '1.2 t',
    destination: 'GreenCycle Waste Management',
    vehicleNumber: 'MH-04-EF-7788',
    dispatchedBy: 'Facilities Management',
    dispatchDate: '22 Jul 2026',
    manifestNumber: 'MN-88210',
    status: 'Delivered',
    site: 'Lockated Site 1',
  },
  {
    id: 'DSP-1038',
    dispatchId: 'DSP-1038',
    wasteItem: 'Mixed Construction Debris',
    category: 'General',
    dispatchWeight: '2.4 t',
    destination: 'City Municipal Landfill',
    vehicleNumber: 'MH-14-GH-9910',
    dispatchedBy: 'Operations',
    dispatchDate: '19 Jul 2026',
    manifestNumber: 'MN-88144',
    status: 'Dispatched',
    site: 'Lockated Site 1',
  },
  {
    id: 'DSP-1037',
    dispatchId: 'DSP-1037',
    wasteItem: 'Used Lubricant Oil',
    category: 'Hazardous',
    dispatchWeight: '85 L',
    destination: 'EcoDispose Pvt Ltd',
    vehicleNumber: 'MH-04-AB-1234',
    dispatchedBy: 'Facilities Management',
    dispatchDate: '14 Jul 2026',
    manifestNumber: 'MN-88052',
    status: 'Delivered',
    site: 'Lockated Site 1',
  },
];
