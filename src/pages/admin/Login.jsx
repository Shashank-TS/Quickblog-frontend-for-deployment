import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("Login");
  const [errordata, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  // function to validate the password
  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return "Password must include at least one letter.";
    }
    if (!/\d/.test(pwd)) {
      return "Password must include at least one number.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd)) {
      return "Password must include at least one special symbol.";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { username, password },
        {
          withCredentials: true,
        }
      );
      const data = await res.data;
      localStorage.setItem("userId", data.userId);
      toast.success("Login successful");
      console.log("login successful ", data);
      login();
      navigate("/admin");
    } catch (error) {
      console.error("error in login: ", error);
      setError(error.response.data || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { fullname, username, password },
        {
          withCredentials: true,
        }
      );
      const data = await res.data;
      console.log("Registration successful!", data);
      toast.success("Registration successful! You can now log in.");
      setState("Login");
    } catch (error) {
      console.error("error register: ", error);
      setError(error.response.data || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          {state === "Login" ? (
            <div className="w-full py-6 text-center">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">User</span> Login
              </h1>
              <p className="font-light">
                Enter your credentials to access the admin panel
              </p>
            </div>
          ) : (
            <div className="w-full py-6 text-center">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">User</span> Register
              </h1>
              <p className="font-light">
                Enter your Details to create an account
              </p>
            </div>
          )}
          <form
            onSubmit={state === "Login" ? handleLogin : handleRegister}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            {state === "Register" && (
              <div className="flex flex-col">
                <label> Full Name </label>
                <input
                  required
                  placeholder="your full name"
                  className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col">
              <label> Email </label>
              <input
                required
                placeholder="your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col relative mb-6"> 
              <label> Password </label>
              <input
                required
                placeholder="your password"
                className="border-b-2 border-gray-300 p-2 outline-none pr-10" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-1/2 -translate-y-1/2 mt-2 px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
              </button>
            </div>

            <p className="text-red-500 mb-3 text-sm">{errordata}</p>
            {state === "Login" ? (
              <button
                type="submit"
                className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            )}
            {state === "Login" ? (
              <div className="text-sm mt-4 text-center">
                <p>
                  Don't have an account ?{" "}
                  <span
                    onClick={() => {
                      setState("Register");
                      setError("");
                      setPassword("");
                    }}
                    className="text-primary cursor-pointer"
                  >
                    create account
                  </span>
                </p>
              </div>
            ) : (
              <div className="text-sm mt-4 text-center">
                <p>
                  Already a user ?{" "}
                  <span
                    onClick={() => {
                      setState("Login");
                      setError("");
                      setPassword("");
                    }}
                    className="text-primary cursor-pointer"
                  >
                    login here
                  </span>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;