import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const AddAsset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: userHR = [] } = useQuery({
    queryKey: ["userHR"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  useEffect(() => {
    if (user && userHR.length) {
      const currentHR = userHR.find((hr) => hr.email === user.email);

      if (currentHR) {
        setValue("hrEmail", currentHR.email);
        setValue("companyName", currentHR.companyName);
      }
    }
  }, [user, userHR, setValue]);

  const handleAddAsset = async (data) => {
    const asset = {
      productName: data.productName,
      productImage: data.productImage,
      productType: data.productType,
      productQuantity: Number(data.productQuantity),
      hrEmail: data.hrEmail,
      companyName: data.companyName,
      companyLogo: userHR[1].companyLogo,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/assets", asset);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Asset added successfully", "success");
        navigate("/dashboard");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add asset", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Helmet>
        <title>Add Asset | AssetVerse</title>
      </Helmet>

      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Add New Asset
      </h2>

      <div className="card bg-base-100 shadow-lg rounded-xl">
        <form
          onSubmit={handleSubmit(handleAddAsset)}
          className="card-body space-y-4"
        >
          {/* Product Name */}
          <div>
            <label className="label">Product Name</label>
            <input
              {...register("productName")}
              className="input"
              placeholder="Laptop, Chair, Monitor"
            />
            {errors.productName && (
              <p className="text-error text-sm">Product name is required</p>
            )}
          </div>

          {/* Product Image */}
          <div>
            <label className="label">Product Image URL</label>
            <input
              {...register("productImage")}
              className="input"
              placeholder="https://image-url.com"
            />
            {errors.productImage && (
              <p className="text-error text-sm">Image URL is required</p>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label className="label">Product Type</label>
            <select
              {...register("productType")}
              className="select w-full border-primary outline-none"
            >
              <option value="">Select Type</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
            {errors.productType && (
              <p className="text-error text-sm">Product type is required</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="label">Total Quantity</label>
            <input
              type="number"
              {...register("productQuantity", { required: true, min: 1 })}
              className="input"
              placeholder="Quantity"
            />
            {errors.productQuantity && (
              <p className="text-error text-sm">
                Product quantity must be at least 1
              </p>
            )}
          </div>

          {/* HR Email */}
          <div>
            <label className="label">HR Email</label>
            <input
              type="email"
              {...register("hrEmail")}
              className="input"
              readOnly
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="label">Company Name</label>
            <input {...register("companyName")} className="input" readOnly />
          </div>

          <button className="btn btn-primary w-full mt-4">Add Asset</button>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
