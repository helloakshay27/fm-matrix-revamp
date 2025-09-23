import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";

const TestimonialDetailsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-[30px] min-h-screen bg-transparent">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>

            <>
                <div className="flex items-center gap-4 mb-[30px]">
                    <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
                        Testimonial Details
                    </h1>
                </div>

                <Card className="mb-6">
                    <CardHeader
                        className="bg-[#F6F4EE]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >
                        <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                            <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                                D
                            </span>
                            DETAILS
                        </CardTitle>
                    </CardHeader>
                    <CardContent
                        className="px-[80px] py-[31px] bg-[#F6F7F7]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Site Name</span>
                                    <span className="font-medium text-16"> New</span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Designation</span>
                                    <span className="font-medium text-16"> Designation</span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Description</span>
                                    <span className="font-medium text-16"> Description</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Testimonial Name</span>
                                    <span className="font-medium text-16">
                                        {" "}
                                        Test
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Company Name</span>
                                    <span className="font-medium text-16">
                                        {" "}
                                        Test
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader
                        className="bg-[#F6F4EE]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >
                        <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                            <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                                A
                            </span>
                            Attachments
                        </CardTitle>
                    </CardHeader>
                    <CardContent
                        className="px-[80px] py-[31px] bg-[#F6F7F7]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >

                    </CardContent>
                </Card>
            </>
        </div>
    )
}

export default TestimonialDetailsPage