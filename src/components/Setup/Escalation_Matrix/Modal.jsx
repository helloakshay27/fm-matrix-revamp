/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CloseIcon from '@mui/icons-material/Close';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SelectBox from "../../SelectBox";

const UserCustomDropdown = ({ options, value, onChange, onKeyDown }) => {
  const [selectedOption, setSelectedOption] = useState(value);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div className="relative w-full text-[12px]" onKeyDown={onKeyDown}>
      <Listbox value={selectedOption} onChange={handleSelect}>
        <div className="relative rounded-md">
          <ListboxButton className="relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 border-[0.5px] border-[#C0C0C0] focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm min-h-[38px]">
            <span className="block truncate">{selectedOption || `Select...`}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 p-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-[12px] z-10">
            <div className="sticky top-0 bg-white px-1 py-1 m-1">
              <div className="flex items-center border border-gray-300 rounded-md p-1">
                <SearchOutlinedIcon style={{ color: 'red' }} className="mr-1 h-4 w-4" />
                <input
                  type="text"
                  placeholder={`Search...`}
                  className="w-full text-[12px] focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {filteredOptions.map((option) => (
              <ListboxOption
                key={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${active ? 'bg-[#C72030] text-white' : 'text-gray-900'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                    {option}
                  </span>
                )}
              </ListboxOption>
            ))}
            {filteredOptions.length === 0 && (
              <div className="text-gray-500 px-3 py-2">No options found</div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

const AddEscalationModal = ({ isModalOpen, setIsModalOpen }) => {
  const addTaskModalRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [noOfEscalations, setNoOfEscalations] = useState(0);

  useEffect(() => {
    if (!isModalOpen) { /* empty */ }
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
    <div className=" fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
      <div
        ref={addTaskModalRef}
        className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
      >
        <h3 className="text-[14px] font-medium text-center ">Escalation Details</h3>
        <CloseIcon
          className="absolute top-[26px] right-8 cursor-pointer"
          onClick={closeModal}
        />

        <hr className="border border-[#E95420] my-4" />

        <div className="flex flex-col gap-4 text-[12px] p-4">
          <div className="flex flex-col gap-2">
            <label>Matrix Title <span>*</span></label>
            <input placeholder="Enter Matrix Title" className="w-full border-[0.5px] border-[#C0C0C0] p-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label>Trigger Event <span>*</span></label>
            <input placeholder="Enter Trigger Event" className="w-full border-[0.5px] border-[#C0C0C0] p-2" />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label>Notification Type<span>*</span></label>
            <SelectBox
              options={
                [
                  { label: "Email", value: "emails" },
                  { label: "Sms", value: "Sms" },
                ]
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>No Of escalations<span>*</span></label>
            <input type="text" onChange={(e) => { setNoOfEscalations(e.target.value) }} className="w-1/2 border-[0.5px] border-[#C0C0C0] p-2" placeholder="Enter Number of Escalations" />
          </div>
          {noOfEscalations > 0 &&
            [...Array(Number(noOfEscalations)).keys()].map((id) => (
              <div key={id} className="flex gap-2 justify-start mb-4">
                <div className="w-1/2 flex flex-col gap-2">
                  <label>{`Level ${id + 1} escalates to`}<span>*</span></label>
                  <UserCustomDropdown options={["Manager", "CEO", "Founder"]} value={"Manager"} />
                </div>
                <div className="w-1/2 flex flex-col gap-2">
                  <label>After<span>*</span></label>
                  <input placeholder="Enter Days" className="w-full border-[0.5px] border-[#C0C0C0] p-2" />
                </div>
              </div>
            ))
          }

        </div>
        <div className="flex justify-center gap-2 ">
          <button className="bg-[#C72030] text-white px-4 py-2">Save</button>
          <button className="border-2 border-[#C72030] text-[#C72030] px-4 py-2" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default AddEscalationModal;