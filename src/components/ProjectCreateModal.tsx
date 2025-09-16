import {
    Dialog,
    DialogContent,
    MenuItem,
    Select,
    Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ProjectCreateModal = ({ openDialog, handleCloseDialog, handleSubmit }) => {
    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[30rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                <form className="h-full" onSubmit={handleSubmit}>
                    <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
                        <div className="mt-4 space-y-2">
                            <label className="block">
                                Project Title <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="projectTitle"
                                placeholder="Enter Project Title"
                                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
                            />
                        </div>

                        <div className="flex justify-between my-4">
                            {["createChannel", "createTemplate"].map((name) => (
                                <div key={name}>
                                    <input
                                        type="checkbox"
                                        id={name}
                                        className="mx-2 my-0.5"
                                    />
                                    <label htmlFor={name}>
                                        Create a {name === "createChannel" ? "Channel" : "Template"}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-2 h-[100px]">
                            <label className="block">Description</label>
                            <textarea
                                name="description"
                                rows={5}
                                placeholder="Enter Description"
                                className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[75px] overflow-y-auto resize-none"
                            />
                        </div>

                        <div className="flex items-start gap-4 mt-3">
                            <div className="w-full">
                                <label className="block mb-2">
                                    Project Owner <span className="text-red-600">*</span>
                                </label>
                                <Select
                                    label="Project Owner"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Select Team</em>
                                    </MenuItem>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 text-[12px]">
                            {["startDate", "endDate"].map((field) => (
                                <div key={field} className="w-full space-y-2">
                                    <label className="block">
                                        {field === "startDate" ? "Start Date" : "End Date"}{" "}
                                        <span className="text-red-600">*</span>
                                    </label>

                                    <input
                                        type="date"
                                        className="w-full border outline-none border-gray-300 p-2"
                                    />
                                </div>
                            ))}

                            <div className="w-[300px] space-y-2">
                                <label className="block">Duration</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="w-full border outline-none border-gray-300 p-2 bg-gray-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 my-10">
                            <div>
                                <div className="flex justify-between">
                                    <label className="block mb-2">
                                        Project Team <span className="text-red-600">*</span>
                                    </label>
                                    <label
                                        className="text-[12px] text-[red] cursor-pointer"
                                    >
                                        <i>Create new team</i>
                                    </label>
                                </div>
                                <Select
                                    label="Project Team"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Select Team</em>
                                    </MenuItem>
                                </Select>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block mb-2">Project Type</label>
                                    <Select
                                        label="Project Type"
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select Team</em>
                                        </MenuItem>
                                    </Select>
                                </div>
                                <div className="w-1/2">
                                    <label className="block mb-2">Priority</label>
                                    <Select
                                        label="Priority"
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select Team</em>
                                        </MenuItem>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Tags</label>
                                <Select
                                    label="Tags"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Select Team</em>
                                    </MenuItem>
                                </Select>
                                <div
                                    className="text-[12px] text-[red] text-right cursor-pointer mt-2"
                                >
                                    <i>Create new tag</i>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    className="border-2 border-red-500 px-4 py-2 text-black w-[100px]"
                                >
                                    Save
                                </button>
                                <button
                                    type="submit"
                                    className="border-2 border-red-500 px-4 py-2 text-black w-max"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectCreateModal