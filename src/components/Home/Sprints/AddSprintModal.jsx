import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";
import { useRef } from "react";
import Sprints from "./Modals/Sprint";

const AddSprintModal = ({ isSprintModalOpen, setIsSprintModalOpen }) => {
    const addTaskModalRef = useRef(null);

    useGSAP(() => {
        if (isSprintModalOpen) {
            gsap.fromTo(
                addTaskModalRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.5, ease: "power3.out" }
            );
        }
    }, [isSprintModalOpen]);

    const closeModal = () => {
        gsap.to(addTaskModalRef.current, {
            x: "100%",
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => setIsSprintModalOpen(false),
        });


    };

    return (

        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
            <div
                ref={addTaskModalRef}
                className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
            >
                <h3 className="text-[14px] font-medium text-center ">New Sprints</h3>
                <X
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={closeModal}
                />

                <hr className="border border-[#E95420] my-4" />

                <Sprints closeModal={closeModal} />
            </div>
        </div>
    );
}

export default AddSprintModal