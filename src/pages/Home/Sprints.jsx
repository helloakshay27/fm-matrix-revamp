import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import SprintBoardSection from "../../components/Home/Sprints/SprintBoardSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/slices/projectSlice";
import { fetchTasksOfProject } from "../../redux/slices/taskSlice";
import { useNavigate } from "react-router-dom";

const Sprints = () => {
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false);

  const navigate = useNavigate()

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const fetchProject = useSelector((state) => state.fetchProjects || []);

  useEffect(() => {
    if (!fetchProject?.fetchProjects?.length) {
      dispatch(fetchProjects({ token }));
    }
  }, [dispatch, fetchProject, token]);

  // ⬇️ Automatically select and fetch the first project on page load
  useEffect(() => {
    if (
      !hasFetchedInitial &&
      fetchProject?.fetchProjects?.length > 0 &&
      !selectedProject?.id
    ) {
      const firstProject = fetchProject.fetchProjects[0];
      setSelectedProject(firstProject);
      dispatch(fetchTasksOfProject({ token, id: firstProject.id }));
      setHasFetchedInitial(true);
    }
  }, [fetchProject, selectedProject, hasFetchedInitial, dispatch, token]);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (project) => {
    if (selectedProject?.title === project.title) {
      setIsOpen(false);
      return;
    }
    setSelectedProject(project);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearch = () => {
    if (selectedProject?.id) {
      dispatch(fetchTasksOfProject({ token, id: selectedProject.id }));
    }
  };

  const filteredProjects = fetchProject?.fetchProjects?.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mx-6 mt-3 mb-2">
        <h3 className="text-base">Sprint Planning</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 text-[13px] text-[#E95420] cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft size={13} color="#000" />
            Back
          </div>
        </div>
      </div>
      <hr className="border border-gray-200" />

      <div className="flex items-center justify-end mx-4 mt-3 mb-2 gap-2">
        <div className="w-[20rem] relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between select-none items-center w-full border px-4 py-2 cursor-pointer text-sm bg-white"
          >
            <span>{selectedProject?.title || "Select project"}</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md z-10 mt-2 max-h-60 overflow-y-auto">
              <div className="flex items-center border px-3 py-2 sticky top-0 bg-white z-20">
                <Search className="w-4 h-4 text-red-600 mr-2" />
                <input
                  type="text"
                  placeholder="Search project..."
                  className="w-full text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              <ul className="text-sm divide-y">
                {filteredProjects?.length ? (
                  filteredProjects.map((project) => (
                    <li
                      key={project.id}
                      className="cursor-pointer px-3 py-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={() => handleSelect(project)}
                    >
                      {project.title}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500">No projects found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={!selectedProject?.id}
          className="bg-[#C72030] text-white rounded-none p-2 text-[14px] w-32 disabled:bg-gray-400"
        >
          Search
        </button>
      </div>

      <SprintBoardSection selectedProject={selectedProject} />
    </div>
  );
};

export default Sprints;
