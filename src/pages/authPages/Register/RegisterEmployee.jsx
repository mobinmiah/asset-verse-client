import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";

const RegisterEmployee = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser, updateUserProfile } = useAuth();

  const [passType, setPassType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password);

      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL,
      });

      const employeeInfo = {
        name: data.name,
        email: data.email,
        photo: data.photoURL,
        role: "employee",
        dateOfBirth: data.dateOfBirth,
        createdAt: new Date(),
      };

      await axios.post("/users", employeeInfo);

      toast.success("Welcome to AssetVerse 🎉");
      navigate(location?.state || "/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10 bg-linear-to-br from-primary/5 to-secondary/5">
      <Helmet>
        <title>Register Employee - AssetVerse</title>
      </Helmet>

      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl border border-base-300 rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Register as Employee
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Create your employee account
          </p>
          <p className=" text-base-content/50 mt-4">
            or Register as{" "}
            <Link to="/register-hr" className="link text-primary">
              HR
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
                  message: "Invalid email address",
                },
              })}
              type="email"
              className={`input input-bordered w-full ${
                errors.email ? "input-error" : ""
              }`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Profile Photo URL</span>
            </label>
            <input
              {...register("photoURL", {
                required: "Photo URL is required",
              })}
              type="url"
              className={`input input-bordered w-full ${
                errors.photoURL ? "input-error" : ""
              }`}
              placeholder="https://example.com/photo.jpg"
              disabled={isLoading}
            />
            {errors.photoURL && (
              <p className="text-error text-sm mt-1">
                {errors.photoURL.message}
              </p>
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
                    message: "Minimum 6 characters",
                  },
                })}
                type={passType ? "text" : "password"}
                className={`input input-bordered w-full pr-12 ${
                  errors.password ? "input-error" : ""
                }`}
                placeholder="Create a password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
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

          {/* Date of Birth */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Date of Birth</span>
            </label>
            <input
              {...register("dateOfBirth", {
                required: "Date of birth is required",
              })}
              type="date"
              className={`input input-bordered w-full ${
                errors.dateOfBirth ? "input-error" : ""
              }`}
              disabled={isLoading}
            />
            {errors.dateOfBirth && (
              <p className="text-error text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full hover:scale-105 transition-transform duration-200"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Account...
              </>
            ) : (
              "Register as Employee"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="link text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterEmployee;
