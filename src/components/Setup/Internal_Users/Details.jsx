import React, { useState } from 'react'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import Modal from './Modal';
import { Link } from 'react-router-dom';



const Details = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    return (
        <div className="flex flex-col gap-5 p-10 m-10 text-[14px] bg-[#D9D9D933] h-full">
            <div className="flex justify-between gap-10">
                <div className="flex justify-start gap-4 w-2/3">
                    <span className="rounded-full bg-[#D5DBDB] w-[65px] h-[65px] flex justify-center items-center text-[25px]">AT</span>
                    <div className='flex flex-col gap-3'>
                        <span>Abhindya A</span>
                        <div className="flex justify-between gap-10">
                            <span>Email Id :abhindya.t@lockated</span>
                            <span>Role : Designer</span>
                            <span>Reports To: kshitij R</span>
                            <span className='text-green-500'>Active</span>
                        </div>
                    </div>
                </div>
                <div>
                    <Link to="/setup/internal-users"><span className="cursor-pointer"><KeyboardArrowLeftOutlinedIcon style={{ fontSize: "medium" }} />Back</span></Link> 
                </div>
            </div>
            <div className="flex justify-between gap-3">
                <div className='flex flex-col gap-10 w-1/2'>
                    <div className="flex justify-center items-center gap-20 h-[120px] bg-[#FFFFFF66]">
                        <div>
                            <h1 className="block mb-4 font-bold">Planned Hours</h1>
                            <span>00 : 00</span>
                        </div>
                        <span className='border-x-2 border-gray-300 h-[80px]'></span>

                        <div>
                            <h1 className="block mb-4 font-bold">Actual Hours</h1>
                            <span>00 : 00</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-20 h-[120px] bg-[#FFFFFF66]">
                        <div>
                            <h1 className="block mb-4 font-bold">Milestones</h1>
                            <span className='block mb-2'>open: 0</span>
                            <span>closed: 0</span>
                        </div>
                        <span className='border-x-2 border-gray-300 h-[80px]'></span>
                        <div>
                            <h1 className="block mb-4 font-bold">Tasks</h1>
                            <span className="block mb-2">open: 0</span>
                            <span>closed: 0</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-[40%]'>
                    <div className="flex justify-between gap-20 text-[12px]">
                        <span>Associated Projects</span>
                        <div className='flex gap-2'>
                            <span className="text-[#DF9B2F80] cursor-pointer" onClick={() => { setIsModalOpen(true); setName("Clone") }}>Clone</span>
                            <span className='text-[#DF9B2F80] cursor-pointer' onClick={() => { setIsModalOpen(true); setName("Reasign To") }}>Reasign To</span>
                        </div>
                    </div>
                    <div>
                        <table class="min-w-full border border-gray-300">
                            <thead class="bg-gray-100 ">
                                <tr>
                                    <th class="border-b border-gray-300 px-4 py-2 text-left">Project Title</th>
                                    <th class="border-b border-gray-300 px-4 py-2 text-left">Project Type</th>
                                    <th class="border-b border-gray-300 px-4 py-2 text-left">Created On</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white">
                                    <td class="border-b border-gray-300 px-4 py-2 flex items-center gap-2">
                                        <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-500" />
                                        <span>Project Title</span>
                                    </td>
                                    <td class="border-b border-gray-300 px-4 py-2">Internal</td>
                                    <td class="border-b border-gray-300 px-4 py-2">DD/MM/YYYY</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal setOpenModal={setIsModalOpen} openModal={isModalOpen} name={name} />
        </div>
    )
}

export default Details