// Placeholder dispatch records for the Waste Dispatch History / Recycle Entry
// screens. There is no backend endpoint for dispatch history or recycle
// entries yet (see WasteDispatchPage.tsx's submit stub) — this file is the
// single source of dummy data for both pages so they stay in sync, and is
// meant to be deleted once a real fetch is wired up.

export interface WeightEntry {
  id: string;
  date: string;
  customerName: string;
  category: string;
  subcategory: string;
  weight: string;
}

export interface RecycleDetail {
  recycledQuantity: string;
  confirmationDate: string;
  recyclingStatus: string;
  recyclingMethod: string;
  certificateNumber: string;
  confirmedBy: string;
}

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
  weightEntries: WeightEntry[];
  // Only present once a vendor has confirmed recycling — not every dispatch
  // has been recycled yet (e.g. still In Transit / Dispatched).
  recycleDetail?: RecycleDetail;
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
    weightEntries: [
      {
        id: 'DSP-1041-1',
        date: '28/07/2026',
        customerName: 'Deloitte',
        category: 'Hazardous',
        subcategory: 'Transformer Oil',
        weight: '210 L',
      },
    ],
    recycleDetail: {
      recycledQuantity: '205 L',
      confirmationDate: '30/07/2026',
      recyclingStatus: 'Fully Recycled',
      recyclingMethod: 'Material Recovery / Recycled',
      certificateNumber: 'RC-55210',
      confirmedBy: 'Ramesh Iyer',
    },
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
    weightEntries: [
      {
        id: 'DSP-1040-1',
        date: '26/07/2026',
        customerName: 'Deloitte',
        category: 'E-Waste',
        subcategory: 'Server Racks',
        weight: '340 kg',
      },
    ],
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
    weightEntries: [
      {
        id: 'DSP-1039-1',
        date: '22/07/2026',
        customerName: 'Deloitte',
        category: 'Recyclable',
        subcategory: 'Cardboard',
        weight: '0.8 t',
      },
      {
        id: 'DSP-1039-2',
        date: '22/07/2026',
        customerName: 'Deloitte',
        category: 'Recyclable',
        subcategory: 'Plastic Packaging',
        weight: '0.4 t',
      },
    ],
    recycleDetail: {
      recycledQuantity: '1.1 t',
      confirmationDate: '24/07/2026',
      recyclingStatus: 'Fully Recycled',
      recyclingMethod: 'Material Recovery / Recycled',
      certificateNumber: 'RC-55198',
      confirmedBy: 'Priya Nair',
    },
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
    weightEntries: [
      {
        id: 'DSP-1038-1',
        date: '12/09/23',
        customerName: 'Deloitte',
        category: 'General',
        subcategory: 'Food Waste',
        weight: '12.5 kg',
      },
      {
        id: 'DSP-1038-2',
        date: '12/09/23',
        customerName: 'Deloitte',
        category: 'Recyclable',
        subcategory: 'Plastic',
        weight: '8.2 kg',
      },
    ],
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
    weightEntries: [
      {
        id: 'DSP-1037-1',
        date: '14/07/2026',
        customerName: 'Deloitte',
        category: 'Hazardous',
        subcategory: 'Lubricant Oil',
        weight: '85 L',
      },
    ],
    recycleDetail: {
      recycledQuantity: '80 L',
      confirmationDate: '16/07/2026',
      recyclingStatus: 'Partially Recycled',
      recyclingMethod: 'Energy Recovery',
      certificateNumber: 'RC-55070',
      confirmedBy: 'Ramesh Iyer',
    },
  },
];
