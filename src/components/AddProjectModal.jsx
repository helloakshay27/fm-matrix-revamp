import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import Details from "./Projects/Modals/Details.jsx";
import Milestones from "./Projects/Modals/Milestone.jsx";
import CloseIcon from '@mui/icons-material/Close';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';

const AddProjectModal = ({ isModalOpen, setIsModalOpen }) => {
  const addTaskModalRef = useRef(null);
  const [tab, setTab] = useState("Details");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
    }
  }, [isModalOpen]);

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

  const onSubmit = (data) => {
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const updatedTasks = [...existingTasks, data];

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    reset();
    setIsModalOpen(false);
  };
  return (
    <div className="z-50">
      <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
        <div
          ref={addTaskModalRef}
          className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
        >
          <h3 className="text-[14px] font-medium text-center ">New Project</h3>
          <X
            className="absolute top-[26px] right-8 cursor-pointer"
            onClick={closeModal}
          />

          <hr className="border border-[#E95420] my-4" />

          <div className="flex items-center justify-center gap-40">
            {tab == "Details" ?
              <div onClick={() => setTab("Details")} className="cursor-pointer border-b-2 border-[#E95420] p-2" >
                Details
              </div> :
              <div onClick={() => setTab("Details")} className="cursor-pointer p-2" >
                Details
              </div>
            }
            {tab == "Milestone" ?
              <div onClick={() => setTab("Milestone")} className="cursor-pointer border-b-2 border-[#E95420] p-2">
                Milestone
              </div> :
              <div onClick={() => setTab("Milestone")} className="cursor-pointer p-2">
                Milestone
              </div>
            }
          </div>

          <hr className="border  " />

          {tab == "Details" && <Details setTab={setTab} />}
          {tab == "Milestone" && <Milestones />}
        </div>

      </div>
      {openModal && (
        <CreateNewTeam openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </div>
  );
};

export default AddProjectModal;
