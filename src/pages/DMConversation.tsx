import { useParams } from "react-router-dom"

const DMConversation = () => {
    const { id } = useParams();
    return (
        <div className="p-3">DMConversation {id}</div>
    )
}

export default DMConversation