import React, { useState, useEffect } from 'react'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchProjectTeam } from '../../../redux/slices/projectSlice';

const TeamDetails = () => {
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const dispatch = useDispatch();
  const { fetchProjectTeam: projectTeam } = useSelector(state => state.fetchProjectTeam)

  useEffect(() => {
    try {
      let response = dispatch(fetchProjectTeam({ token, id }));
      setData(response);
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, id])

  return (
    <div className="flex flex-col gap-5 p-10 m-10 text-[14px] bg-[#D9D9D933] h-full">
      <div className="flex justify-between gap-10">
        <div className="flex justify-start gap-4 w-2/3">
          <span className="rounded-full bg-[#D5DBDB] w-[65px] h-[65px] flex justify-center items-center text-[25px]">{projectTeam?.name?.charAt(0)}</span>
          <div className='flex flex-col gap-3'>
            <span>{projectTeam?.name}</span>
            <div className="flex justify-between gap-10">
              <span>{`Total Team Members : ${projectTeam?.project_team_members?.length}`}</span>
              <span>{`Associated Projects : 1`}</span>
            </div>
          </div>
        </div>
        <div>
          <Link to="/setup/project-teams"> <span className="cursor-pointer"><KeyboardArrowLeftOutlinedIcon style={{ fontSize: "medium" }} />Back</span></Link>
        </div>
      </div>
      <div className="flex justify-between gap-3">
        <div className='flex flex-col gap-10 w-1/2'>

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
          <div className="flex justify-center items-center gap-20 h-[200px] bg-[#FFFFFF66]">
            <div className="flex flex-col gap-2">
              <h1 className="block mb-4 font-bold">Team Lead</h1>
              {
                <span>{projectTeam?.team_lead?.name}</span>

              }
            </div>
            <span className='border-x-2 border-gray-300 h-[80px]'></span>

            <div className="flex flex-col gap-2">
              <h1 className="block mb-4 font-bold">Team Members</h1>
              {
                projectTeam?.project_team_members?.map((member) => (
                  <span>{member?.user?.name}</span>
                ))
              }
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3 w-[40%]'>
          <div className="flex justify-between gap-20 text-[12px]">
            <span>Associated Projects</span>
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
                    <span>{projectTeam.project_management?.name}</span>
                  </td>
                  <td class="border-b border-gray-300 px-4 py-2">Internal</td>
                  <td class="border-b border-gray-300 px-4 py-2">DD/MM/YYYY</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
};

export default TeamDetails;