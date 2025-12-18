import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import useAxios from "../../../hooks/useAxios";
import { toast } from "react-toastify";

const RegisterHR = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { registerUser, updateUserProfile, user } = useAuth();
  const [passType, setPassType] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data) => {
    try {
      data.role = "hr";
      data.packageLimit = 5;
      data.currentEmployees = 0;
      data.subscription = "basic";

      await registerUser(data.email, data.password);
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.companyLogo,
      }).then(() => {
        toast(
          `Welcome Back ${
            (user && user?.displayName) || user?.providerData?.displayName
          }`
        );
      });

      const hrInfo = {
        name: data.name,
        email: data.email,
        role: "hr",
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        dateOfBirth: data.dateOfBirth,
        packageLimit: 5,
        currentEmployees: 0,
        subscription: "basic",
        createdAt: new Date(),
      };

      const res = await axios.post("/users", hrInfo);
      console.log("User saved:", res.data);
      navigate(location?.state || "/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <Helmet>
        <title>Register | AsserVerse</title>
      </Helmet>
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-lg shadow-neutral rounded-xl p-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center">
          Register as HR
        </h2>

        <p className="text-center mt-1">
          or Register as{" "}
          <Link to="/register-employee" className="link text-secondary">
            Employee
          </Link>
        </p>
        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="card-body px-0"
        >
          <fieldset className="fieldset flex flex-col gap-3">
            {/* name */}
            <div>
              {" "}
              <label className="label">Name</label>
              <input
                {...register("name")}
                type="text"
                className="input"
                placeholder="Full Name"
              />
              {errors.name?.type === "required" && (
                <p className={`font-medium text-error!`}>Name is Required</p>
              )}
            </div>
            {/* company name */}
            <div>
              {" "}
              <label className="label">Company Name</label>
              <input
                {...register("companyName")}
                type="text"
                className="input"
                placeholder="Company Name"
              />
              {errors.companyName?.type === "required" && (
                <p className={`font-medium text-error!`}>
                  Company Name is Required
                </p>
              )}
            </div>
            {/* company logo */}
            <div>
              {" "}
              <label className="label">Company Logo</label>
              <input
                {...register("companyLogo")}
                type="text"
                className="input"
                placeholder="Company Name"
              />
              {errors.companyLogo?.type === "required" && (
                <p className={`font-medium text-error!`}>
                  Company Logo is Required
                </p>
              )}
            </div>
            {/* email */}
            <div>
              {" "}
              <label className="label">Email</label>
              <input
                {...register("email")}
                type="email"
                className="input"
                placeholder="Professional Email"
              />
              {errors.email?.type === "required" && (
                <p className={`font-medium text-error!`}>Email is Required</p>
              )}
            </div>
            {/* password */}
            <div>
              <label className="label">Password</label>
              <input
                {...register("password")}
                type={passType ? "text" : "password"}
                className="input"
                placeholder="Password"
              />
              <div
                className="absolute bottom-56 right-13 text-xl z-10"
                onClick={() => setPassType(!passType)}
              >
                {passType ? <FaEyeSlash></FaEyeSlash> : <FaEye />}
              </div>
              {errors.password?.type === "required" && (
                <p className={`font-medium text-error!`}>
                  Password is Required
                </p>
              )}
            </div>
            {/* date of birth */}
            <div>
              <label className="label">Date of Birth</label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className="input"
              />
              {errors.dateOfBirth?.type === "required" && (
                <p className={`font-medium text-error!`}>Date is Required</p>
              )}
            </div>
            <button className="btn btn-primary w-full mt-2">Register</button>

            <p className="text-center">
              Already have an account?{" "}
              <Link to="/login" className="link text-secondary">
                Login
              </Link>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default RegisterHR;
