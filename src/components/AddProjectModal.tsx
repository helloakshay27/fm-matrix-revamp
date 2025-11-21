import {
    Dialog,
    DialogContent,
    MenuItem,
    Select,
    Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { ChevronRightIcon, FolderIcon, Search, X } from "lucide-react";
import { forwardRef, Fragment } from "react";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AddProjectModal = ({ openDialog, handleCloseDialog, setOpenFormDialog }) => {
    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[35rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                {/* <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px] "> */}
                <div
                    className="bg-white py-6 rounded-lg shadow-lg w-full relative h-full right-0"
                >
                    <h3 className="text-[14px] font-medium text-center">
                        Project Templates
                    </h3>
                    <X
                        className="absolute top-[26px] right-8 cursor-pointer"
                        onClick={handleCloseDialog}
                    />

                    <hr className="border border-[#E95420] my-4" />

                    {/* Tabs */}
                    <div className="flex items-center justify-start gap-4 px-4 text-sm">
                        {["All", "Project Templates", "Marketing", "Development"].map((label) => (
                            <div
                                key={label}
                                className={`cursor-pointer p-2`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <hr className="border" />

                    <div className="flex flex-col p-4 gap-4">
                        <div className="relative border-2 border-gray-300">
                            <Search className="text-[red] absolute top-2 left-3" />
                            <input
                                type="text"
                                className="w-full border h-[40px] outline-none py-3 px-10 text-sm"
                                placeholder="Search Templates"
                            />
                        </div>

                        {/* New Project click opens AddProjectModal */}
                        <div
                            className="flex justify-between gap-3 cursor-pointer mt-4 "
                            onClick={() => {
                                setOpenFormDialog(true);
                            }}
                        >
                            <div className="flex items-center gap-2 w-2/3 text-sm">
                                <FolderIcon />
                                <h2>
                                    New Project <i className="text-gray-400">(Create from scratch)</i>
                                </h2>
                            </div>
                            <ChevronRightIcon />
                        </div>

                        <div className="bg-[#e7e7e7] p-4 mt-4">
                            <i>Predefined Project Templates</i>
                        </div>

                        {(["Test"]).map((template) => (
                            <Fragment key={template}>
                                <div className="flex justify-between gap-3 cursor-pointer mt-2 border-b border-gray-300 pb-2">
                                    <div className="flex items-center gap-2 w-2/3 text-sm">
                                        <FolderIcon />
                                        <span>{template}</span>
                                    </div>
                                    <ChevronRightIcon />
                                </div>
                            </Fragment>
                        ))}

                    </div>
                </div>
                {/* </div> */}
            </DialogContent>
        </Dialog>
    )
}

export default AddProjectModal