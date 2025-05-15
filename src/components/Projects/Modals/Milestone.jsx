import { useGSAP } from "@gsap/react";
import React,{ useRef, useEffect ,useState,Fragment} from "react";
import { DeleteIcon, X } from "lucide-react";
import gsap from "gsap";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';



import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { set } from "react-hook-form";


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
    <div className="relative w-34 text-[12px] ">
      <Listbox value={selectedOption} onChange={handleSelect}>
        <div className="relative border-2 border-gray-300">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm">
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

const CustomDropdownMultiple = ({ options, value, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]); // For multi-select
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    onSelect(selectedOptions);
  };

  return (
    <div className="relative w-34 text-[12px] ">
      <Listbox value={selectedOptions} multiple onChange={setSelectedOptions}>
        <div className="relative border-2 border-gray-300">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm overflow-hidden flex flex-wrap items-center">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option}
                  className=" border-2 border-red-400 rounded-[20px] px-2 py-1 mr-1 mb-1 text-gray-700 text-xs"
                >
                  {option}
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
            className={`absolute mt-1 p-3 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-[12px] z-10`} // Consistent styling for ListboxOptions
          >
            <div className="sticky top-0 bg-white px-2 py-1 rounded-[30px] border-2 border-grey-400 m-2 h-[40px] flex items-center">
              <SearchOutlinedIcon style={{ color: 'red' }} className="mr-2" />
              <input
                type="text"
                placeholder={`Search ${value}`}
                className="w-[80%] h-[30px] text-[12px] shadow-sm sm:text-sm p-2 focus:outline-none" // Consistent styling for input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredOptions.map((option, index) => (
              <Fragment key={index}>
                <ListboxOption
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${
                      active ? 'bg-red-600 text-white' : 'text-gray-900'
                    } ${selectedOptions.includes(option) ? 'bg-red-100' : ''}`
                  }
                  value={option}
                >
                  <span className={`block truncate ${selectedOptions.includes(option) ? 'font-semibold' : 'font-normal'}`}>
                    {option}
                  </span>
                </ListboxOption>
                {index < filteredOptions.length - 1 && <hr className="border-t border-gray-200 my-1" />}
              </Fragment>
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

const AddMilestoneModal = ({ id, deleteMilestone }) => {
       const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
  
  return(
  <div className="flex flex-col  relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10">
                                  <div className="absolute right-2 top-2">
                                      <DeleteOutlinedIcon className="text-red-600 cursor-pointer" onClick={() => deleteMilestone(id)}/>
                                  </div>
                                  <div>
                                    <label className="block mb-2 ">Milestone Title</label>
                                    <input
                                    type="text"
                                    placeholder="Enter Milestone Title"
                                    className="w-full p-2 border border-gray-300"
                                  />
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="w-1/2">
                                      <label className="block mb-2 ">Milestone Owner<span className="text-red-600">*</span></label>
                                      <CustomDropdown options={options} value={"Milestone Owner"}/>

                                    </div>
                                    
                                </div>

                                <div className="flex items-start gap-4 mt-4 text-[12px]">
                            <div className="w-1/3 space-y-2">
                                <label className="block ms-2">Start Date</label>
                                <input type="date" className="w-full border outline-none border-gray-300  py-3 px-4 text-sm placeholder-shown:text-transparent" />
                            </div>

                            <div className="w-1/3 space-y-2">
                                <label className="block ms-2">End Date</label>
                                <input type="date" className="w-full border outline-none border-gray-300 py-3 px-4 text-sm" />
                            </div>

                            <div className="w-[100px] space-y-2">
                                 <label className="block ms-2">Duration</label>
                                <input type="text" className="w-full border outline-none border-gray-300  py-3 px-4 text-sm" readOnly/>
                            </div>

                        </div>

                                      <div>
                                       <label className="block mb-2 ">Depends On</label>
                                      </div>
                                </div>
  );
}

const Milestones=()=>{
     const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
     const [dependencyOptions, setDependencyOptions] = useState([]);
    const [createTeamModal, setCreateTeamModal] = useState(false);
    const [nextId,setNextId]=useState(1);
    const [milestones,setMilestones]=useState([
    ])
     const[startDate, setStartDate] = useState();
        const[endDate, setEndDate] = useState();
    
       const handleDuration=()=>{
        if(startDate==null || endDate==null) return;
        const ms = new Date(endDate) - new Date(startDate); // difference in milliseconds
    
      const totalMinutes = Math.floor(ms / (1000 * 60));
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;
    
      return `${days}:${hours}:${minutes}`;
       }

     useEffect(() => {
  const options = milestones.map(milestone => `Milestone ${milestone.id}`);
  setDependencyOptions(options); 
}, [milestones]);


    const handleDeleteMilestone=(id)=>{
      setMilestones(milestones.filter(milestone=>milestone.id!==id));
    }

    const handleAddMilestone=()=>{
      setMilestones([...milestones,{id:nextId}]);
      setNextId(nextId+1);
    }

    return (
        
          <form className="pt-2 pb-12 h-full">
                    <div
                        id="addTask"
                        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
                    >

                        <div className="mt-4 space-y-2">
                            <label className="block ms-2">
                                Milestone Title <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Project Title"
                                className="w-full border h-[40px] outline-none border-gray-300 py-3 px-4 text-sm"
                            />
                        </div>
                      
                          
              

                                <div className="flex items-start gap-4 mt-3">
                                <div className="w-1/2 flex flex-col justify-between">
                                    <label className="block mb-2">
                                      Project Owner <span className="text-red-600">*</span>
                                   </label>
                                   <CustomDropdown options={options} value={"Project Owner"} />
                                </div>

                            
                        </div>

                        <div className="flex items-start gap-4 mt-4 text-[12px]">
                            <div className="w-1/3 space-y-2">
                                <label className="block ms-2">Start Date</label>
                                <input value={startDate} onChange={(e)=>{setStartDate(e.target.value)}}type="date" className="w-full border outline-none border-gray-300  py-3 px-4 text-sm placeholder-shown:text-transparent" />
                            </div>

                            <div className="w-1/3 space-y-2">
                                <label className="block ms-2">End Date</label>
                                <input type="date" value={endDate} onChange={(e)=>{setEndDate(e.target.value)}}className="w-full border outline-none border-gray-300 py-3 px-4 text-sm" />
                            </div>

                            <div className="w-[100px] space-y-2">
                                 <label className="block ms-2">Duration</label>
                                <input type="text" value={handleDuration()} className="w-full border outline-none border-gray-300  py-3 px-4 text-sm bg-gray-200" readOnly/>
                            </div>

                        </div>

                          <div className="flex items-start gap-4 mt-3">
                                <div className="w-1/2 flex flex-col justify-between">
                                    <label className="block mb-2">
                                      Depends On <span className="text-red-600">*</span>
                                   </label>
                                   <CustomDropdownMultiple options={dependencyOptions} value={"Depends On"} />
                                </div>

                            
                        </div>
                        

                        <div className="relative">
                            <label onClick={handleAddMilestone} className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer"><i>Add Milestone</i></label>
                        </div>

                        {
                          milestones.map(milestone=><AddMilestoneModal id={milestone.id} deleteMilestone={handleDeleteMilestone}/>)
                        }

                         <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-10">
                        <button
                            type="submit"
                            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
                        >
                            Next
                        </button>
                       
                    </div>
             </div>
                   
                </form>
           
    );
};

export default Milestones;