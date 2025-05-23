
const SharedView = () => {
    const files = ['Product BRD.xls', 'BRD.xls'];

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold">File Name</span>
                <button className="bg-[#C72030] rounded-sm text-white px-12 py-2 text-sm">Add</button>
            </div>

            <div className="border-t border-b">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 py-4 border-b last:border-b-0"
                    >
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H7.175C7.44167 0 7.696 0.0500001 7.938 0.15C8.18 0.25 8.39233 0.391666 8.575 0.575L10 2H18C18.55 2 19.021 2.196 19.413 2.588C19.805 2.98 20.0007 3.45067 20 4V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2Z" fill="black" />
                        </svg>
                        <a
                            href="#"
                            className="text-blue-700 text-sm hover:underline"
                        >
                            {file}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SharedView
