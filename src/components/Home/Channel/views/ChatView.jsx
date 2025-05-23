const ChatView = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
       <div className="flex-1 w-full bg-[#F9F9F9] px-6 py-4 overflow-y-auto max-h-[calc(100vh-160px)]">
                <div className="text-xs  mb-1 ml-14">May 10, 17:56</div>
                <div className="mb-6 flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#5986FF] text-white text-sm flex items-center justify-center">
                        A
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-2 text-sm shadow">
                        Please complete that today
                    </div>
                </div>
            </div>
            <div className="w-[800px] mx-auto bg-white  px-6 py-6 flex items-center space-x-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Type here and hit enter"
                        className="w-full bg-[#F9F9F9] rounded-full px-4 py-4 pr-10 text-sm focus:outline-none"
                    />
                    <label
                        htmlFor="file-upload"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                        aria-label="Attach file"
                    >
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.7596 5.12139L13.7596 14.5984C13.7596 16.4196 12.2845 17.8947 10.4633 17.8947C8.64203 17.8947 7.16692 16.4196 7.16692 14.5984L7.16692 4.2973C7.16692 3.7509 7.38397 3.22687 7.77034 2.84051C8.1567 2.45414 8.68073 2.23709 9.22713 2.23709C9.77353 2.23709 10.2976 2.45414 10.6839 2.84051C11.0703 3.22687 11.2873 3.7509 11.2873 4.2973L11.2873 12.9502C11.2873 13.4035 10.9165 13.7743 10.4633 13.7743C10.01 13.7743 9.63918 13.4035 9.63918 12.9502L9.63918 5.12139L8.40305 5.12139L8.40305 12.9502C8.40305 13.4966 8.6201 14.0206 9.00647 14.407C9.39283 14.7934 9.91686 15.0104 10.4633 15.0104C11.0097 15.0104 11.5337 14.7934 11.9201 14.407C12.3064 14.0206 12.5235 13.4966 12.5235 12.9502L12.5235 4.2973C12.5235 2.47607 11.0484 1.00096 9.22713 1.00096C7.4059 1.00096 5.93079 2.47607 5.93079 4.2973L5.93079 14.5984C5.93079 17.1036 7.95804 19.1309 10.4633 19.1309C12.9685 19.1309 14.9957 17.1036 14.9957 14.5984L14.9957 5.12139L13.7596 5.12139Z" fill="black" />
                        </svg>

                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            // handle file upload here
                            console.log(e.target.files);
                        }}
                    />
                </div>
                <button className="text-gray-500 text-xl">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.25 28.3332V19.8332L15.5833 16.9998L4.25 14.1665V5.6665L31.1667 16.9998L4.25 28.3332Z" fill="black" fillOpacity="0.2" />
                    </svg>

                </button>
            </div>
    </div>
  );
}

export default ChatView;
