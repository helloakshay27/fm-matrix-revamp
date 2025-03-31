import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ChevronDown, ChevronDownCircle, MoreHorizontal } from "lucide-react"
import { useRef, useState } from "react";
import { Link } from "react-router-dom"

const ProjectDetails = () => {
    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);

    useGSAP(() => {
        gsap.set(firstContentRef.current, { height: "auto" });
        gsap.set(secondContentRef.current, { height: "auto" });
    }, []);

    const toggleFirstCollapse = () => {
        if (isFirstCollapsed) {
            gsap.to(firstContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(firstContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsFirstCollapsed(!isFirstCollapsed);
    };

    const toggleSecondCollapse = () => {
        if (isSecondCollapsed) {
            gsap.to(secondContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(secondContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsSecondCollapsed(!isSecondCollapsed);
    };

    return (
        <div className="m-4">
            <div className="px-4 pt-4">
                <Link to={"/projects"}>
                    <ArrowLeft size={30} color="#E95420" />
                </Link>

                <h2 className="text-[30px] mt-4">
                    Internal Products
                </h2>

                <div className="flex items-center justify-between my-3">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Kshitij Rasal</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-3">
                            01-01-2024  09:00 AM
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm text-white bg-[#9CE463]">
                            Active <ChevronDown />
                        </span>
                    </div>
                    <MoreHorizontal color="#E95420" className="cursor-pointer" />
                </div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div
                        className="font-[600] text-[16px] flex items-center gap-4"
                        onClick={toggleFirstCollapse}
                    >
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"
                                } transition-transform`}
                        />{" "}
                        Description
                    </div>
                    <p ref={firstContentRef} className="ms-12 mt-3 overflow-hidden">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                        explicabo ad facilis ratione consectetur repellat laboriosam, velit
                        est, nesciunt officia earum aperiam dolorum, error illo assumenda
                        dolore iure pariatur vel molestias nostrum eum quaerat eaque
                        corporis? Aut minus fugit fugiat eveniet, cumque non, esse
                        asperiores eos iure ipsa reiciendis nobis?
                    </p>
                </div>

                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div
                        className="font-[600] text-[16px] flex items-center gap-4"
                        onClick={toggleSecondCollapse}
                    >
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"
                                } transition-transform`}
                        />{" "}
                        Task Information
                    </div>

                    <div className="mt-3 overflow-hidden" ref={secondContentRef}>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Priority :
                                </div>
                                <div className="text-left text-[14px]">High</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-start gap-3">
                                <div className="text-right">Members :</div>
                                <div className="text-left flex items-center gap-2">
                                    <span className="h-6 px-2 flex items-center justify-center bg-gray-100 text-[12px] rounded-md">
                                        Dinesh Shinde
                                    </span>
                                    <span className="h-6 px-2 flex items-center justify-center bg-gray-100 text-[12px] rounded-md">
                                        Dinesh Shinde
                                    </span>
                                    <span className="h-6 px-2 flex items-center justify-center bg-gray-100 text-[12px] rounded-md">
                                        Dinesh Shinde
                                    </span>
                                </div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Project Owner :
                                </div>
                                <div className="text-left text-[14px]">Devesh Jain</div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    Start Date :
                                </div>
                                <div className="text-left text-[14px]">30/01/2023</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-start gap-3">
                                <div className="text-right">Tags :</div>
                                <div className="text-left flex items-center gap-2">
                                    <span className="h-6 px-2 flex items-center justify-center bg-gray-100 text-[12px] rounded-md">
                                        Rustomjee
                                    </span>
                                    <span className="h-6 px-2 flex items-center justify-center bg-gray-100 text-[12px] rounded-md">
                                        Dashboard
                                    </span>
                                </div>
                            </div>
                        </div>

                        <span className="border h-[1px] inline-block w-full my-4"></span>

                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[16px] font-semibold">
                                    End Date :
                                </div>
                                <div className="text-left text-[14px]"> - </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails