import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchInternalUser } from "../../../redux/slices/userSlice";

const Warning = ({ message, setWarningOpen }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-max pb-[7rem] bg-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4  shadow-md z-50">
        <div className="h-full flex flex-col gap-5 justify-between">
          <div className="flex justify-end">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => setWarningOpen(false)}
            />
          </div>

          <p>{message}</p>

          <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
            <button className="border border-[#C72030] text-sm px-8 py-2">
              Yes
            </button>
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={() => setWarningOpen(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Assign = ({ setOpenModal, setWarningOpen, users }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
      <div className="w-[560px] h-max pb-[7rem] bg-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] p-4 shadow-md z-50">
        <div className="h-full flex flex-col gap-5 justify-between">
          <div className="flex justify-end">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => setOpenModal(false)}
            />
          </div>

          <SelectBox
            label="Select User"
            placeholder="Select User"
            options={users?.map((user) => ({
              value: user.id,
              label: `${user.firstname} ${user.lastname}`,
            }))}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-[#D5DBDB] h-[90px] flex justify-center items-center gap-4">
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={() => {
                setWarningOpen(true);
                setOpenModal(false);
              }}
            >
              Save
            </button>
            <button
              className="border border-[#C72030] text-sm px-8 py-2"
              onClick={() => setOpenModal(false)}
            >
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

  const { fetchInternalUser: users } = useSelector(
    (state) => state.fetchInternalUser
  );

  useEffect(() => {
    dispatch(fetchInternalUser({ token }));
  }, [dispatch]);

  const [warningOpen, setWarningOpen] = useState(false);
  const message =
    name === "Clone"
      ? "Are you sure you want to clone and assign all the projects to the selected user?\nYou can view the associated projects by tapping on user details."
      : "Are you sure you want reassign selected projects to this user?";

  return (
    <>
      {openModal && (
        <Assign
          setOpenModal={setOpenModal}
          openModal={openModal}
          users={users}
          setWarningOpen={setWarningOpen}
        />
      )}
      {warningOpen && (
        <Warning
          setOpenModal={setOpenModal}
          openModal={openModal}
          message={message}
          setWarningOpen={setWarningOpen}
          warningOpen={warningOpen}
        />
      )}
    </>
  );
};

export default Modal;
