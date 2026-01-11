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
      // Generate asset code based on category
      const categoryCode = {
        'Electronics': 'ELC',
        'Furniture': 'FUR',
        'Vehicles': 'VEH',
        'Equipment': 'EQP',
        'Software': 'SFT',
        'Other': 'OTH'
      };
      
      const typeCode = data.productType === 'Returnable' ? 'RET' : 'NRT';
      const timestamp = Date.now().toString().slice(-4);
      const assetCode = `AST-${categoryCode[data.category] || 'OTH'}-${typeCode}-${timestamp}`;

      const asset = {
        productName: data.productName,
        productImage: data.photoURL,
        productType: data.productType,
        productQuantity: Number(data.productQuantity),
        hrEmail: data.hrEmail,
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        
        // Additional fields from database structure
        category: data.category,
        assetCode: assetCode,
        brand: data.brand,
        model: data.model,
        status: "Available",
        department: data.department,
        location: data.location,
        description: data.description,
        specifications: {
          warranty: data.warranty,
          maintenanceNotes: data.maintenanceNotes || "New asset",
          lastInspectionDate: new Date().toISOString().split('T')[0]
        },
        
        // System fields
        assignedTo: null,
        assignedEmployeeName: null,
        assignedDate: null,
        expectedReturnDate: null,
        requestCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await axiosSecure.post("/assets", asset);

      if (res.data.insertedId) {
        Swal.fire("Success!", "Asset added successfully", "success");
        navigate("/dashboard/asset-list");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add asset", "error");
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
          className="card-body space-y-6"
        >
          {/* HR & Company Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b pb-2">HR & Company Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">HR Manager</span>
                </label>
                <input
                  value={currentHR?.name || user?.displayName || "Loading..."}
                  className="input input-bordered w-full bg-base-200"
                  readOnly
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">HR Email</span>
                </label>
                <input
                  value={currentHR?.email || user?.email || "Loading..."}
                  className="input input-bordered w-full bg-base-200"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Company Name</span>
                </label>
                <input
                  value={currentHR?.companyName || "Loading..."}
                  className="input input-bordered w-full bg-base-200"
                  readOnly
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Employee Count</span>
                </label>
                <input
                  value={currentHR?.currentEmployees || 0}
                  className="input input-bordered w-full bg-base-200"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b pb-2">Basic Information</h3>
            
            {/* Product Name */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Product Name *</span>
              </label>
              <input
                {...register("productName", { required: "Product name is required" })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="e.g., Epson EB-X41 Projector"
              />
              {errors.productName && (
                <p className="text-error text-sm mt-1">{errors.productName.message}</p>
              )}
            </div>

            {/* Product Image */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Product Image URL *</span>
              </label>
              <input
                type="url"
                {...register("photoURL", { required: "Image URL is required" })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="https://example.com/image.jpg"
              />
              {errors.photoURL && (
                <p className="text-error text-sm mt-1">{errors.photoURL.message}</p>
              )}
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Category *</span>
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="select select-bordered w-full focus:select-primary focus:outline-none"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Software">Software</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-error text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Product Type *</span>
                </label>
                <select
                  {...register("productType", { required: "Product type is required" })}
                  className="select select-bordered w-full focus:select-primary focus:outline-none"
                >
                  <option value="" disabled>Select Type</option>
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>
                {errors.productType && (
                  <p className="text-error text-sm mt-1">{errors.productType.message}</p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Total Quantity *</span>
              </label>
              <input
                type="number"
                {...register("productQuantity", { 
                  required: "Quantity is required", 
                  min: { value: 1, message: "Quantity must be at least 1" }
                })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="e.g., 5"
              />
              {errors.productQuantity && (
                <p className="text-error text-sm mt-1">{errors.productQuantity.message}</p>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b pb-2">Product Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Brand</span>
                </label>
                <input
                  {...register("brand")}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Epson, Dell, HP"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Model</span>
                </label>
                <input
                  {...register("model")}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., EB-X41, Latitude 5520"
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                {...register("description")}
                className="textarea textarea-bordered w-full h-24 focus:textarea-primary resize-none"
                placeholder="Brief description of the asset and its intended use..."
              />
            </div>
          </div>

          {/* Location & Department Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b pb-2">Location & Department</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Department</span>
                </label>
                <select
                  {...register("department")}
                  className="select select-bordered w-full focus:select-primary focus:outline-none"
                >
                  <option value="" disabled>Select Department</option>
                  <option value="Operations">Operations</option>
                  <option value="IT">Information Technology</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Administration">Administration</option>
                  <option value="Research">Research & Development</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <input
                  {...register("location")}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Conference Room A, Office 101, Storage Room"
                />
              </div>
            </div>
          </div>

          {/* Warranty & Maintenance Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b pb-2">Warranty & Maintenance</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Warranty Period</span>
                </label>
                <select
                  {...register("warranty")}
                  className="select select-bordered w-full focus:select-primary focus:outline-none"
                >
                  <option value="" disabled>Select Warranty</option>
                  <option value="No Warranty">No Warranty</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="Lifetime">Lifetime</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Maintenance Notes</span>
                </label>
                <input
                  {...register("maintenanceNotes")}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="e.g., Monthly cleaning required, Handle with care"
                />
              </div>
            </div>
          </div>

          {/* Hidden HR fields */}
          <input type="hidden" {...register("hrEmail")} />
          <input type="hidden" {...register("companyName")} />
          <input type="hidden" {...register("companyLogo")} />

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Asset to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
