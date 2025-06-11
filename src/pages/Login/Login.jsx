import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }
        try {
            const response = await axios.post("https://api-tasks.lockated.com/users/signin.json", {
                user: {
                    email,
                    password
                }
            });
            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success("Login successful!");
                setTimeout(() => navigate("/projects"), 500);
            }
        } catch (error) {
            const errMsg = error.response?.data?.error || "Login failed";
            setError(errMsg);
            toast.error(errMsg);
        }
    }

    return (
        <div className="flex justify-start w-screen h-screen">
            <div className="w-1/3 bg-[#E9E9E9]"></div>
            <div className="flex justify-center items-center w-2/3">
                <div className="flex flex-col justify-center align-center gap-8">
                    <div className="flex justify-center items-center mb-8">
                        <img src="LockatedLogo.png" alt="Logo" className="w-[170px]" />
                    </div>
                    <div className="font-[600] text-[22px]">Login to access Project Management</div>
                    <div className="flex flex-col justify-start gap-2">
                        <label className="font-[600] text-[16px]">User Name</label>
                        <input
                            type="email"
                            className="w-[420px] h-[48px] bg-[#D9D9D957] p-2"
                            placeholder='Enter user name or id'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                        <label className="font-[600] text-[16px]">Password</label>
                        <input
                            type="password"
                            className="w-[420px] h-[48px] bg-[#D9D9D957] p-2"
                            placeholder='Enter Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        {error && <p className="text-red-500 align-center text-[12px]">{error}</p>}
                    </div>
                    <button
                        className="w-[420px] h-[48px] bg-[#C72030] text-white text-[20px] font-[400]"
                        onClick={handleLogin}
                    >
                        LOGIN
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login