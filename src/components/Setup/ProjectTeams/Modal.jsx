import {useState,useEffect,useRef} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CloseIcon from '@mui/icons-material/Close';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SelectBox from "../../SelectBox";
import MultiSelectBox from '../../MultiSelectBox';
import { useDispatch, useSelector } from "react-redux";
import {fetchUsers} from "../../../redux/slices/userSlice";



const TeamModal = ({ isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();
    const addTaskModalRef = useRef(null);
    const [openModal,setOpenModal]=useState(false);
    const [noOfEscalations, setNoOfEscalations] = useState(0);
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

        useEffect(() => {
            dispatch(fetchUsers());
        },[dispatch]);
    
        const onSubmit = (data) => {
            const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
            const updatedTasks = [...existingTasks, data];
    
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    
            reset();
            setIsModalOpen(false);
        };
      return(
        <div className=" fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
            <div
                ref={addTaskModalRef}
                className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
            >
                <h3 className="text-[14px] font-medium text-center ">New team</h3>
                <CloseIcon
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={closeModal}
                />

                <hr className="border border-[#E95420] my-4" />

                <div className="flex flex-col gap-5 text-[12px] p-4">
                       <div className="flex flex-col gap-2">
                        <label>Team Name<span>*</span></label>
                        <input placeholder="Enter Matrix Title" className="w-full border-[0.5px] border-[#C0C0C0] p-2" />
                       </div>
                       <div className="flex flex-col gap-2">
                        <SelectBox label="Team Lead" placeholder="Select team Lead" options={["Option 1", "Option 2", "Option 3"]}/>
                       </div>
                       <div className="flex flex-col gap-2 w-1/2">
                        <SelectBox label="Project" placeholder="Select Project" options={["Option 1", "Option 2", "Option 3"]}/>
                       </div>
                       <div className="flex flex-col gap-2">
                        <MultiSelectBox label="Team Members" placeholder="Select Team Members" options={["Option 1", "Option 2", "Option 3"]}/>
                       </div>
                
                </div>
                <div className="absolute flex justify-center gap-6 bottom-10 left-[30%] ">
                    <button className="bg-[#C72030] text-white px-4 h-[30px] w-[100px]">Save</button>
                    <button className="border-2 border-[#C72030] text-[#C72030] px-4 h-[30px] w-[100px]" onClick={closeModal}>Cancel</button>

                </div>
            </div>
        </div>
      )
}

export default TeamModal;