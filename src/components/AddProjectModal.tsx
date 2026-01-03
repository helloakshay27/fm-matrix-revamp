import {
    Dialog,
    DialogContent,
    MenuItem,
    Select,
    Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { ChevronRightIcon, FolderIcon, Search, X } from "lucide-react";
import { forwardRef, Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates, fetchTemplateById } from "@/store/slices/projectTemplateSlice";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AddProjectModal = ({ openDialog, handleCloseDialog, setOpenFormDialog, onTemplateSelect }) => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const dispatch = useDispatch();

    const projectsState = useSelector((state: any) => state.projectTemplates || {});
    const projectByIdState = useSelector((state: any) => state.projectTemplates || {});

    const templates = projectsState.data?.project_managements || [];
    const templateDetails = projectByIdState.data || {};

    const addTaskModalRef = useRef(null);
    const [tab, setTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState({});

    useEffect(() => {
        if (token) {
            dispatch(fetchTemplates({ token, baseUrl }) as any);
        }
    }, [dispatch, token, baseUrl]);

    const closeModal = () => {
        handleCloseDialog();
    };

    const handleOpenTemplate = (id: string) => {
        dispatch(fetchTemplateById({ token, baseUrl, id }) as any);
    };

    useEffect(() => {
        // When template details are loaded, pass them to parent and open form dialog
        if (templateDetails && templateDetails.id) {
            if (onTemplateSelect) {
                onTemplateSelect(templateDetails);
            }
            setOpenFormDialog(true);
            handleCloseDialog();
        }
    }, [templateDetails, onTemplateSelect, setOpenFormDialog]);

    const filteredTemplates = templates.filter((template: any) => {
        return template.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[40rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                <div
                    ref={addTaskModalRef}
                    className="bg-white py-6 rounded-lg shadow-lg w-full relative h-full right-0 transition-transform duration-300"
                >
                    <h3 className="text-[14px] font-medium text-center">
                        Project Templates
                    </h3>
                    <X
                        className="absolute top-[26px] right-8 cursor-pointer"
                        onClick={closeModal}
                    />

                    <hr className="border border-[#E95420] my-4" />

                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-6 px-4 text-sm">
                        {["All", "Project Templates", "Marketing", "Development"].map((label) => (
                            <div
                                key={label}
                                onClick={() => setTab(label)}
                                className={`cursor-pointer p-2 transition-all ${tab === label ? "border-b-2 border-[#E95420]" : ""
                                    }`}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    <hr className="border" />

                    {tab === "All" && (
                        <div className="flex flex-col p-4 gap-4 h-[80vh] overflow-y-auto">
                            <div className="relative border-2 border-gray-300">
                                <Search className="text-[red] absolute top-2 left-3" size={18} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    type="text"
                                    className="w-full border h-[40px] outline-none py-3 px-10 text-sm"
                                    placeholder="Search Templates"
                                />
                            </div>

                            {/* New Project click opens ProjectCreateModal */}
                            <div
                                className="flex justify-between gap-3 cursor-pointer mt-4"
                                onClick={() => {
                                    setSelectedTemplate({});
                                    onTemplateSelect({});
                                    setOpenFormDialog(true);
                                    handleCloseDialog();
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

                            {(filteredTemplates || []).map((template: any) => (
                                <Fragment key={template.id}>
                                    <div
                                        className="flex justify-between gap-3 cursor-pointer mt-2 border-b border-gray-300 pb-2 hover:bg-gray-50 p-2 transition-colors"
                                        onClick={() => handleOpenTemplate(template.id)}
                                    >
                                        <div className="flex items-center gap-2 w-2/3 text-sm">
                                            <FolderIcon />
                                            <span>{template.title}</span>
                                        </div>
                                        <ChevronRightIcon />
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    )}

                    {tab === "Project Templates" && (
                        <div className="flex flex-col p-4 gap-4 h-[80vh] overflow-y-auto">
                            {(templates || []).map((template: any) => (
                                <Fragment key={template.id}>
                                    <div
                                        className="flex justify-between gap-3 cursor-pointer mt-2 border-b border-gray-300 pb-2 hover:bg-gray-50 p-2 transition-colors"
                                        onClick={() => handleOpenTemplate(template.id)}
                                    >
                                        <div className="flex items-center gap-2 w-2/3 text-sm">
                                            <FolderIcon />
                                            <span>{template.title}</span>
                                        </div>
                                        <ChevronRightIcon />
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    )}

                    {tab === "Marketing" && (
                        <div className="flex flex-col p-4 gap-4 h-[80vh] overflow-y-auto">
                            <p className="text-gray-400 text-center py-8">No templates available</p>
                        </div>
                    )}

                    {tab === "Development" && (
                        <div className="flex flex-col p-4 gap-4 h-[80vh] overflow-y-auto">
                            <p className="text-gray-400 text-center py-8">No templates available</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddProjectModal;