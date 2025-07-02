import { useGSAP } from "@gsap/react";
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddProjectModal from "./AddProjectModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails, fetchTemplates } from "../../../redux/slices/projectSlice.js";

const AddProjectTemplate = ({ isModalOpen, setIsModalOpen }) => {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch();

  const { fetchTemplates: templates } = useSelector(state => state.fetchTemplates)
  const { fetchProjectDetails: details } = useSelector(state => state.fetchProjectDetails)

  const addTaskModalRef = useRef(null);
  const [tab, setTab] = useState("All");
  const [AddProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [templateDetails, setTemplateDetails] = useState({})

  useEffect(() => {
    dispatch(fetchTemplates({ token }))
  }, [dispatch])

  useGSAP(() => {
    if (isModalOpen) {
      gsap.fromTo(
        addTaskModalRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isModalOpen]);

  const closeModal = () => {
    gsap.to(addTaskModalRef.current, {
      x: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => setIsModalOpen(false),
    });
  };

  const handleOpenTemplate = (id) => {
    setAddProjectModalOpen(true)
    dispatch(fetchProjectDetails({ token, id }))
  }

  useEffect(() => {
    if (details) {
      setTemplateDetails(details)
    }
  }, [details])

  return (
    <>
      {AddProjectModalOpen ? (
        <AddProjectModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          templateDetails={templateDetails}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px] ">
          <div
            ref={addTaskModalRef}
            className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
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
            <div className="flex items-center justify-center gap-6">
              {["All", "Project Templates", "Marketing", "Development"].map((label) => (
                <div
                  key={label}
                  onClick={() => setTab(label)}
                  className={`cursor-pointer p-2 ${tab === label ? 'border-b-2 border-[#E95420]' : ''}`}
                >
                  {label}
                </div>
              ))}
            </div>

            <hr className="border" />

            <div className="flex flex-col p-4 gap-4">
              <div className="relative border-2 border-gray-300">
                <SearchOutlinedIcon className="text-[red] absolute top-2 left-3" />
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
                  setTemplateDetails({}); // Clear template data
                  setAddProjectModalOpen(true);
                }}
              >
                <div className="flex items-center gap-2 w-2/3">
                  <FolderIcon />
                  <h2>
                    New Project <i className="text-gray-400">(Create from scratch)</i>
                  </h2>
                </div>
                <KeyboardArrowRightIcon />
              </div>

              <div className="bg-[#e7e7e7] p-4 mt-4">
                <i>Predefined Project Templates</i>
              </div>

              {(templates || []).map((template) => (
                <React.Fragment key={template.id}>
                  <div className="flex justify-between gap-3 cursor-pointer mt-2 border-b border-gray-300 pb-2" onClick={() => handleOpenTemplate(template.id)}>
                    <div className="flex items-center gap-2 w-2/3">
                      <FolderIcon />
                      <span>{template.title}</span>
                    </div>
                    <KeyboardArrowRightIcon />
                  </div>
                </React.Fragment>
              ))}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProjectTemplate;
