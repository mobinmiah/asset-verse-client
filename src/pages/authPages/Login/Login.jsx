import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";

const Login = () => {
  const axios = useAxios();
  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passType, setPassType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Demo credentials
  const demoCredentials = {
    hr: {
      email: "hr@assetverse.com",
      password: "hr123456"
    },
    employee: {
      email: "employee@assetverse.com", 
      password: "emp123456"
    }
  };

  
  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const result = await loginUser(data.email, data.password);

      toast.success(`Welcome back, ${result.user.displayName || "User"}!`);

      const res = await axios.post("/jwt", {
        email: result.user.email,
      });

      localStorage.setItem("access-token", res.data.token);

      navigate(location?.state || "/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await googleLogin();
      
      toast.success(`Welcome, ${result.user.displayName}!`);

      const res = await axios.post("/jwt", {
        email: result.user.email,
      });

      localStorage.setItem("access-token", res.data.token);

      const userInfo = {
        name: result.user.displayName || "User",
        email: result.user.email,
        photo: result.user.photoURL || "",
        role: "employee",
        createdAt: new Date(),
        status: "active",
      };

      await axios.post("/users", userInfo);

      navigate(location?.state || "/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    setValue("email", demoCredentials[role].email);
    setValue("password", demoCredentials[role].password);
    toast.info(`Demo ${role} credentials filled. Click Login to continue.`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10 bg-linear-to-br from-primary/5 to-secondary/5">
      <Helmet>
        <title>Login - AssetVerse | Access Your Dashboard</title>
        <meta
          name="description"
          content="Login to your AssetVerse account to manage your organization's assets efficiently."
        />
      </Helmet>

      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl border border-base-300 rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Sign in to your AssetVerse account
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-info text-sm mb-2">
            🎯 Demo Accounts
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials("employee")}
              className="btn btn-outline btn-info btn-xs w-full"
            >
              Demo Employee Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              className={`input input-bordered w-full focus:input-primary ${
                errors.email ? "input-error" : ""
              }`}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={passType ? "text" : "password"}
                className={`input input-bordered w-full pr-12 focus:input-primary ${
                  errors.password ? "input-error" : ""
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                onClick={() => setPassType(!passType)}
                disabled={isLoading}
              >
                {passType ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="link link-primary text-sm hover:link-hover"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full hover:scale-105 transition-transform duration-200"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Social Login */}
        <div className="divider text-xs text-base-content/50">OR</div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="btn btn-outline w-full hover:scale-105 transition-transform duration-200"
        >
          <FaGoogle className="text-lg" />
          Continue with Google
        </button>

        {/* Register Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-base-content/70">Don't have an account?</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/register-hr"
              className="link text-primary font-medium text-sm hover:link-hover"
            >
              Register as HR Manager
            </Link>
            <span className="hidden sm:inline text-base-content/50">•</span>
            <Link
              to="/register-employee"
              className="link text-secondary font-medium text-sm hover:link-hover"
            >
              Register as Employee
            </Link>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 p-3 bg-base-200 rounded-lg">
          <p className="text-xs text-base-content/60 text-center">
            By signing in, you agree to our{" "}
            <Link to="/help" className="link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/help" className="link">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
