import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import Details from "./Modals/Details.jsx";
import Milestones from "./Modals/Milestone.jsx";
import CloseIcon from '@mui/icons-material/Close';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';

const CreateNewTeam = ({ openModal, setOpenModal }) => {
  return (
    <div className=" w-[560px] h-[280px] bg-white absolute top-[40%] left-[45%]  translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4  shadow-md z-50">
      <span className="bg-[#C72030] text-white px-3 py-1  absolute top-[-12px] left-[20%] text-sm">
        New Team
      </span>

      <div className="h-full flex flex-col gap-5 justify-between">
        <div className="flex justify-end">
          <CloseIcon
            className="cursor-pointer"
            onClick={() => setOpenModal(false)}
          />
        </div>

        <input
          placeholder="Enter Team Title"
          className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
        />
        <input
          placeholder="Select Team Members"
          className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
        />


        <div className="flex justify-center gap-3 mt-2 bg-[]">
          <button className="bg-[#C72030] h-[28px] cursor-pointer text-white px-4  ">
            Save
          </button>
          <button
            className="border-2 border-[#C72030] h-[28px] cursor-pointer text-[#C72030] px-4  "
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const AddProjectModal = ({ isModalOpen, setIsModalOpen, projectname ="New Project", endText="Next", isEdit, editData  }) => {
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
          <h3 className="text-[14px] font-medium text-center ">{projectname}</h3>
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

          {tab == "Details" && <Details endText={endText} setTab={setTab} openModal={openModal} setOpenModal={setOpenModal} isEdit={isEdit} />}
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
