import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { fetchTestimonialsById } from "@/store/slices/testimonialSlice";
import { ArrowLeft, Eye } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestimonialDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [testimonial, setTestimonial] = useState({
        name: '',
        designation: '',
        company_name: '',
        description: '',
        video_preview_image: ''
    });

    useEffect(() => {
        const getTestimonial = async () => {
            try {
                const response = await dispatch(fetchTestimonialsById({ baseUrl, token, id: id })).unwrap();
                setTestimonial(response);
            } catch (error) {
                console.log(error);
            }
        }

        getTestimonial();
    }, [])

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
                <div className="flex items-center gap-4 mb-[20px]">
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
                                    <span className="font-medium text-16"> {localStorage.getItem('selectedSiteName')}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Designation</span>
                                    <span className="font-medium text-16"> {testimonial.designation}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Description</span>
                                    <span className="font-medium text-16"> {testimonial.description}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Testimonial Name</span>
                                    <span className="font-medium text-16">
                                        {" "}
                                        {testimonial.name}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Company Name</span>
                                    <span className="font-medium text-16">
                                        {" "}
                                        {testimonial.company_name}
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
                        className="px-[40px] py-[31px] bg-[#F6F7F7]"
                        style={{ border: "1px solid #D9D9D9" }}
                    >
                        <div
                            className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                        >
                            <button
                                className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                title="View"
                                type="button"
                                onClick={() => {
                                    setSelectedDoc({
                                        url: testimonial.video_preview_image,
                                        document: testimonial.name
                                    });
                                    setIsModalOpen(true);
                                }}
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <img
                                src={testimonial.video_preview_image}
                                alt={testimonial.name}
                                className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            />
                        </div>
                    </CardContent>
                </Card>

                <AttachmentPreviewModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedDoc={selectedDoc}
                    setSelectedDoc={setSelectedDoc}
                />
            </>
        </div>
    )
}

export default TestimonialDetailsPage