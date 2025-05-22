import { useGSAP } from "@gsap/react";
import React,{ useRef, useEffect ,useState,Fragment} from "react";
import { Milestone, X } from "lucide-react";
import gsap from "gsap";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Details from "./Projects/Modals/Details.jsx";
import Milestones from "./Projects/Modals/Milestone.jsx";
import CloseIcon from '@mui/icons-material/Close';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';



const CustomDropdown = ({ options, value}) => {
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
                    `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${
                      active ? 'bg-red-600 text-white' : 'text-gray-900'
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



const CreateNewTeam = ({ setOpenModal, openModal }) => {
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
              placeholder="Enter team title"
              className="border-[0.5px] border-[#C0C0C0] p-2  text-sm"
            />

            <CustomDropdown
              options={["Option 1", "Option 2", "Option 3"]}
              value="Team"
              onSelect={() => {}} 
            />

            <div className="flex justify-center gap-3 mt-2">
              <button className="bg-[#C72030] h-[28px] text-white px-4">
                Save
              </button>
              <button
                className="border-2 h-[28px] border-[#C72030] text-[#C72030] px-4 "
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
 
  );
};

const AddProjectModal = ({ isModalOpen, setIsModalOpen }) => {
    const addTaskModalRef = useRef(null);
    const [tab,setTab]=useState("Details");
    const [openModal,setOpenModal]=useState(false);

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
      return(
    <div className="z-50">
        <div className=" fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
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
                    { tab=="Details" ?
                       <div onClick={() => setTab("Details")} className="cursor-pointer border-b-2 border-[#E95420] p-2" > 
                         Details
                      </div>:
                      <div onClick={() => setTab("Details")} className="cursor-pointer p-2" > 
                         Details
                      </div>
                      }
                      {tab=="Milestone" ?
                      <div onClick={() => setTab("Milestone")} className="cursor-pointer border-b-2 border-[#E95420] p-2">
                        Milestone
                      </div>:
                      <div onClick={() => setTab("Milestone")} className="cursor-pointer p-2">
                        Milestone
                      </div>
}
                </div>

                <hr className="border  " />
                 
                 {tab=="Details" && <Details setTab={setTab} setOpenModal={setOpenModal}/>}
                 {tab=="Milestone" && <Milestones />}
            </div>
          
        </div>
          {openModal&&(
                <CreateNewTeam openModal={openModal} setOpenModal={setOpenModal}/>
            )}
        </div>
    );
};

export default AddProjectModal;
