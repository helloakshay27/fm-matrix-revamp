import { useGSAP } from "@gsap/react";
import React, { useRef, useEffect, useState, Fragment } from "react";
import { DeleteIcon, X } from "lucide-react";
import gsap from "gsap";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';



import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { set } from "react-hook-form";
import WeekProgressPicker from "../../../../Milestone/weekProgressPicker";
import MultiSelectBox from "../../../MultiSelectBox";
import SelectBox from "../../../SelectBox";


const CustomDropdown = ({ options, value }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option); // Notify parent component of selection
    setIsOpen(false);
  };

  return (
    <div className="relative w-30 text-[12px] ">
      <Listbox value={selectedOption} onChange={handleSelect}>
        <div className="relative border-2 border-gray-300">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm">
            <input
              type="input"
              className="p-2 w-[90%] text-[12px] "
              placeholder={`Select ${value}`}
              value={selectedOption || ''}
              readOnly
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute mt-1 p-3 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-[12px] z-10">
            <div className="sticky top-0 bg-white px-2 py-1 rounded-[30px] border-2 border-grey-400 m-2 h-[40px] flex items-center">
              <SearchOutlinedIcon style={{ color: 'red' }} className="mr-2" />
              <input
                type="text"
                placeholder={`Search ${value}`}
                className="w-[80%] h-[30px] text-[12px] shadow-sm sm:text-sm p-2 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredOptions.map((option, index) => (
              <React.Fragment key={index}>
                <ListboxOption
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${active ? 'bg-red-600 text-white' : 'text-gray-900'
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
                {index < filteredOptions.length - 1 && (
                  <hr className="border-t border-gray-200 my-1" />
                )}
              </React.Fragment>
            ))}
            {filteredOptions.length === 0 && (
              <li className="text-gray-500 px-4 py-2">No options found</li>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

const CustomDropdownMultiple = ({ options, value, onSelect, initialSelected }) => {
  const [selectedOptions, setSelectedOptions] = useState(initialSelected || []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMultiSelectChange = (newlySelectedOptions) => {
    setSelectedOptions(newlySelectedOptions);
    onSelect(newlySelectedOptions);
  };

  const handleDeselectItem = (e, optionToDeselect) => {
    e.stopPropagation();
    const newSelectedOptions = selectedOptions.filter((item) => item !== optionToDeselect);
    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions);
  };

  return (
    <div className="relative w-auto text-[12px]">
      <Listbox value={selectedOptions} multiple onChange={handleMultiSelectChange}>
        <div className="relative border-2 border-gray-300">
          <ListboxButton className="relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm min-h-[40px] flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option}
                  className="flex items-center border-2 border-red-400 rounded-full px-2 py-1 text-gray-700 text-xs"
                >
                  {option}
                  <XMarkIcon
                    className="ml-1.5 h-4 w-4 cursor-pointer text-red-700 hover:text-red-900"
                    onClick={(e) => handleDeselectItem(e, option)}
                    aria-hidden="true"
                  />
                </span>
              ))
            ) : (
              <span className="text-gray-500">{`Select ${value}`}</span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions
            className={`absolute mt-1 p-3 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-[12px] z-20`}
          >
            <div className="sticky top-0 bg-white px-2 py-1 rounded-[30px] border-2 border-gray-300 m-2 h-[40px] flex items-center">
              <SearchOutlinedIcon style={{ color: 'red' }} className="mr-2" />
              <input
                type="text"
                placeholder={`Search ${value}`}
                className="w-[80%] h-[30px] text-[12px] shadow-sm sm:text-sm p-2 focus:outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredOptions.map((option, index) => (
              <Fragment key={option}>
                <ListboxOption
                  className={({ active, selected }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${active ? 'bg-red-600 text-white' : 'text-gray-900'
                    } ${selected ? ' border-1 border-red-400 font-semibold' : 'font-normal'}`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {option}
                    </span>
                  )}
                </ListboxOption>
                {index < filteredOptions.length - 1 && <hr className="border-t border-gray-200 my-1" />}
              </Fragment>
            ))}
            {filteredOptions.length === 0 && searchTerm && (
              <div className="text-gray-500 px-4 py-2 relative cursor-default select-none">No options found</div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

const Tasks = () => {
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
  const [nextId, setNextId] = useState(2);
  const [tasks, setTasks] = useState([
    { id: 1 }
  ])


  const handleDeleteTasks = (id) => {
    setTasks(tasks.filter(tasks => tasks.id !== id));
  }

  const handleAddTasks = () => {
    setTasks([...tasks, { id: nextId }]);
    setNextId(nextId + 1);
  }

  return (

    <form className="pt-2 pb-12 h-full overflow-y-auto text-[12px]">

      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="mt-4 space-y-2">
            <label className="block ms-2">
              Project <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder={`Project ${nextId - 1}`}
              className="w-full border h-[40px] outline-none border-gray-300 py-2 px-4 text-[13px] bg-gray-200"
              readOnly
            />
          </div>
          <div className="mt-4 space-y-2 w-auto">
            <label className="block ms-2">
              Milestone<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder={`Milestone ${nextId - 1}`}
              className="w-full border h-[40px] outline-none border-gray-300 py-2 px-4 text-[13px] bg-gray-200"
            />
          </div>
        </div>




        <div className="flex items-start gap-4 mt-3">
          <div className="w-full flex flex-col justify-between">
            <label className="block mb-2">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              className="w-full border h-[40px] outline-none border-gray-300 py-2 px-4 text-[13px]"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2 h-[100px]">
          <label className="block ms-2">
            Description
          </label>
          <textarea
            type="text"
            rows={5}
            placeholder="Enter Description"
            className="w-full border outline-none border-gray-300 py-3 px-4 text-[13px] h-[70%]"
          />
        </div>


        <div className="flex justify-between gap-20 mt-1">
          <div className="mt-4 space-y-2 h-[100px]">
            <label className="block mb-2 ">
              Responsible Person<span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={[
                { label: "User", value: "op1" },
              ]}

              placeholder="Select Person "

            />
          </div>
          <div className="mt-4 space-y-2 h-[100px] ">
            <label className="block">
              Department<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Tech"
              className="w-full text-[13px] border-2 border-grey-300 p-2 bg-gray-200"
              readOnly
            />

          </div>

        </div>

        <div className="flex justify-between gap-20 mt-1 text-[12px]">
          <div className="space-y-2">
            <label className="block ms-2">Priority</label>
            <MultiSelectBox options={[
              { label: "User1", value: "op1" },
              { label: "User2", value: "op1" },

            ]} value={"Priority"} placeholder="Select Priority"
            />
          </div>

          <div className="w-[130px] space-y-2 ">
            <label className="block ms-2">Duration</label>
            <input type="text" className="w-full border outline-none border-gray-300 p-2 text-[13px]" placeholder="00d:00h:00m" />
          </div>

        </div>

        <div>
          <WeekProgressPicker />
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="flex flex-col justify-between w-2/3">
            <label className="block mb-2">
              Observer<span className="text-red-600">*</span>
            </label>
            <MultiSelectBox  options={[
              { label: "User1", value: "op1" },
              { label: "User2", value: "op1" },
            ]}
              value={"Observer"}  placeholder="Select Observer"/>
          </div>


        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className=" flex flex-col justify-between w-full">
            <label className="block mb-2">
              Tags<span className="text-red-600">*</span>
            </label>
            <MultiSelectBox options={[
              { label: "User1", value: "op1" },
              { label: "User2", value: "op1" },
            ]} value={"Tags"} placeholder="Select Tags" />
          </div>


        </div>


        {/* <div className="relative">
                                <label onClick={handleAddTasks} className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer">Add Sprints</label>
                            </div> */}

        {/* {
                            tasks.map(tasks=><AddTasksModal id={tasks.id} deleteTasks={handleDeleteTasks}/>)
                            } */}

        <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-10 text-[12px]">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[white] border-[red] px-4 py-2 w-[100px] bg-[red]"
          >
            Create
          </button>
          <button type="submit" className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 ">
            Add New task
          </button>

        </div>
      </div>
    </form>

  );
};

export default Tasks;