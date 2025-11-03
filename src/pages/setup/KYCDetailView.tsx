import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Sample KYC data
const kycData = {
  "kyc-1": {
    userName: "Nupura Waradkar",
    userEmail: "Nupura@Stnc.In",
    userMobile: "9864181000",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        attachments: [
          { url: "https://via.placeholder.com/150", alt: "Aadhar Card Front" },
          { url: "https://via.placeholder.com/150", alt: "Aadhar Card Back" },
        ],
        verify: "Verified",
        verifiedBy: "Demo Demo",
        verifiedOn: "2023-03-30",
      },
      {
        id: 2,
        type: "Pan Card",
        attachments: [
          { url: "https://via.placeholder.com/150", alt: "Pan Card" },
        ],
        verify: "Verified",
        verifiedBy: "Demo Demo",
        verifiedOn: "2023-08-04",
      },
      {
        id: 3,
        type: "Aadhar Card",
        attachments: [
          { url: "https://via.placeholder.com/150", alt: "Aadhar Card" },
        ],
        verify: "Verified",
        verifiedBy: "Demo Demo",
        verifiedOn: "2023-09-01",
      },
      {
        id: 4,
        type: "Aadhar Card",
        attachments: [
          { url: "https://via.placeholder.com/150", alt: "Aadhar Card" },
        ],
        verify: "Verified",
        verifiedBy: "Demo Demo",
        verifiedOn: "2023-09-02",
      },
      {
        id: 5,
        type: "Pan Card",
        attachments: [
          { url: "https://via.placeholder.com/150", alt: "Pan Card" },
        ],
        verify: "Verified",
        verifiedBy: "Demo Demo",
        verifiedOn: "2023-09-02",
      },
    ],
  },
  "kyc-2": {
    userName: "Demo Demo",
    userEmail: "Demo@Lockated.Com",
    userMobile: "5889965447",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        attachments: [
          { url: "https://via.placeholder.com/150", alt: "Aadhar Card" },
        ],
        verify: "Verified",
        verifiedBy: "Demo Demo",
        verifiedOn: "2023-09-01",
      },
    ],
  },
};

export const KYCDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const data = id && kycData[id as keyof typeof kycData];

  if (!data) {
    return (
      <div className="p-6 bg-[#fafafa] min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p>KYC Detail not found</p>
          <Button onClick={() => navigate("/setup/kyc-details")} className="mt-4">
            Back to KYC Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      {/* Header with Back Button */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/setup/kyc-details")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {data.userName} - KYC Details
          </h1>
        </div>
      </div>

      {/* KYC Documents Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-[#f6f4ee]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Attachments
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Verify
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Verified By
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Verified On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {doc.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 border rounded overflow-hidden"
                        >
                          <img
                            src={attachment.url}
                            alt={attachment.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {doc.verify}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doc.verifiedBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doc.verifiedOn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
