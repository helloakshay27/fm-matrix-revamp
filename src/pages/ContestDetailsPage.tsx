import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trophy,
  Gift,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ContestDetails {
  id: number;
  name: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  usersCap: string;
  attemptsRequired: string;
  active: boolean;
  offers: OfferDetail[];
  termsDocument: string;
  redemptionGuide: string;
}

interface OfferDetail {
  id: number;
  offerTitle: string;
  offerDescription: string;
  displayName: string;
  couponCode: string;
  partner: string;
  probability: string;
  bannerImage: string;
}

const dummyContest: ContestDetails = {
  id: 1,
  name: "Spin the wheel",
  type: "Spin",
  description: "20% off on myntra fashion",
  startDate: "26/07/2025",
  endDate: "26/10/2025",
  startTime: "02:00 PM",
  endTime: "03:00 PM",
  usersCap: "1000",
  attemptsRequired: "5",
  active: true,
  offers: [
    {
      id: 1,
      offerTitle: "Myntra Fashion Offer",
      offerDescription: "₹100 Off on first purchase",
      displayName: "Myntra 10% off",
      couponCode: "MYF56A",
      partner: "Myntra 10% off",
      probability: "10/100",
      bannerImage: "/banners/myntra-banner.jpg",
    },
  ],
  termsDocument: "T&C.pdf",
  redemptionGuide: "T&C.pdf",
};

export const ContestDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<ContestDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContest(dummyContest);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleEdit = (section: string) => {
    toast.info(`Editing ${section} section`);
    // Navigate to edit page or open edit modal
  };

  const handleBack = () => {
    navigate("/contests");
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#C72030] animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Contest not found</p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contest List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">
                {contest.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  contest.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {contest.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-gray-600">{contest.type} Contest</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleEdit("all")}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 px-4 py-2"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Contest
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Basic Contest Info */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Basic Contest Info
              </h3>
            </div>
            <Button
              onClick={() => handleEdit("basic")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Contest Name
                </p>
                <p className="text-base text-[#1A1A1A]">{contest.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Contest Type
                </p>
                <p className="text-base text-[#1A1A1A]">{contest.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Contest Description
                </p>
                <p className="text-base text-[#1A1A1A]">
                  {contest.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validity & Status */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Validity & Status
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  contest.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {contest.active ? "Active" : "Inactive"}
              </span>
              <Button
                onClick={() => handleEdit("validity")}
                variant="outline"
                size="sm"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-base text-[#1A1A1A]">{contest.startDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="text-base text-[#1A1A1A]">{contest.startTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-base text-[#1A1A1A]">{contest.endDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="text-base text-[#1A1A1A]">{contest.endTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Users Cap</p>
                <p className="text-base text-[#1A1A1A]">{contest.usersCap}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Attempts Required
                </p>
                <p className="text-base text-[#1A1A1A]">
                  {contest.attemptsRequired}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers & Media */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Gift className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Offers & Media
              </h3>
            </div>
            <Button
              onClick={() => handleEdit("offers")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            {/* Offers List */}
            {contest.offers.map((offer, index) => (
              <div key={offer.id} className="mb-6 last:mb-0">
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-[#C72030] font-semibold">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                      {/* Row 1 */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">
                          Offer Title
                        </p>
                        <p className="text-sm text-[#1A1A1A]">
                          {offer.offerTitle}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">
                          Coupon Code
                        </p>
                        <p className="text-sm text-[#1A1A1A]">
                          {offer.couponCode}
                        </p>
                      </div>
                      <div className="md:row-span-4 flex items-start justify-end">
                        {/* Banner Image Placeholder */}
                        <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          <div className="text-center p-2">
                            <p className="text-xs text-gray-500">
                              Banner Image
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">
                          Offer Description
                        </p>
                        <p className="text-sm text-[#1A1A1A]">
                          {offer.offerDescription}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">
                          Display Name
                        </p>
                        <p className="text-sm text-[#1A1A1A]">
                          {offer.displayName}
                        </p>
                      </div>

                      {/* Row 3 */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">
                          Partner
                        </p>
                        <p className="text-sm text-[#1A1A1A]">
                          {offer.partner}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">
                          Probability
                        </p>
                        <p className="text-sm text-[#1A1A1A]">
                          {offer.probability}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <FileText className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Terms & Conditions
              </h3>
            </div>
            <Button
              onClick={() => handleEdit("terms")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center p-2">
                <FileText className="w-6 h-6 text-[#C72030] mb-1" />
                <p className="text-xs text-gray-600 truncate w-full text-center">
                  {contest.termsDocument}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redemption Guide */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Redemption Guide
              </h3>
            </div>
            <Button
              onClick={() => handleEdit("redemption")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center p-2">
                <FileText className="w-6 h-6 text-[#C72030] mb-1" />
                <p className="text-xs text-gray-600 truncate w-full text-center">
                  {contest.redemptionGuide}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestDetailsPage;
