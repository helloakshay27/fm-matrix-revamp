import {
    Briefcase,
    CircleAlert,
    Goal,
    Link2,
    Network,
    Paperclip,
    Star,
} from "lucide-react";
import { cardsTitle } from "../data/Data";
import Boards from "./Boards";

const BoardsSection = () => {
    return (
        <div className="h-[80%] mx-3 my-3 flex items-start gap-1">
            {cardsTitle.map((card) => {
                return (
                    <Boards
                        key={card.id}
                        add={card.add}
                        color={card.color}
                        count={0}
                        title={card.title}
                        className="flex items-start justify-start"
                    >
                        <div className="w-full h-max bg-white p-2 shadow-xl rounded-md text-sm flex flex-col space-y-3 mb-2">
                            <p>
                                <span className="text-blue-500">#1234</span> Latest VI my
                                workspace app playstore and appstore
                            </p>
                            <div className="flex items-center gap-2">
                                <Briefcase className="text-[#E95420]" size={15} />{" "}
                                <span className="text-[11px]">Internal Project</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-[11px]">Observers: </span>
                                <div className="flex items-center flex-wrap gap-1">
                                    <span className="h-6 w-6 flex items-center justify-center bg-blue-900 text-white rounded-full text-[8px] font-light">
                                        AK
                                    </span>
                                    <span className="h-6 w-6 flex items-center justify-center bg-orange-500 text-white rounded-full text-[8px] font-light">
                                        CB
                                    </span>
                                    <span className="h-6 w-6 flex items-center justify-center bg-green-600 text-white rounded-full text-[8px] font-light">
                                        AT
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center flex-wrap">
                                <span className="tag">
                                    <span>
                                        Web Pages
                                    </span>
                                </span>
                                <span className="tag">
                                    <span>
                                        FM Matrix
                                    </span>
                                </span>
                                <span className="tag">
                                    <span>
                                        Hisociety
                                    </span>
                                </span>
                                <span className="tag">
                                    <span>
                                        Hisociety
                                    </span>
                                </span>
                            </div>

                            <hr className="border border-gray-200" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Paperclip size={15} className="text-gray-300" />
                                    <Link2 size={15} className="text-gray-300" />
                                    <CircleAlert size={15} className="text-gray-300" />
                                    <Star size={15} className="text-gray-300" />
                                    <Network size={15} className="text-gray-300" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="flex items-center gap-1 text-[9px]">
                                        <Goal size={15} className="text-[#E95420]" />
                                        <span className="text-[9px] w-max">30 Nov</span>
                                    </span>
                                    <span className="h-6 w-6 flex items-center justify-center bg-green-600 text-white rounded-full text-[8px] font-light">
                                        AT
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Boards>
                );
            })}
        </div>
    );
};

export default BoardsSection;
