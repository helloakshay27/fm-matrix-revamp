import { useAppSelector } from "@/store/hooks"

const ProjectManagementKanban = () => {
    const { data } = useAppSelector(state => state.filterProjects)
    return (
        <div>ProjectManagementKanban</div>
    )
}

export default ProjectManagementKanban