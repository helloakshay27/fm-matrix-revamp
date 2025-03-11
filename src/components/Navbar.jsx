import { ChevronDown } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="w-screen shadow-md h-[66px]">
            <div className="flex items-center justify-between py-4 px-8">
                <div className="flex items-center gap-10 w-2/5">
                    <Link to={"/"}>
                        <img src="/logo.webp" alt="Lockated" className="w-[159px] h-[35px]" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Links href="/">Home</Links>
                        <Links href="/dashboard">Dashboard</Links>
                        <Links href="/setup">Setup</Links>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 cursor-pointer">
                            <span>Located</span> <ChevronDown size={15} />
                        </div>
                        <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                            A
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Links = ({ href, children }) => {
    return (
        <NavLink
            to={href}
            className={({ isActive }) =>
                `px-4 py-2 text-[14px] ${isActive ? "text-white bg-[#E95420] rounded-md" : ""
                }`
            }
        >
            <span>{children}</span>
        </NavLink>
    );
};

export default Navbar;
