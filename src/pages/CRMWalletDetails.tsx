import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchWalletDetails } from "@/store/slices/walletListSlice";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CRMWalletDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [walletDetails, setWalletDetails] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchWalletDetails({ baseUrl, token, id: Number(id) })).unwrap();
                setWalletDetails(response);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, [])

    return (
        <div className="p-[30px] min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>
            <Card className="mb-6">
                <CardHeader
                    className="bg-[#F6F4EE]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                        <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                            C
                        </span>
                        CUSTOMER DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className="px-[70px] py-[31px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Customer ID</span>
                                <span className="font-medium text-16"> 1</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Customer Name</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    asdf
                                </span>
                            </div>

                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Customer Code</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    asdf
                                </span>
                            </div>
                        </div>


                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Mobile No.</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap" >
                                    {" "}
                                    asdf
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Email ID</span>
                                <span className="font-medium text-16"> asdf</span>
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
                            W
                        </span>
                        WALLET DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className="px-[70px] py-[31px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Wallet ID</span>
                                <span className="font-medium text-16"> 1</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Wallet Access</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    asdf
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Total Wallet Balance</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    asdf
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Remaining Wallet Points</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    asdf
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Complimentary Points</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                                    asdf
                                </span>
                            </div>
                        </div>


                        <div className="space-y-4">
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Updated Date & Time</span>
                                <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap" >
                                    {" "}
                                    asdf
                                </span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Created Date & Time</span>
                                <span className="font-medium text-16"> asdf</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Expired On</span>
                                <span className="font-medium text-16"> asdf</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Top-Up By</span>
                                <span className="font-medium text-16"> asdf</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#1A1A1A80] w-48 text-14">Rule Status</span>
                                <span className="font-medium text-16"> asdf</span>
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
                            R
                        </span>
                        RECURRING RULE STATUS
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className="px-[70px] py-[31px] bg-[#F6F7F7]"
                    style={{ border: "1px solid #D9D9D9" }}
                >

                </CardContent>
            </Card>
        </div>
    )
}

export default CRMWalletDetails