import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginimage.jpg";
import UserContext from "../context/UserContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);

  const { registerUser, loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      alert("Please fill all required fields.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return false;
    }
    if (!isLogin && formData.name.trim().length < 2) {
      alert("Name must be at least 2 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const success = await loginUser(formData.email, formData.password);
        if (success) navigate("/");
        else alert("Login failed. Check your credentials.");
      } else {
        const success = await registerUser(formData);
        if (success) navigate("/");
        else alert("Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-16 gap-6 bg-gray-50">
      {/* Left Image Section */}
      <div className="md:flex-1 w-full rounded-md">
        <img
          src={loginImage}
          alt="Auth"
          className="w-full h-64 md:h-full object-cover rounded-l-md"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 md:p-10">
          <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  required
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>

            <p className="mt-4 text-sm text-center text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-red-600 hover:underline cursor-pointer"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
