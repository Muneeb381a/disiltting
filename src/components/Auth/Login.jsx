import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // try {
    //   const { data } = await api.post("/login", { username, password, role });
    //   localStorage.setItem("token", data.token);
    //   localStorage.setItem("role", data.role);
    //   navigate(`/${data.role}`);
    // } catch (err) {
    //   setError("Invalid credentials. Please try again.");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 transform transition-all duration-300 ease-in-out">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg border border-white/20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                WASA
              </span>
            </h1>
            <p className="text-gray-600 text-sm">
                Water and Sanitation Agency Faisalabad
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  role === "admin"
                    ? "bg-emerald-100 border-2 border-emerald-500"
                    : "bg-gray-100 border-2 border-transparent hover:border-gray-300"
                }`}
              >
                <ShieldCheckIcon
                  className={`h-5 w-5 ${
                    role === "admin" ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span
                  className={
                    role === "admin"
                      ? "text-emerald-700 font-medium"
                      : "text-gray-700"
                  }
                >
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("supervisor")}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  role === "supervisor"
                    ? "bg-cyan-100 border-2 border-cyan-500"
                    : "bg-gray-100 border-2 border-transparent hover:border-gray-300"
                }`}
              >
                <UserGroupIcon
                  className={`h-5 w-5 ${
                    role === "supervisor" ? "text-cyan-600" : "text-gray-500"
                  }`}
                />
                <span
                  className={
                    role === "supervisor"
                      ? "text-cyan-700 font-medium"
                      : "text-gray-700"
                  }
                >
                  Supervisor
                </span>
              </button>
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative group">
                <UserCircleIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center space-x-2">
                <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="text-center text-white/90 text-sm">
          <p>Need help? Contact support@wasa.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
