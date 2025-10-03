const Chats = () => {
    return (
        <div
            className="flex-1 w-full bg-[#F9F9F9] overflow-y-auto max-h-[calc(100vh-160px)]"
        >
            {["Hii"].reverse().map((message, index) => (
                <div
                    key={index}
                    className={`mb-6 flex flex-col items-start`}
                >
                    <div
                        className={`text-xs text-gray-500 mb-2 ml-12`}
                    >
                        14 Aug, 05:54 pm
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#F2EEE9] text-[#C72030] text-sm flex items-center justify-center mt-[2px]">
                            U
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-2 text-sm shadow max-w-xs">
                            {message}
                        </div>
                        {/* {message.user_id === currentUser.id && (
                            <div className="w-8 h-8 rounded-full bg-[#5986FF] text-white text-sm flex items-center justify-center">
                                {(message.user_name || "U")[0].toUpperCase()}
                            </div>
                        )} */}
                    </div>
                </div>
            ))}
            {/* <div ref={bottomRef} className="h-0" /> */}
        </div>
    )
}

export default Chats