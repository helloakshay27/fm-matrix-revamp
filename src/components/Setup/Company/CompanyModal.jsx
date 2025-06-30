import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

const CompanyModal = ({ open, setOpenModal, editData }) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
            <div className="w-[560px] h-max pb-[6rem] bg-white absolute top-1/2 left-1/2 flex flex-col translate-x-[-50%] translate-y-[-50%] border border-[#C0C0C0] shadow-md">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex justify-end">
                        <CloseIcon className="cursor-pointer" onClick={() => setOpenModal(false)} />
                    </div>
                    <div className="space-y-4 px-6">
                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Organization Name<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Organization Name"
                                // value={orgName}
                                // onChange={(e) => setOrgName(e.target.value)}
                                className="w-full border px-3 py-2 text-sm text-[#1B1B1B] border-[#C0C0C0] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Organization Logo<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                // onChange={handleLogoChange}
                                className="w-full border px-3 py-2 text-sm border-[#C0C0C0] focus:outline-none"
                            />
                            {/* {previewUrl && (
                                <img src={previewUrl} alt="Preview" className="w-20 h-20 mt-2 border rounded object-cover" />
                            )} */}
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-[#1B1B1B]">
                                Organization Domain<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Organization Domain"
                                // value={orgDomain}
                                // onChange={(e) => setOrgDomain(e.target.value)}
                                className="w-full border px-3 py-2 text-sm text-[#1B1B1B] border-[#C0C0C0] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
                    <button
                        className="border border-[#C72030] text-sm px-8 py-2"
                    // onClick={handleSubmit}
                    >
                        {/* {editData ? "Update" : "Create"} */} Create
                    </button>
                    <button
                        className="border border-[#C72030] text-sm px-8 py-2"
                        onClick={() => setOpenModal(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CompanyModal