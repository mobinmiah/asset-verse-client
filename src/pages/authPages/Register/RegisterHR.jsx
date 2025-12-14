import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import useAxios from "../../../hooks/useAxios";

const RegisterHR = () => {
  const axios = useAxios()
  const { registerUser, updateUserProfile } = useAuth();
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

      // 1️⃣ Firebase auth
      await registerUser(data.email, data.password);

      // 2️⃣ Update Firebase profile (ONLY name + photo)
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.companyLogo,
      });

      // 3️⃣ Save HR info to MongoDB
      const hrUser = {
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

      const res = await axios.post("/users", hrUser);
      console.log("User saved:", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleRegistration = (data) => {
  //   data.role = "hr";
  //   data.packageLimit = 5;
  //   data.currentEmployees = 0;
  //   data.subscription = "basic";

  //   registerUser(data.email, data.password).then(() => [
  //     updateUserProfile(data)
  //       .then()
  //       .catch((error) => {
  //         console.log(error);
  //       }),
  //   ]);
  //   // console.log(data);
  // };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <Helmet>
        <title>Register | AsserVerse</title>
      </Helmet>
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-lg shadow-neutral rounded-xl p-6">
        <h2>Register as HR</h2>

        <p className="text-center mt-1">
          or Register as{" "}
          <Link to="/register-employee" className="link text-secondary">
            Employee
          </Link>
        </p>
        {/* registration form */}
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
                {...register("name", { required: true })}
                type="text"
                className="input outline-none border-primary w-full"
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
                {...register("companyName", { required: true })}
                type="text"
                className="input outline-none border-primary w-full"
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
                {...register("companyLogo", { required: true })}
                type="text"
                className="input outline-none border-primary w-full"
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
                {...register("email", { required: true })}
                type="email"
                className="input outline-none border-primary w-full"
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
                {...register("password", { required: true })}
                type={passType ? "text" : "password"}
                className="input outline-none border-primary w-full"
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
                {...register("dateOfBirth", { required: true })}
                type="date"
                className="input outline-none border-primary w-full"
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
