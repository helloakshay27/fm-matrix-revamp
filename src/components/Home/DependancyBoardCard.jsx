import { Flag, GripHorizontal, Timer, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";

const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const DependancyBoardCard = ({ task, draggable = true, toggleSubCard }) => {
    const [countdown, setCountdown] = useState("");

    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: "TASK",
            item: { id: task.id, fromStatus: task.section },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [task.id, task.section]
    );

    const cardRef = draggable ? dragRef : null;

    useEffect(() => {
        if (!task?.target_date) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(task.target_date);
            const diff = end - now;

            if (diff <= 0) {
                setCountdown("Expired");
                clearInterval(interval);
            } else {
                setCountdown(formatCountdown(diff));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [task.target_date]);

    return (
        <div
            ref={cardRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`w-full h-max bg-white p-2 shadow-xl text-xs flex flex-col space-y-2 mb-2 ${!draggable ? "cursor-default opacity-90" : ""
                }`}
        >
            <div className="flex items-center justify-center my-1">
                <GripHorizontal size={12} className={draggable ? "cursor-grab" : "cursor-not-allowed"} />
            </div>
            <p className="mb-2 truncate">
                <span className="text-blue-500">{task.id}</span> {task.title}
            </p>
            <div className="flex items-center gap-1">
                <Flag className="text-[#C72030] flex-shrink-0" size={14} />
                <span className="text-[10px] truncate">{task.milestone}</span>
            </div>
            <div className="flex items-start gap-1">
                <User2 className="text-[#C72030] flex-shrink-0" size={14} />
                <span className="text-[10px] truncate">{task?.responsible_person?.name}</span>
            </div>
            <div className="flex items-start gap-1">
                <Timer className="text-[#029464] flex-shrink-0" size={14} />
                <span className="text-[10px] text-[#029464] truncate">{countdown}</span>
            </div>

            <hr className="border border-gray-200 my-2" />

            <div className="flex items-center justify-end gap-2">
                <span
                    className="flex items-center cursor-pointer"
                    onClick={toggleSubCard}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3.49967 5.25033H6.99967M2.33301 2.91699H4.66634M3.49967 2.91699V9.33366C3.49967 9.48837 3.56113 9.63674 3.67053 9.74614C3.77993 9.85553 3.9283 9.91699 4.08301 9.91699H6.99967M6.99967 4.66699C6.99967 4.51228 7.06113 4.36391 7.17053 4.25451C7.27993 4.14512 7.4283 4.08366 7.58301 4.08366H11.083C11.2377 4.08366 11.3861 4.14512 11.4955 4.25451C11.6049 4.36391 11.6663 4.51228 11.6663 4.66699V5.83366C11.6663 5.98837 11.6049 6.13674 11.4955 6.24614C11.3861 6.35553 11.2377 6.41699 11.083 6.41699H7.58301C7.4283 6.41699 7.27993 6.35553 7.17053 6.24614C7.06113 6.13674 6.99967 5.98837 6.99967 5.83366V4.66699ZM6.99967 9.33366C6.99967 9.17895 7.06113 9.03058 7.17053 8.92118C7.27993 8.81178 7.4283 8.75033 7.58301 8.75033H11.083C11.2377 8.75033 11.3861 8.81178 11.4955 8.92118C11.6049 9.03058 11.6663 9.17895 11.6663 9.33366V10.5003C11.6663 10.655 11.6049 10.8034 11.4955 10.9128C11.3861 11.0222 11.2377 11.0837 11.083 11.0837H7.58301C7.4283 11.0837 7.27993 11.0222 7.17053 10.9128C7.06113 10.8034 6.99967 10.655 6.99967 10.5003V9.33366Z"
                            stroke={`${task.sub_tasks_managements?.length > 0 ? "#DA2400" : "#323232"}`}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    {task.sub_tasks_managements?.length}
                </span>
                <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-[8px] cursor-pointer truncate">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.1337 4.54779C12.7408 5.81752 12.8561 7.26713 12.4573 8.61685C12.0584 9.96656 11.1737 11.1207 9.97399 11.8565C8.77424 12.5923 7.34447 12.8576 5.96061 12.6012C4.57674 12.3448 3.3369 11.5849 2.48037 10.4682C1.62384 9.35143 1.21134 7.95697 1.32248 6.55396C1.43361 5.15095 2.06052 3.83883 3.08219 2.87085C4.10386 1.90287 5.44788 1.34765 6.85485 1.31234C8.26182 1.27703 9.63199 1.76414 10.7009 2.67966L11.9407 1.43935C12.0228 1.35726 12.1341 1.31114 12.2502 1.31114C12.3663 1.31114 12.4777 1.35726 12.5598 1.43935C12.6419 1.52144 12.688 1.63278 12.688 1.74888C12.688 1.86498 12.6419 1.97632 12.5598 2.05841L7.30976 7.30841C7.22767 7.3905 7.11632 7.43662 7.00023 7.43662C6.88413 7.43662 6.77279 7.3905 6.6907 7.30841C6.6086 7.22632 6.56248 7.11498 6.56248 6.99888C6.56248 6.88278 6.6086 6.77144 6.6907 6.68935L8.20663 5.17341C7.79579 4.9017 7.30528 4.77659 6.81449 4.81835C6.3237 4.86011 5.86137 5.06628 5.50234 5.40349C5.14331 5.74071 4.9086 6.18922 4.8362 6.67643C4.76379 7.16364 4.85794 7.66103 5.1034 8.08807C5.34886 8.51512 5.73126 8.84682 6.18869 9.02949C6.64613 9.21216 7.15183 9.23509 7.62392 9.09459C8.09602 8.95409 8.50688 8.65836 8.78999 8.2553C9.0731 7.85223 9.21189 7.36541 9.1839 6.87365C9.18067 6.81619 9.18878 6.75866 9.20778 6.70435C9.22679 6.65003 9.2563 6.59999 9.29464 6.55708C9.33298 6.51417 9.3794 6.47923 9.43124 6.45426C9.48308 6.42928 9.53934 6.41477 9.59679 6.41154C9.71282 6.40501 9.82669 6.44484 9.91336 6.52228C9.95627 6.56062 9.99121 6.60703 10.0162 6.65888C10.0412 6.71072 10.0557 6.76697 10.0589 6.82443C10.0988 7.52048 9.89998 8.2093 9.49534 8.77706C9.0907 9.34481 8.50445 9.7575 7.83348 9.94693C7.16251 10.1364 6.447 10.0912 5.80519 9.81884C5.16338 9.54651 4.63371 9.06335 4.3037 8.4492C3.9737 7.83506 3.86313 7.12669 3.99026 6.44119C4.11739 5.75569 4.47462 5.13408 5.00289 4.67911C5.53117 4.22413 6.19888 3.96303 6.89566 3.93896C7.59243 3.91488 8.27657 4.12927 8.83499 4.54669L10.0791 3.30255C9.16738 2.54557 8.0081 2.15212 6.82394 2.1978C5.63979 2.24347 4.51425 2.72503 3.66352 3.54999C2.81278 4.37496 2.29683 5.48515 2.21477 6.66734C2.1327 7.84954 2.4903 9.02037 3.21889 9.95497C3.94748 10.8896 4.99568 11.522 6.16217 11.7309C7.32866 11.9397 8.53119 11.7102 9.53878 11.0865C10.5464 10.4627 11.288 9.48872 11.6212 8.35149C11.9544 7.21426 11.8557 5.99402 11.3441 4.92513C11.294 4.82041 11.2876 4.7001 11.3263 4.59067C11.365 4.48124 11.4455 4.39165 11.5502 4.34161C11.6549 4.29158 11.7753 4.28519 11.8847 4.32385C11.9941 4.36251 12.0837 4.44307 12.1337 4.54779Z"
                                fill="#C72030"
                            />
                        </svg>
                        <span className="text-[8px] w-max">30 Nov</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DependancyBoardCard;
