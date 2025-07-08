import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import Details from "./Modals/Details.jsx";
import Milestones from "./Modals/Milestone.jsx";
import CloseIcon from '@mui/icons-material/Close';
import Modal from "../../Setup/ProjectTags/Modal.jsx";
import SelectBox from "../../SelectBox.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/slices/userSlice.js";
import MultiSelectBox from "../../MultiSelectBox.jsx";
import { createProjectTeam, fetchProjectTeams, resetProjectCreateResponse, resetSuccess } from "../../../redux/slices/projectSlice.js";
import toast from "react-hot-toast";

const CreateNewTeam = ({ setOpenModal }) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
  const { loading, success } = useSelector((state) => state.createProjectTeam);

  const [formData, setFormData] = useState({
    teamName: "",
    teamLead: "",
    teamMembers: [],
  });

  useEffect(() => {
    dispatch(fetchUsers({ token }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.teamName) {
      toast.dismiss();
      toast.error("Team name is required");
      return;
    } else if (!formData.teamLead) {
      toast.dismiss();
      toast.error("Team lead is required");
      return;
    } else if (!formData.teamMembers.length) {
      toast.dismiss();
      toast.error("Team members are required");
      return;
    }

    const payload = {
      project_team: {
        name: formData.teamName,
        team_lead_id: formData.teamLead,
        user_ids: formData.teamMembers.map((member) => member.value),
      },
    };


    dispatch(createProjectTeam({ token, payload }));
  };

  useEffect(() => {
    if (success) {
      toast.success("Project team created successfully", {
        iconTheme: {
          primary: 'green', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
      dispatch(fetchProjectTeams({ token }))
      setOpenModal(false);
      dispatch(resetSuccess());
    }
  }, [success]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-[420px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[#C0C0C0]">
        {/* Close Icon */}
        <div className="flex justify-end p-4">
          <CloseIcon className="cursor-pointer" onClick={() => setOpenModal(false)} />
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="px-6">
            <label className="block text-[16px] text-[#1B1B1B] mb-1">
              New Team
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="teamName"
              type="text"
              placeholder="Team Name"
              className="border border-[#C0C0C0] w-full px-3 py-2 text-[#1B1B1B] text-[13px]"
              value={formData.teamName}
              onChange={handleChange}
            />
          </div>
          <div className="px-6">
            <label className="block text-[16px] text-[#1B1B1B] mb-1">
              Team Lead<span className="text-red-500 ml-1">*</span>
            </label>
            <SelectBox
              placeholder="Select team Lead"
              value={formData.teamLead}
              onChange={(value) => handleSelectChange("teamLead", value)}
              options={users.map((user) => ({
                label: `${user.firstname} ${user.lastname}`,
                value: user.id,
              }))}
            />
          </div>
          <div className="px-6">
            <label className="block text-[16px] text-[#1B1B1B] mb-1">
              Team Members<span className="text-red-500 ml-1">*</span>
            </label>
            <MultiSelectBox
              placeholder="Select Team Members"
              value={formData.teamMembers}
              onChange={(value) => handleSelectChange("teamMembers", value)}
              options={users.map((user) => ({
                label: `${user.firstname} ${user.lastname}`,
                value: user.id,
              }))}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            Create
          </button>
          <button
            className="border border-[#C72030] text-[#1B1B1B] text-[16px] px-8 py-2"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const AddProjectModal = ({ isModalOpen, setIsModalOpen, projectname = "New Project", endText = "Next", isEdit, editData, templateDetails }) => {
  const dispatch = useDispatch();
  const addTaskModalRef = useRef(null);
  const [tab, setTab] = useState("Details");
  const [openTagModal, setOpenTagModal] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);

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
    dispatch(resetProjectCreateResponse())
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

          {
            !isEdit && (
              <>
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
              </>
            )
          }


          {tab == "Details" && <Details setTab={setTab} setOpenTagModal={setOpenTagModal} setOpenTeamModal={setOpenTeamModal} isEdit={isEdit} endText={isEdit ? "Save" : "Save & Next"} templateDetails={templateDetails} />}
          {tab == "Milestone" && <Milestones closeModal={() => setIsModalOpen(false)} />}
        </div>

      </div>
      {openTeamModal && (
        <CreateNewTeam openModal={openTeamModal} setOpenModal={setOpenTeamModal} />
      )}
      {
        openTagModal && (
          <Modal open={openTagModal} setOpenModal={setOpenTagModal} isEdit={false} />
        )
      }
    </div>
  );
};

export default AddProjectModal;
