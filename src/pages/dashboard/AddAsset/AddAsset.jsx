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

  const { data: currentHR } = useQuery({
    queryKey: ["currentHR", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (currentHR) {
      setValue("hrEmail", currentHR.email);
      setValue("companyName", currentHR.companyName);
      setValue("companyLogo", currentHR.companyLogo || "");
    }
  }, [currentHR, setValue]);

  const handleAddAsset = async (data) => {
    try {
      const asset = {
        productName: data.productName,
        productImage: data.photoURL,
        productType: data.productType,
        productQuantity: Number(data.productQuantity),
        hrEmail: data.hrEmail,
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/assets", asset);

      if (res.data.insertedId) {
        Swal.fire("Success!", "Asset added successfully", "success");
        navigate("/dashboard/asset-list");
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
              {...register("productName", { required: true })}
              className="input"
              placeholder="Laptop, Chair, Monitor"
            />
            {errors.productName && (
              <p className="text-error text-sm">Product name is required</p>
            )}
          </div>

          {/* Product Image */}
          <div>
            <label className="label">Product Image</label>
            <input
              type="text"
              accept="image/*"
              {...register("photoURL", { required: true })}
              className="input w-full outline-none"
              placeholder="Photo URL"
            />
            {errors.productImage && (
              <p className="text-error text-sm">Image is required</p>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label className="label">Product Type</label>
            <select
              {...register("productType", { required: true })}
              className="select w-full border-primary"
            >
              <option value="">Select Type</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="label">Total Quantity</label>
            <input
              type="number"
              {...register("productQuantity", { required: true, min: 1 })}
              className="input"
            />
          </div>

          {/* Hidden HR fields */}
          <input type="hidden" {...register("hrEmail")} />
          <input type="hidden" {...register("companyName")} />
          <input type="hidden" {...register("companyLogo")} />

          <button className="btn btn-primary w-full mt-4">Add Asset</button>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
