import React, { useState } from 'react'
import IssuesTable from '../../components/Home/Issues/Table'
import TaskActions from '../../components/Home/TaskActions'

const Issues = ({ setIsSidebarOpen }) => {
    const [selectedType, setSelectedType] = useState("List")
    return (
        <>
            <TaskActions
                setIsSidebarOpen={setIsSidebarOpen}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={"Issues"}
                context="Issues"
            />
            <IssuesTable />
        </>
    )
}

export default Issues