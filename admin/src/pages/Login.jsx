import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

import { userRequest } from '../utils/requestMethods';
import './style.css'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await userRequest.post("/auth/login", { username, password })
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      window.location.reload();
    } catch (err) {
      setError(err?.response?.data.message)
    }
  }

  return (
    <div className='login'>
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          className="lInput border-2 py-5 px-4 text-lg rounded-lg outline-none"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          className="lInput border-2 py-5 px-4 text-lg rounded-lg outline-none"
        />
        <button onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <div className='text-center font-medium text-[#f00] text-lg'>
          {error}
        </div>}
      </div>
    </div>
  )
}

export default Login