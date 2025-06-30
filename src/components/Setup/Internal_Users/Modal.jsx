import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchInternalUser, fetchInternalUserDetails, reassignProjects } from "../../../redux/slices/userSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Warning = ({ message, setWarningOpen, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-max pb-[7rem] bg-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4 shadow-md z-50">
        <div className="h-full flex flex-col gap-5 justify-between">
          <div className="flex justify-end">
            <CloseIcon className="cursor-pointer" onClick={() => setWarningOpen(false)} />
          </div>

          <p>{message}</p>

          <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={onConfirm}>
              Yes
            </button>
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={() => setWarningOpen(false)}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Assign = ({ setOpenModal, setWarningOpen, users, setSelectedUserId, selectedUserId }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-max pb-[7rem] bg-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4 shadow-md z-50">
        <div className="h-full flex flex-col gap-5 justify-between">
          <div className="flex justify-end">
            <CloseIcon className="cursor-pointer" onClick={() => setOpenModal(false)} />
          </div>

          <SelectBox
            label="Select User"
            placeholder="Select User"
            value={selectedUserId}
            options={users?.map((user) => ({
              value: user.id,
              label: `${user.firstname} ${user.lastname}`,
            }))}
            onChange={(val) => setSelectedUserId(val)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={() => {
                setWarningOpen(true);
                setOpenModal(false);
              }}>
              Save
            </button>
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={() => setOpenModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ setOpenModal, openModal, name }) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { id } = useParams();

  const { fetchInternalUser: users } = useSelector((state) => state.fetchInternalUser);

  const [warningOpen, setWarningOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const message =
    name === "Clone"
      ? "Are you sure you want to clone and assign all the projects to the selected user?\nYou can view the associated projects by tapping on user details."
      : "Are you sure you want to reassign selected projects to this user?";

  useEffect(() => {
    dispatch(fetchInternalUser({ token }));
  }, [dispatch]);

  const handleConfirm = async () => {
    if (name === "Reasign To" && selectedUserId) {
      try {
        const payload = { user_id: selectedUserId };
        await dispatch(reassignProjects({ token, id, payload })).unwrap();
        await dispatch(fetchInternalUserDetails({ token, id }));
        toast.success("Projects reassigned successfully");
        setSelectedUserId(null); // ✅ clear dropdown on success
      } catch (err) {
        console.error(err);
        toast.error("Failed to reassign projects");
      }
    }
    setWarningOpen(false);
  };

  return (
    <>
      {openModal && (
        <Assign
          setOpenModal={setOpenModal}
          openModal={openModal}
          users={users}
          selectedUserId={selectedUserId}
          setWarningOpen={setWarningOpen}
          setSelectedUserId={setSelectedUserId}
        />
      )}
      {warningOpen && (
        <Warning
          setWarningOpen={setWarningOpen}
          message={message}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default Modal;
