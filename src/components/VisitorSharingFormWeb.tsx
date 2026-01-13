import React, { useState } from "react";

type Visitor = {
  id: number;
  contact?: string;
  name?: string;
  email?: string;
  vehicle?: "car" | "bike" | null;
  vehicleNumber?: string;
};

const VisitorSharingFormWeb: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [ndaAgree, setNdaAgree] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Step 1 fields (primary visitor)
  const [contact, setContact] = useState("9876543210");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [expectedDate, setExpectedDate] = useState("15/01/2026");
  const [expectedTime, setExpectedTime] = useState("10:00 AM");
  const [purpose, setPurpose] = useState("Meeting");
  const [company, setCompany] = useState("Acme Corp");
  const [location, setLocation] = useState("Head Office");
  const [personToMeet, setPersonToMeet] = useState<"myself" | "other">("myself");

  // Step 2 state
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [toLocation, setToLocation] = useState("");
  const [primaryVehicle, setPrimaryVehicle] = useState<"car" | "bike" | null>(null);
  const [primaryVehicleNumber, setPrimaryVehicleNumber] = useState("");

  // Step 3 state
  type Asset = {
    id: number;
    category?: string;
    name?: string;
    serial?: string;
    notes?: string;
  attachments?: { name: string; url: string }[];
  };
  const [carryingAsset, setCarryingAsset] = useState<boolean>(false);
  const [assetsByVisitor, setAssetsByVisitor] = useState<Record<number, Asset[]>>({});
  const [expandedVisitors, setExpandedVisitors] = useState<Record<number, boolean>>({ 0: true });

  // Delete primary visitor: clear primary fields and assets
  const removePrimaryVisitor = () => {
    setContact("");
    setName("");
    setEmail("");
    setExpectedDate("");
    setExpectedTime("");
    setPurpose("");
    setCompany("");
    setLocation("");
    setPersonToMeet("myself");
    setToLocation("");
    setPrimaryVehicle(null);
    setPrimaryVehicleNumber("");
    setAssetsByVisitor((s) => ({ ...s, 0: [] }));
    setExpandedVisitors((e) => ({ ...e, 0: false }));
  };

  const addVisitor = () => {
    const nextId = visitors.length ? visitors[visitors.length - 1].id + 1 : 1;
    setVisitors((v) => [...v, { id: nextId, contact: "", name: "", email: "", vehicle: null, vehicleNumber: "" }]);
  };

  const removeVisitor = (id: number) => setVisitors((v) => v.filter((x) => x.id !== id));

  const updateVisitor = (id: number, patch: Partial<Visitor>) =>
    setVisitors((v) => v.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-4 pb-4 px-3">
      <div className="w-full max-w-xs sm:max-w-sm pb-28">
        {/* Header */}
        <div className="bg-gray-100 rounded p-3 mb-3">
          <h2 className="text-lg font-semibold">
            {step === 1
              ? "1. Visitor Registration"
              : step === 2
              ? "2. Additional & Logistics Details"
              : step === 3
              ? "3. Asset Declaration"
              : step === 4
              ? "4. Identity Verification"
              : step === 5
              ? "5. Non Discloser Agreement (NDA)"
              : "Preview"}
          </h2>
          <div className="text-sm text-gray-600 mt-1">{step} of 6 steps</div>
          <div className="mt-3">
            <div className="grid grid-cols-6 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${
                    i === step ? 'bg-[#C72030]' : i < step ? 'bg-[#d9d0bf]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded p-2 shadow-sm">
           
            <div className="mt-2 border-2 border-dashed border-red-300 rounded p-3">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7a2 2 0 0 1 2-2h2l1-2h6l1 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Profile Photo <span className="text-[#C72030]">*</span></div>
                  <div className="mt-2">
                    <button disabled className="bg-[#C72030]/60 text-white px-4 py-2 rounded shadow cursor-not-allowed">Upload Photo</button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">This photo will appear on your gate pass</div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm px-2 bg-[#D9D9D940] p-2">
               {/* Pre-filled banner */}
            <div className="mb-3 px-1">
              <div className="flex items-center gap-2 rounded border border-gray-200 bg-[#e7dfd6] px-3 py-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C72030]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-gray-800">Basic details pre-filled by host</span>
              </div>
            </div>
              <div>
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2v2M16.24 3.76l-1.42 1.42M20 12h-2M19.07 19.07l-1.42-1.42M12 20v-2M7.76 20.24l1.42-1.42M4 12h2M4.93 4.93l1.42 1.42" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Guest Type
                </div>
                <div className="mt-2 flex gap-2">
                  <button disabled className="flex-1 bg-white border border-gray-200 py-2 rounded opacity-60 cursor-not-allowed">Once</button>
                  <button disabled className="flex-1 bg-white border border-gray-200 py-2 rounded opacity-60 cursor-not-allowed">Frequent</button>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600">Contact Number <span className="text-[#C72030]">*</span></div>
                <input value={contact} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="Enter number" />
              </div>

              <div>
                <div className="text-xs text-gray-600">Name <span className="text-[#C72030]">*</span></div>
                <input value={name} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="Enter full name" />
              </div>

              <div>
                <div className="text-xs text-gray-600">Mail</div>
                <input value={email} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="Enter mail id" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-600">Expected Date <span className="text-[#C72030]">*</span></div>
                  <input value={expectedDate} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="dd/mm/yyyy" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">Expected Time <span className="text-[#C72030]">*</span></div>
                  <input value={expectedTime} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="07:00 AM" />
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600">Purpose</div>
                <input value={purpose} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="Meeting" />
              </div>

              <div>
                <div className="text-xs text-gray-600">Company Name</div>
                <input value={company} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="Enter company name" />
              </div>

              <div>
                <div className="text-xs text-gray-600">Location</div>
                <input value={location} readOnly disabled className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm cursor-not-allowed" placeholder="Enter location" />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-600">Person to meet</div>
                <div className="flex items-center gap-2 ml-auto text-sm text-gray-700">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={personToMeet === 'myself'} disabled className="form-radio cursor-not-allowed" />
                    <span>Myself</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={personToMeet === 'other'} disabled className="form-radio cursor-not-allowed" />
                    <span>Other</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Non Discloser Agreement (NDA) */}
  {step === 5 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="p-3">
              <div className="bg-white border border-gray-100 rounded p-4 text-sm leading-6 text-gray-800">
                <p>By entering the premises, you (“Visitor”) acknowledge and agree to the following:</p>
                <p className="mt-2">During your visit, you may have access to or may observe confidential information, including but not limited to business operations, processes, documents, systems, client information, designs, discussions, or any proprietary material related to [Company Name].</p>
                <p className="mt-2">You agree that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>All such information is confidential and is the property of [Company Name].</li>
                  <li>You will not disclose, record, photograph, copy, or share any confidential information with any third party.</li>
                  <li>Confidential information must be used only for the purpose of your visit.</li>
                  <li>This obligation continues even after your visit ends.</li>
                </ul>
                <p className="mt-3">Any breach of this agreement may result in legal action as per applicable laws and company policies.</p>
                <p className="mt-3">By proceeding, you confirm that you have read, understood, and agreed to this Non-Disclosure Agreement.</p>
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <span className={`w-5 h-5 inline-flex items-center justify-center rounded border ${ndaAgree ? 'bg-[#C72030] border-[#C72030]' : 'border-gray-300 bg-white'}`}>
                  {ndaAgree && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input type="checkbox" checked={ndaAgree} onChange={(e) => setNdaAgree(e.target.checked)} className="hidden" />
                I have read and agree to terms & conditions.
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Preview */}
        {step === 6 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="p-3 space-y-4">

              {/* Profile Photo placeholder */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Profile Photo</div>
                  <div className="w-4 h-4 border border-gray-300 rounded" />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-20 h-20 rounded bg-gray-200" />
                  <div className="text-xs text-gray-400">This photo will appear on your gate pass</div>
                </div>
              </div>

              {/* Visitor Details */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Visitor Details</div>
                  <div className="w-4 h-4 border border-gray-300 rounded" />
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="text-gray-900 font-medium">{name || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Mobile:</span><span className="text-gray-900 font-medium">{contact || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="text-gray-900 font-medium">{email || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Expected Date & Time:</span><span className="text-gray-900 font-medium">{expectedDate && expectedTime ? `${expectedDate}, ${expectedTime}` : 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Purpose of Visit:</span><span className="text-gray-900 font-medium">{purpose || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Company:</span><span className="text-gray-900 font-medium">{company || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">To Location:</span><span className="text-gray-900 font-medium">{toLocation || location || 'N/A'}</span></div>
                </div>

                {/* Additional visitors summary */}
                <div className="mt-3 border-t border-gray-100 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">Additional Visitors:</div>
                    <div className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">{visitors.length}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700">
                    {visitors.length === 0 ? (
                      <div>None</div>
                    ) : (
                      <ul className="space-y-1">
                        {visitors.map((v) => (
                          <li key={v.id}>• Visitor {v.id} - {v.name || 'N/A'}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Logistics Details */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Logistics Details</div>
                  <div className="w-4 h-4 border border-gray-300 rounded" />
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">To Location:</span><span className="text-gray-900 font-medium">{toLocation || location || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Vehicle:</span><span className="text-gray-900 font-medium">{primaryVehicle ? (primaryVehicle === 'car' ? 'Car' : 'Bike') : 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Vehicle No.:</span><span className="text-gray-900 font-medium">{primaryVehicleNumber || 'N/A'}</span></div>
                </div>
              </div>

              {/* Assets Details (Primary only simple summary) */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Assets Details</div>
                  <div className="w-4 h-4 border border-gray-300 rounded" />
                </div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Primary Visitor:</span><span className="text-gray-900 font-medium">{name || 'Primary Visitor'}</span></div>
                  {(() => {
                    const list = assetsByVisitor[0] || [];
                    if (!carryingAsset || list.length === 0) return (<div className="text-gray-500">No assets declared</div>);
                    const first = list[0];
                    return (
                      <>
                        <div className="flex justify-between"><span className="text-gray-500">Asset Category:</span><span className="text-gray-900 font-medium">{first.category || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Asset Name:</span><span className="text-gray-900 font-medium">{first.name || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Serial No.:</span><span className="text-gray-900 font-medium">{first.serial || 'N/A'}</span></div>
                        {first.notes && (<div className="text-[11px] text-gray-700">{first.notes}</div>)}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Identity Verification summary */}
              <div className="bg-white border border-gray-100 rounded p-3">
                <div className="text-sm font-medium">Identity Verification</div>
                <div className="mt-2 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Aadhaar No.:</span><span className="text-gray-900 font-medium">N/A</span></div>
                  <div className="text-gray-500">Attachment:</div>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div className="h-20 bg-gray-200 rounded" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button onClick={() => setShowSuccess(true)} className="w-full bg-[#C72030] text-white py-3 rounded font-semibold">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-50 w-80 max-w-xs bg-white rounded-lg shadow-lg p-5">
              <button
                aria-label="Close"
                onClick={() => setShowSuccess(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#4ade80] flex items-center justify-center mb-3 relative">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-lg font-semibold">Registration Successful!</div>
                <div className="mt-2 text-sm text-gray-600">Visitor registration has been submitted & sent to host successfully.</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.32791 9.86957C7.99804 9.42344 8.50681 8.77349 8.77898 8.01585C9.05115 7.25821 9.07227 6.43309 8.83923 5.66251C8.60619 4.89193 8.13135 4.2168 7.48493 3.73696C6.83851 3.25712 6.05483 2.99805 5.24979 2.99805C4.44474 2.99805 3.66106 3.25712 3.01464 3.73696C2.36823 4.2168 1.89339 4.89193 1.66034 5.66251C1.4273 6.43309 1.44843 7.25821 1.7206 8.01585C1.99277 8.77349 2.50154 9.42344 3.17166 9.86957C1.95947 10.3163 0.924228 11.1431 0.220412 12.2264C0.183422 12.2814 0.157728 12.3432 0.144825 12.4082C0.131922 12.4732 0.132066 12.5401 0.14525 12.605C0.158434 12.67 0.184394 12.7316 0.221621 12.7865C0.258848 12.8413 0.3066 12.8882 0.362101 12.9244C0.417602 12.9606 0.479745 12.9854 0.544917 12.9973C0.610089 13.0093 0.676991 13.0082 0.741734 12.9941C0.806477 12.98 0.867769 12.9531 0.922048 12.9151C0.976327 12.8771 1.02251 12.8287 1.05791 12.7727C1.51191 12.0744 2.13313 11.5006 2.86519 11.1034C3.59724 10.7062 4.41691 10.4982 5.24979 10.4982C6.08266 10.4982 6.90234 10.7062 7.63439 11.1034C8.36644 11.5006 8.98767 12.0744 9.44166 12.7727C9.515 12.8817 9.62828 12.9574 9.75702 12.9836C9.88577 13.0097 10.0196 12.9841 10.1297 12.9124C10.2397 12.8406 10.3171 12.7284 10.345 12.6001C10.373 12.4717 10.3493 12.3375 10.2792 12.2264C9.57535 11.1431 8.5401 10.3163 7.32791 9.86957ZM2.49979 6.74957C2.49979 6.20567 2.66107 5.67399 2.96325 5.22175C3.26542 4.76952 3.69491 4.41704 4.19741 4.2089C4.6999 4.00076 5.25284 3.9463 5.78629 4.05241C6.31973 4.15852 6.80974 4.42043 7.19433 4.80502C7.57893 5.18962 7.84084 5.67962 7.94695 6.21307C8.05306 6.74652 7.9986 7.29945 7.79046 7.80195C7.58231 8.30444 7.22984 8.73394 6.77761 9.03611C6.32537 9.33828 5.79369 9.49957 5.24979 9.49957C4.5207 9.49874 3.8217 9.20874 3.30616 8.6932C2.79061 8.17765 2.50061 7.47866 2.49979 6.74957ZM15.6335 12.9183C15.5225 12.9907 15.3872 13.0161 15.2574 12.9888C15.1277 12.9615 15.0141 12.8837 14.9417 12.7727C14.4882 12.074 13.8671 11.5 13.1349 11.1029C12.4027 10.7059 11.5827 10.4985 10.7498 10.4996C10.6172 10.4996 10.49 10.4469 10.3962 10.3531C10.3025 10.2594 10.2498 10.1322 10.2498 9.99957C10.2498 9.86696 10.3025 9.73978 10.3962 9.64601C10.49 9.55225 10.6172 9.49957 10.7498 9.49957C11.1548 9.49919 11.5547 9.40936 11.9209 9.23651C12.2872 9.06367 12.6107 8.81206 12.8684 8.49968C13.1262 8.18729 13.3117 7.82184 13.4118 7.42943C13.512 7.03702 13.5242 6.62734 13.4476 6.22966C13.371 5.83198 13.2076 5.45613 12.9689 5.12894C12.7303 4.80176 12.4223 4.53132 12.067 4.33696C11.7117 4.1426 11.3178 4.02912 10.9136 4.00461C10.5094 3.9801 10.1047 4.04518 9.72854 4.19519C9.6672 4.22171 9.60118 4.23566 9.53436 4.23622C9.46754 4.23679 9.40129 4.22395 9.33952 4.19848C9.27775 4.17301 9.22171 4.13541 9.17471 4.08791C9.12771 4.04041 9.09071 3.98398 9.0659 3.92194C9.04108 3.8599 9.02895 3.79351 9.03023 3.72671C9.0315 3.6599 9.04615 3.59402 9.07332 3.53298C9.10048 3.47193 9.13961 3.41694 9.18838 3.37127C9.23715 3.3256 9.29459 3.29017 9.35729 3.26707C10.2182 2.92373 11.1758 2.91137 12.0452 3.23239C12.9147 3.5534 13.6345 4.18504 14.0658 5.00545C14.497 5.82587 14.6092 6.77692 14.3806 7.67514C14.152 8.57336 13.5989 9.35511 12.8279 9.86957C14.0401 10.3163 15.0753 11.1431 15.7792 12.2264C15.8516 12.3375 15.8769 12.4728 15.8496 12.6025C15.8223 12.7323 15.7446 12.8459 15.6335 12.9183Z" fill="black"/>
                </svg>
                Additional Visitors
              </div>
              <button onClick={addVisitor} className="text-sm px-3 py-2 border border-[#C72030] text-black rounded">Add Visitor</button>
            </div>

            <div className="p-3">
              {visitors.length === 0 && (
                <div className="text-sm text-gray-500">No additional visitors added.</div>
              )}

              {visitors.map((visitor) => (
                <div key={visitor.id} className="border border-gray-100 rounded mb-3">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">{visitor.id}</div>
                      <div className="text-sm font-medium">{visitor.name || `Visitor ${visitor.id}`}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeVisitor(visitor.id)} className="text-gray-400 hover:text-gray-700">
                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.3125 9.625C1.3125 10.3495 1.90006 10.9375 2.625 10.9375H7C7.7245 10.9375 8.3125 10.3495 8.3125 9.625L9.1875 2.625H0.4375L1.3125 9.625ZM6.125 3.9375H7V9.625H6.125V3.9375ZM4.375 3.9375H5.25V9.625H4.375V3.9375ZM2.625 3.9375H3.5V9.625H2.625V3.9375ZM8.96875 0.875H6.125C6.125 0.875 5.929 0 5.6875 0H3.9375C3.69556 0 3.5 0.875 3.5 0.875H0.65625C0.293563 0.875 0 1.16856 0 1.53125C0 1.89394 0 2.1875 0 2.1875H9.625C9.625 2.1875 9.625 1.89394 9.625 1.53125C9.625 1.16856 9.331 0.875 8.96875 0.875Z" fill="black"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-xs text-gray-600">Contact Number <span className="text-[#C72030]">*</span></div>
                      <input value={visitor.contact} onChange={(e) => updateVisitor(visitor.id, { contact: e.target.value })} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter number" />
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Name</div>
                      <input value={visitor.name} onChange={(e) => updateVisitor(visitor.id, { name: e.target.value })} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter full name" />
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Mail</div>
                      <input value={visitor.email} onChange={(e) => updateVisitor(visitor.id, { email: e.target.value })} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter mail id" />
                    </div>

                    <div>
                      <div className="text-xs text-gray-600 mb-2">Vehicle Details</div>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => updateVisitor(visitor.id, { vehicle: 'car' })} className={`py-3 rounded border ${visitor.vehicle === 'car' ? 'bg-[#d8d3c6] border-[#d8d3c6]' : 'bg-white border border-gray-200'}`}>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 17H21C21.6 17 22 16.6 22 16V13C22 12.1 21.3 11.3 20.5 11.1C18.7 10.6 16 10 16 10C16 10 14.7 8.6 13.8 7.7C13.3 7.3 12.7 7 12 7H5C4.4 7 3.9 7.4 3.6 7.9L2.2 10.8C2.06758 11.1862 2 11.5917 2 12V16C2 16.6 2.4 17 3 17H5" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 19C8.10457 19 9 18.1046 9 17C9 15.8954 8.10457 15 7 15C5.89543 15 5 15.8954 5 17C5 18.1046 5.89543 19 7 19Z" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8.99951 17H14.9995" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16.9995 19C18.1041 19 18.9995 18.1046 18.9995 17C18.9995 15.8954 18.1041 15 16.9995 15C15.8949 15 14.9995 15.8954 14.9995 17C14.9995 18.1046 15.8949 19 16.9995 19Z" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Car
                          </div>
                        </button>
                        <button type="button" onClick={() => updateVisitor(visitor.id, { vehicle: 'bike' })} className={`py-3 rounded border ${visitor.vehicle === 'bike' ? 'bg-[#d8d3c6] border-[#d8d3c6]' : 'bg-white border border-gray-200'}`}>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.4995 21C20.4325 21 21.9995 19.433 21.9995 17.5C21.9995 15.567 20.4325 14 18.4995 14C16.5665 14 14.9995 15.567 14.9995 17.5C14.9995 19.433 16.5665 21 18.4995 21Z" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5.5 21C7.433 21 9 19.433 9 17.5C9 15.567 7.433 14 5.5 14C3.567 14 2 15.567 2 17.5C2 19.433 3.567 21 5.5 21Z" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14.9995 6C15.5518 6 15.9995 5.55228 15.9995 5C15.9995 4.44772 15.5518 4 14.9995 4C14.4472 4 13.9995 4.44772 13.9995 5C13.9995 5.55228 14.4472 6 14.9995 6Z" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M11.9995 17.5V14L8.99951 11L12.9995 8L14.9995 11H16.9995" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Bike
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Vehicle Number</div>
                      <input value={visitor.vehicleNumber} onChange={(e) => updateVisitor(visitor.id, { vehicleNumber: e.target.value })} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter Vehicle Registration No." />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary visitor block */}
            <div className="mt-2 border-t border-gray-100 p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">V</div>
                <div className="text-sm font-medium">{name || 'Primary Visitor'} <span className="text-gray-400 text-xs">(Primary Visitor)</span></div>
              </div>

              <div>
                <div className="text-xs text-gray-600">To Location</div>
                <input value={toLocation || location} onChange={(e) => setToLocation(e.target.value)} placeholder="Enter location" className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" />
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-2">Vehicle Details <span className="text-xs text-gray-400">(Primary Visitor)</span></div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setPrimaryVehicle('car')} className={`py-3 rounded border ${primaryVehicle === 'car' ? 'bg-[#d8d3c6] border-[#d8d3c6]' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 17H21C21.6 17 22 16.6 22 16V13C22 12.1 21.3 11.3 20.5 11.1C18.7 10.6 16 10 16 10C16 10 14.7 8.6 13.8 7.7C13.3 7.3 12.7 7 12 7H5C4.4 7 3.9 7.4 3.6 7.9L2.2 10.8C2.06758 11.1862 2 11.5917 2 12V16C2 16.6 2.4 17 3 17H5" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 19C8.10457 19 9 18.1046 9 17C9 15.8954 8.10457 15 7 15C5.89543 15 5 15.8954 5 17C5 18.1046 5.89543 19 7 19Z" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.99951 17H14.9995" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.9995 19C18.1041 19 18.9995 18.1046 18.9995 17C18.9995 15.8954 18.1041 15 16.9995 15C15.8949 15 14.9995 15.8954 14.9995 17C14.9995 18.1046 15.8949 19 16.9995 19Z" stroke="#1B1B1B" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Car
                    </div>
                  </button>
                  <button type="button" onClick={() => setPrimaryVehicle('bike')} className={`py-3 rounded border ${primaryVehicle === 'bike' ? 'bg-[#d8d3c6] border-[#d8d3c6]' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.4995 21C20.4325 21 21.9995 19.433 21.9995 17.5C21.9995 15.567 20.4325 14 18.4995 14C16.5665 14 14.9995 15.567 14.9995 17.5C14.9995 19.433 16.5665 21 18.4995 21Z" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.5 21C7.433 21 9 19.433 9 17.5C9 15.567 7.433 14 5.5 14C3.567 14 2 15.567 2 17.5C2 19.433 3.567 21 5.5 21Z" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.9995 6C15.5518 6 15.9995 5.55228 15.9995 5C15.9995 4.44772 15.5518 4 14.9995 4C14.4472 4 13.9995 4.44772 13.9995 5C13.9995 5.55228 14.4472 6 14.9995 6Z" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.9995 17.5V14L8.99951 11L12.9995 8L14.9995 11H16.9995" stroke="#4A5565" strokeWidth="1.99991" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Bike
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-600">Vehicle Number</div>
                <input value={primaryVehicleNumber} onChange={(e) => setPrimaryVehicleNumber(e.target.value)} placeholder="Enter Vehicle Registration No." className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Asset Declaration */}
        {step === 3 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4 0C1.79086 0 0 1.79086 0 4C0 6.20915 1.79086 8 4 8C6.20915 8 8 6.20915 8 4C8 1.79086 6.20915 0 4 0ZM1.6 4C1.6 2.67451 2.67451 1.6 4 1.6C5.32549 1.6 6.4 2.67451 6.4 4C6.4 5.32549 5.32549 6.4 4 6.4C2.67451 6.4 1.6 5.32549 1.6 4ZM13.6 0C11.3909 0 9.6 1.79086 9.6 4C9.6 6.20915 11.3909 8 13.6 8C15.8091 8 17.6 6.20915 17.6 4C17.6 1.79086 15.8091 0 13.6 0ZM11.2 4C11.2 2.67451 12.2745 1.6 13.6 1.6C14.9254 1.6 16 2.67451 16 4C16 5.32549 14.9254 6.4 13.6 6.4C12.2745 6.4 11.2 5.32549 11.2 4ZM0 13.6C0 11.3909 1.79086 9.6 4 9.6C6.20915 9.6 8 11.3909 8 13.6C8 15.8091 6.20915 17.6 4 17.6C1.79086 17.6 0 15.8091 0 13.6ZM4 11.2C2.67451 11.2 1.6 12.2745 1.6 13.6C1.6 14.9254 2.67451 16 4 16C5.32549 16 6.4 14.9254 6.4 13.6C6.4 12.2745 5.32549 11.2 4 11.2ZM13.6 9.6C11.3909 9.6 9.6 11.3909 9.6 13.6C9.6 15.8091 11.3909 17.6 13.6 17.6C15.8091 17.6 17.6 15.8091 17.6 13.6C17.6 11.3909 15.8091 9.6 13.6 9.6ZM11.2 13.6C11.2 12.2745 12.2745 11.2 13.6 11.2C14.9254 11.2 16 12.2745 16 13.6C16 14.9254 14.9254 16 13.6 16C12.2745 16 11.2 14.9254 11.2 13.6Z" fill="#344153"/>
                </svg>
                Carrying Asset
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={carryingAsset} onChange={(e) => setCarryingAsset(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-red-600 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            <div className="p-3">
              {/* Accordion per visitor (including primary) */}
              {([{ id: 0, name }, ...visitors] as Array<{ id: number; name?: string }>).map((v) => (
                <div key={v.id} className="border border-gray-100 rounded mb-3">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">{v.id === 0 ? 'V' : v.id}</div>
                      <div className="text-sm font-medium">
                        {v.name || (v.id === 0 ? 'Primary Visitor' : `Visitor ${v.id}`)}
                        {v.id === 0 && <span className="text-gray-400 text-xs"> (Primary Visitor)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => (v.id === 0 ? removePrimaryVisitor() : removeVisitor(v.id))}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Delete Visitor"
                      >
                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.3125 9.625C1.3125 10.3495 1.90006 10.9375 2.625 10.9375H7C7.7245 10.9375 8.3125 10.3495 8.3125 9.625L9.1875 2.625H0.4375L1.3125 9.625ZM6.125 3.9375H7V9.625H6.125V3.9375ZM4.375 3.9375H5.25V9.625H4.375V3.9375ZM2.625 3.9375H3.5V9.625H2.625V3.9375ZM8.96875 0.875H6.125C6.125 0.875 5.929 0 5.6875 0H3.9375C3.69556 0 3.5 0.875 3.5 0.875H0.65625C0.293563 0.875 0 1.16856 0 1.53125C0 1.89394 0 2.1875 0 2.1875H9.625C9.625 2.1875 9.625 1.89394 9.625 1.53125C9.625 1.16856 9.331 0.875 8.96875 0.875Z" fill="black"/>
                        </svg>
                      </button>
                      <button onClick={() => setExpandedVisitors((e) => ({ ...e, [v.id]: !e[v.id] }))} className="text-gray-600" aria-label="Toggle">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${expandedVisitors[v.id] ? 'rotate-180' : ''} transition-transform`}
                        >
                          <path d="M9.5 12.1923L4.75 7.44232L5.85833 6.33398L9.5 9.97565L13.1417 6.33398L14.25 7.44232L9.5 12.1923Z" fill="#1D1B20"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedVisitors[v.id] && (
                    <div className="p-3 space-y-3">
                      <div className="text-xs text-gray-600 font-medium">Asset Category<span className="text-[#C72030]">*</span></div>
                      <div className="flex flex-wrap gap-2">
                        {['IT', 'Mechanical', 'Electrical', 'Furniture', 'Other'].map((c) => {
                          const selected = (assetsByVisitor[v.id] || [])[0]?.category === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              className={`px-3 py-1 border rounded text-sm whitespace-nowrap ${selected ? 'bg-[#d8d3c6] border-[#d8d3c6] text-gray-800' : 'bg-white border-gray-200'}`}
                              onClick={() => {
                                const list = assetsByVisitor[v.id] || [];
                                if (!list.length) {
                                  const asset = { id: 1, category: c, name: '', serial: '', notes: '', attachments: [] } as Asset;
                                  setAssetsByVisitor((s) => ({ ...s, [v.id]: [asset] }));
                                } else {
                                  setAssetsByVisitor((s) => ({
                                    ...s,
                                    [v.id]: (s[v.id] || []).map((x, idx) => idx === 0 ? { ...x, category: c } : x),
                                  }));
                                }
                              }}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>

                      {(assetsByVisitor[v.id] || []).map((a) => (
                        <div key={a.id} className="border border-gray-100 rounded p-3">
                          <div>
                            <div className="text-xs text-gray-600">Asset Name</div>
                            <input value={a.name} onChange={(e) => setAssetsByVisitor((s) => ({ ...s, [v.id]: (s[v.id] || []).map((x) => x.id === a.id ? { ...x, name: e.target.value } : x) }))} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter name..." />
                          </div>

                          <div className="mt-2">
                            <div className="text-xs text-gray-600">Serial/Model No.</div>
                            <input value={a.serial} onChange={(e) => setAssetsByVisitor((s) => ({ ...s, [v.id]: (s[v.id] || []).map((x) => x.id === a.id ? { ...x, serial: e.target.value } : x) }))} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter Serial no..." />
                          </div>

                          <div className="mt-2">
                            <div className="text-xs text-gray-600">Notes (Optional)</div>
                            <textarea value={a.notes} onChange={(e) => setAssetsByVisitor((s) => ({ ...s, [v.id]: (s[v.id] || []).map((x) => x.id === a.id ? { ...x, notes: e.target.value } : x) }))} className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Write your notes..." />
                          </div>

                          <div className="mt-2">
                            <label className="inline-flex items-center px-3 py-2 border border-[#C72030] rounded text-sm text-[#C72030] cursor-pointer">
                              Attachment
                              <input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = URL.createObjectURL(file);
                                setAssetsByVisitor((s) => ({
                                  ...s,
                                  [v.id]: (s[v.id] || []).map((x) =>
                                    x.id === a.id
                                      ? { ...x, attachments: [...(x.attachments || []), { name: file.name, url }] }
                                      : x
                                  ),
                                }));
                              }} className="hidden" />
                            </label>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 items-center">
                            {(a.attachments || []).map((att, i) => (
                              <img key={i} src={att.url} alt={att.name} className="w-10 h-10 object-cover rounded border border-gray-200" />
                            ))}
                          </div>

                          <div className="mt-2 flex justify-end">
                            <button onClick={() => setAssetsByVisitor((s) => ({ ...s, [v.id]: (s[v.id] || []).filter((x) => x.id !== a.id) }))} className="text-sm text-red-600">Remove Asset</button>
                          </div>
                        </div>
                      ))}

                      <div>
                        <button onClick={() => {
                          const list = assetsByVisitor[v.id] || [];
                          const nextId = list.length ? list[list.length - 1].id + 1 : 1;
                          setAssetsByVisitor((s) => ({ ...s, [v.id]: [...list, { id: nextId, name: '', serial: '', notes: '', attachments: [] }] }));
                        }} className="w-full border border-gray-200 py-2 rounded text-sm">Add More Asset</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Identity Verification */}
        {step === 4 && (
          <div className="bg-white rounded shadow-sm p-2">
            <div className="p-3">
              {([{ id: 0, name }, ...visitors] as Array<{ id: number; name?: string }>).map((v) => (
                <div key={v.id} className="border border-gray-100 rounded mb-3">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C72030] text-white flex items-center justify-center text-xs">{v.id === 0 ? 'V' : v.id}</div>
                      <div className="text-sm font-medium">
                        {v.name || (v.id === 0 ? 'Primary Visitor' : `Visitor ${v.id}`)}
                        {v.id === 0 && <span className="text-gray-400 text-xs"> (Primary Visitor)</span>}
                      </div>
                    </div>
                    <button onClick={() => setExpandedVisitors((e) => ({ ...e, [v.id]: !e[v.id] }))} className="text-gray-600" aria-label="Toggle">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${expandedVisitors[v.id] ? 'rotate-180' : ''} transition-transform`}
                      >
                        <path d="M9.5 12.1923L4.75 7.44232L5.85833 6.33398L9.5 9.97565L13.1417 6.33398L14.25 7.44232L9.5 12.1923Z" fill="#1D1B20"/>
                      </svg>
                    </button>
                  </div>

                  {expandedVisitors[v.id] && (
                    <div className="p-3 space-y-3">
                      {/* ID type chips */}
                      <div className="flex flex-wrap gap-2">
                        {['PAN', 'Aadhaar', 'Passport', 'Driving License'].map((idType) => (
                          <button key={idType} type="button" className="px-3 py-1 border rounded text-sm bg-white border-gray-200">
                            {idType}
                          </button>
                        ))}
                      </div>

                      {/* Upload first and second photo */}
                      <div>
                        <div className="text-xs text-gray-600 mb-2">Upload ID (jpeg/png)</div>
                        <div className="grid grid-cols-2 gap-3">
                          {['First Photo', 'Second Photo'].map((slotLabel, idx) => (
                            <div key={idx} className="relative border border-gray-200 rounded p-3 flex items-center justify-center h-24 bg-white">
                              {/* Preview if exists */}
                              {(() => {
                                const att = (assetsByVisitor[v.id]?.[idx]?.attachments?.[0]);
                                if (att) {
                                  return (
                                    <>
                                      <img src={att.url} alt={att.name} className="absolute inset-0 w-full h-full object-cover rounded" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAssetsByVisitor((s) => ({
                                            ...s,
                                            [v.id]: (s[v.id] || []).map((x, aIdx) => aIdx === idx ? { ...x, attachments: [] } : x),
                                          }));
                                        }}
                                        className="absolute top-1 right-1 text-gray-700"
                                        aria-label="Remove photo"
                                      >
                                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M1.3125 9.625C1.3125 10.3495 1.90006 10.9375 2.625 10.9375H7C7.7245 10.9375 8.3125 10.3495 8.3125 9.625L9.1875 2.625H0.4375L1.3125 9.625ZM6.125 3.9375H7V9.625H6.125V3.9375ZM4.375 3.9375H5.25V9.625H4.375V3.9375ZM2.625 3.9375H3.5V9.625H2.625V3.9375ZM8.96875 0.875H6.125C6.125 0.875 5.929 0 5.6875 0H3.9375C3.69556 0 3.5 0.875 3.5 0.875H0.65625C0.293563 0.875 0 1.16856 0 1.53125C0 1.89394 0 2.1875 0 2.1875H9.625C9.625 2.1875 9.625 1.89394 9.625 1.53125C9.625 1.16856 9.331 0.875 8.96875 0.875Z" fill="black"/>
                                        </svg>
                                      </button>
                                    </>
                                  );
                                }
                                return (
                                  <label className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-xs mt-1">{slotLabel}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const url = URL.createObjectURL(file);
                                        const list = assetsByVisitor[v.id] || [];
                                        const nextId = list.length ? list[list.length - 1].id + 1 : 1;
                                        const asset = list[idx] || { id: nextId, name: '', serial: '', notes: '', attachments: [] };
                                        const updated = [...list];
                                        updated[idx] = { ...asset, attachments: [{ name: file.name, url }] };
                                        setAssetsByVisitor((s) => ({ ...s, [v.id]: updated }));
                                      }}
                                    />
                                  </label>
                                );
                              })()}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* OR divider and Government ID field */}
                      <div className="my-3 flex items-center justify-center gap-2 text-gray-400">
                        <span className="inline-block w-20 border-t border-dashed border-gray-300" />
                        <span className="text-xs font-medium">OR</span>
                        <span className="inline-block w-20 border-t border-dashed border-gray-300" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Government ID No.</div>
                        <input className="mt-1 w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm" placeholder="Enter ID Number..." />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky bottom actions */}
  <div className="sticky bottom-0 flex justify-center p-4 bg-white z-30">
          <div className="w-full max-w-xs sm:max-w-sm flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="w-1/2 bg-white border border-gray-200 py-3 rounded">Back</button>
            )}
            {step < 6 && (
              <button
                onClick={() => setStep((s) => s === 5 ? (ndaAgree ? 6 : 5) : Math.min(6, s + 1))}
                disabled={step === 5 && !ndaAgree}
    className={`flex-1 py-3 font-semibold rounded ${step === 5 && !ndaAgree ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#C72030] text-white'}`}
              >
                {step === 5 ? 'Preview' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorSharingFormWeb;