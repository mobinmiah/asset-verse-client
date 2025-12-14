import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router";

const Login = () => {
    const [passType, setPassType] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <Helmet>
        <title>Login | AssetVerse</title>
      </Helmet>
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-lg shadow-neutral rounded-xl p-6">
        <h2>Login</h2>

        <div className="card-body px-0">
          <fieldset className="fieldset flex flex-col gap-3">
            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              className="input outline-none border-primary w-full"
              placeholder="Email"
            />

            {/* Password */}
            <div>
              {" "}
              <label className="label">Password</label>
              <input
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
            </div>

            {/* Forgot password link*/}
            <div className="text-right mt-1">
              <a className="link link-hover text-sm">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button className="btn btn-primary w-full mt-2">Login</button>

            {/* Register link*/}
            <p className="text-center mt-4 text-sm">
              Don't have an account?{" "}
              <Link to="/register-employee" className="link text-secondary">
                Register
              </Link>
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default Login;
