import { useAppDispatch } from "@/store/hooks"
import { fetchConversationMessages } from "@/store/slices/channelSlice"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const ChatAttachments = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const token = localStorage.getItem("token")
    const baseUrl = localStorage.getItem("baseUrl")

    const [attachments, setAttachments] = useState([])

    const fetchAttachments = async () => {
        try {
            const response = await dispatch(fetchConversationMessages({ baseUrl, token, id, per_page: 50, page: 1, param: "attachments_id_null" })).unwrap()
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    return (
        <div></div>
    )
}

export default ChatAttachments