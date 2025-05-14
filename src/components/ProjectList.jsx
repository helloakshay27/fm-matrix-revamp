import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChartNoAxesGantt, Filter, List, MoreHorizontal, Plus } from "lucide-react";
import ProjectTable from "./Projects/Table";

const ProjectList = ({ tasks, setIsEdit }) => {
    const dropdownRefs = useRef({});
    const menuRef = useRef(null);

    const [openMenu, setOpenMenu] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [taskStatusMap, setTaskStatusMap] = useState(() => {
        return tasks.reduce((acc, task) => {
            acc[task.id] = "Active";
            return acc;
        }, {});
    });

    const navigate = useNavigate();

    const toggleDropdown = (taskId) => {
        setOpenDropdown(openDropdown === taskId ? null : taskId);
    };

    const handleStatusChange = (taskId, status) => {
        setTaskStatusMap((prev) => ({
            ...prev,
            [taskId]: status,
        }));
        setOpenDropdown(null);
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (action, id) => {
        if (action === "Edit") {
            setIsEdit(true)
        }
        if (action === 'Open') {
            navigate(`${id}`)
        }
        setOpenMenu(null);
    };

    return (
            <ProjectTable />
    )
}

export default ProjectList