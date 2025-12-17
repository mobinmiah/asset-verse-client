import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxios from "../../../hooks/useAxios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const RegisterEmployee = () => {

  const axios = useAxios();
  const navigate = useNavigate();
  const { registerUser, updateUserProfile } = useAuth();
  const [passType, setPassType] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data) => {
    try {
      data.role = "employee";
      await registerUser(data.email, data.password);
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL,
      }).then(`Welcome to AssetVerse ${data.name}`)
      const employeeInfo = {
        name: data.name,
        email: data.email,
        photo: data.photoURL,
        role: "employee",
        dateOfBirth: data.dateOfBirth,
        createdAt: new Date(),
      };

      const res = await axios.post("/users", employeeInfo);
      console.log("User saved:", res.data);
      navigate(location?.state || "/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <Helmet>
        <title>Register | AssetVerse</title>
      </Helmet>
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-lg shadow-neutral rounded-xl p-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center">
          Register as Employee
        </h2>
        <p className="text-center mt-1">
          or Register as{" "}
          <Link to="/register-hr" className="link text-secondary">
            HR
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
                {...register("name", { required: true })}
                type="text"
                className="input"
                placeholder="Full Name"
              />
              {errors.name?.type === "required" && (
                <p className={`font-medium text-error!`}>Name is Required</p>
              )}
            </div>
            {/* email */}
            <div>
              {" "}
              <label className="label">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="input"
                placeholder="Your Email"
              />
              {errors.email?.type === "required" && (
                <p className={`font-medium text-error!`}>Email is Required</p>
              )}
            </div>
            {/* photo url */}
            <div>
              {" "}
              <label className="label">Photo Url</label>
              <input
                {...register("photoURL" ,{required:true})}
                type="text"
                className="input"
                placeholder="Photo Url"
              />{" "}
              {errors.photoURL?.type === "required" && (
                <p className={`font-medium text-error!`}>
                  Photo Url is Required
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <label className="label">Password</label>
              <input
                {...register("password",{required:true})}
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
                {...register("dateOfBirth",{required:true})}
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

export default RegisterEmployee;
