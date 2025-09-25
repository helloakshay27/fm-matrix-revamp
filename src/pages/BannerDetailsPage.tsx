import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/store/hooks';
import { fetchBannersById } from '@/store/slices/bannerSlice';
import { ArrowLeft, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';

const BannerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [banner, setBanner] = useState({
        active: '',
        geo_link: '',
        url: ''
    })

    useEffect(() => {
        const getBanner = async () => {
            try {
                const response = await dispatch(fetchBannersById({ baseUrl, token, id: id })).unwrap();
                setBanner(response);
            } catch (error) {
                console.log(error);
            }
        };
        getBanner();
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
                        Banner Details
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
                                    <span className="font-medium text-16"> {localStorage.getItem("selectedSiteName")}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Status</span>
                                    <span className="font-medium text-16"> {banner.active ? "Active" : "Inactive"}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Banner URL</span>
                                    <span className="font-medium text-16">
                                        {" "}
                                        {banner.geo_link}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-[#1A1A1A80] w-40 text-14">Banner</span>
                                    <div
                                        className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                                    >
                                        <button
                                            className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                            title="View"
                                            type="button"
                                            onClick={() => {
                                                setSelectedDoc({
                                                    url: banner.url,
                                                    document: "Banner Image"
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <img
                                            src={banner.url}
                                            alt={"Banner Image"}
                                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
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

export default BannerDetailsPage