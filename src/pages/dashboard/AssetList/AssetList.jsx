import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ResponsiveTable from "../../../components/ResponsiveTable/ResponsiveTable";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const AssetList = () => {
  const modalRef = useRef(null);
  const detailsModalRef = useRef(null); // New ref for details modal
  const axiosSecure = useAxiosSecure();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewingAsset, setViewingAsset] = useState(null); // New state for viewing asset details
  const [formData, setFormData] = useState(null); // Store form data for reopening modal

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: assets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets`);
      return res.data;
    },
    staleTime: 1000 * 5,
    refetchOnWindowFocus: false,
  });

  const openEditModal = (asset, preservedData = null) => {
    setSelectedAsset(asset);

    const dataToUse = preservedData || {
      productName: asset.productName || "",
      productImage: asset.productImage || "",
      productType: asset.productType || "",
      productQuantity: asset.productQuantity || 0,
      category: asset.category || "",
      brand: asset.brand || "",
      model: asset.model || "",
      description: asset.description || "",
      department: asset.department || "",
      location: asset.location || "",
      warranty: asset.specifications?.warranty || asset.warranty || "",
      maintenanceNotes:
        asset.specifications?.maintenanceNotes || asset.maintenanceNotes || "",
    };

    // Set all form values
    Object.keys(dataToUse).forEach((key) => {
      setValue(key, dataToUse[key]);
    });

    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close();
    reset();
    setSelectedAsset(null);
    setFormData(null);
  };

  const openDetailsModal = (asset) => {
    setViewingAsset(asset);
    detailsModalRef.current.showModal();
  };

  const closeDetailsModal = () => {
    detailsModalRef.current.close();
    setViewingAsset(null);
  };

  const onSubmitEdit = async (data) => {
    if (!selectedAsset) return;

    // Store form data before closing modal
    setFormData(data);

    // Close modal first to avoid z-index issues with SweetAlert
    closeModal();

    const result = await Swal.fire({
      title: "Update Asset",
      text: "Are you sure you want to update this asset?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      confirmButtonColor: "#14C2ED",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) {
      openEditModal(selectedAsset, formData);
      return;
    }

    try {
      const updateData = {
        productName: data.productName,
        productImage: data.productImage,
        productType: data.productType,
        productQuantity: Number(data.productQuantity),
        category: data.category,
        brand: data.brand,
        model: data.model,
        description: data.description,
        department: data.department,
        location: data.location,
        specifications: {
          warranty: data.warranty,
          maintenanceNotes: data.maintenanceNotes,
          lastInspectionDate:
            selectedAsset.specifications?.lastInspectionDate ||
            new Date().toISOString().split("T")[0],
        },
        updatedAt: new Date(),
      };

      const res = await axiosSecure.patch(
        `/assets/${selectedAsset._id}`,
        updateData
      );

      if (res.data.modifiedCount) {
        refetch();
        Swal.fire({
          title: "Success!",
          text: "Asset updated successfully.",
          icon: "success",
          confirmButtonColor: "#14C2ED",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to update asset",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleDeleteAsset = async (id) => {
    const result = await Swal.fire({
      title: "Delete Asset",
      text: "This will permanently delete the asset and remove it from all employee profiles. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/assets/${id}`);

      if (res.data.success) {
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Asset has been completely removed from the system.",
          icon: "success",
          confirmButtonColor: "#14C2ED",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to delete asset",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  // Define table columns
  const columns = [
    {
      header: "#",
      accessor: "index",
      render: (item, index) => index + 1,
    },
    {
      header: "Asset",
      accessor: "productName",
      render: (item) => (
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="avatar">
            <div className="w-full lg:mask lg:mask-squircle lg:w-12 md:h-12">
              <img
                src={item.productImage}
                alt={item.productName}
              />
            </div>
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base line-clamp-1">
              {item.productName}
            </div>
            <div className="text-xs text-base-content/70">
              {item.brand && item.model
                ? `${item.brand} ${item.model}`
                : item.category || "No category"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Details",
      accessor: "details",
      render: (item) => (
        <div className="text-sm space-y-1">
          <div>
            <span
              className={`badge badge-sm ${
                item.productType === "Returnable"
                  ? "badge-success"
                  : "badge-info"
              }`}
            >
              {item.productType}
            </span>
          </div>
          {item.category && (
            <div className="text-xs text-base-content/70">
              📂 {item.category}
            </div>
          )}
          {item.department && (
            <div className="text-xs text-base-content/70">
              🏢 {item.department}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      render: (item) => (
        <div className="text-sm">
          {item.location ? (
            <div>
              <div className="font-medium">{item.location}</div>
              {item.department && (
                <div className="text-xs text-base-content/70">
                  {item.department}
                </div>
              )}
            </div>
          ) : (
            <span className="text-base-content/50">Not specified</span>
          )}
        </div>
      ),
    },
    {
      header: "Quantity",
      accessor: "productQuantity",
      render: (item) => (
        <div className="text-center">
          <span
            className={`font-semibold text-lg ${
              item.productQuantity === 0
                ? "text-error"
                : item.productQuantity <= 5
                ? "text-warning"
                : "text-success"
            }`}
          >
            {item.productQuantity}
          </span>
          <div className="text-xs">
            {item.productQuantity === 0 ? (
              <span className="text-error">Out of Stock</span>
            ) : item.productQuantity <= 5 ? (
              <span className="text-warning">Low Stock</span>
            ) : (
              <span className="text-success">In Stock</span>
            )}
          </div>
        </div>
      ),
    },

    {
      header: "Date Added",
      accessor: "createdAt",
      render: (item) => (
        <div className="text-sm">
          {new Date(item.createdAt).toLocaleDateString()}
          <div className="text-xs text-base-content/70">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (item) => (
        <div className="flex flex-col sm:flex-row gap-2 items-stretch">
          <button
            onClick={() => openDetailsModal(item)}
            className="btn btn-primary w-full sm:w-auto"
            title="View Asset Details"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </button>
          <button
            onClick={() => openEditModal(item)}
            className="btn btn-info w-full sm:w-auto"
            title="Edit Asset"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDeleteAsset(item._id)}
            className="btn btn-error w-full sm:w-auto"
            title="Delete Asset"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-responsive py-4 sm:py-6">
      <Helmet>
        <title>Asset List - AssetVerse | Manage Your Assets</title>
        <meta
          name="description"
          content="View and manage all your organization's assets in one place."
        />
      </Helmet>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
            Asset Management
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Manage all your organization's assets ({assets.length} total)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 auto-rows-fr">
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 h-full flex flex-col justify-between shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">Total Assets</div>
            <div className="stat-value text-lg sm:text-2xl text-primary">
              {assets.length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 h-full flex flex-col justify-between shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">In Stock</div>
            <div className="stat-value text-lg sm:text-2xl text-success">
              {assets.filter((asset) => asset.productQuantity > 0).length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 h-full flex flex-col justify-between shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">Out of Stock</div>
            <div className="stat-value text-lg sm:text-2xl text-error">
              {assets.filter((asset) => asset.productQuantity === 0).length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg p-3 sm:p-4 h-full flex flex-col justify-between shadow-md transform hover:scale-105 transition-all duration-200">
            <div className="stat-title text-xs sm:text-sm">Returnable</div>
            <div className="stat-value text-lg sm:text-2xl text-info">
              {
                assets.filter((asset) => asset.productType === "Returnable")
                  .length
              }
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <ResponsiveTable
          data={assets}
          columns={columns}
          loading={isLoading}
          searchable={true}
          sortable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No assets found. Add your first asset to get started!"
        />
      </div>

      {/* Enhanced Edit Modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-primary">Edit Asset</h3>
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary border-b pb-2">
                Basic Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Product Name *
                    </span>
                  </label>
                  <input
                    {...register("productName", {
                      required: "Product name is required",
                    })}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Enter product name"
                  />
                  {errors.productName && (
                    <p className="text-error text-sm mt-1">
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Product Image URL *
                    </span>
                  </label>
                  <input
                    type="url"
                    {...register("productImage", {
                      required: "Image URL is required",
                    })}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.productImage && (
                    <p className="text-error text-sm mt-1">
                      {errors.productImage.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Category *</span>
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="select select-bordered w-full focus:select-primary"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Software">Software</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="text-error text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Product Type *
                    </span>
                  </label>
                  <select
                    {...register("productType", {
                      required: "Product type is required",
                    })}
                    className="select select-bordered w-full focus:select-primary"
                  >
                    <option value="">Select Type</option>
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                  </select>
                  {errors.productType && (
                    <p className="text-error text-sm mt-1">
                      {errors.productType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Quantity *</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("productQuantity", {
                      required: "Quantity is required",
                      min: { value: 0, message: "Quantity cannot be negative" },
                    })}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Enter quantity"
                  />
                  {errors.productQuantity && (
                    <p className="text-error text-sm mt-1">
                      {errors.productQuantity.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary border-b pb-2">
                Product Details
              </h4>

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
                  placeholder="Brief description of the asset..."
                />
              </div>
            </div>

            {/* Location & Department Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary border-b pb-2">
                Location & Department
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Department</span>
                  </label>
                  <select
                    {...register("department")}
                    className="select select-bordered w-full focus:select-primary"
                  >
                    <option value="">Select Department</option>
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
                    placeholder="e.g., Conference Room A, Office 101"
                  />
                </div>
              </div>
            </div>

            {/* Warranty & Maintenance Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary border-b pb-2">
                Warranty & Maintenance
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Warranty Period
                    </span>
                  </label>
                  <select
                    {...register("warranty")}
                    className="select select-bordered w-full focus:select-primary"
                  >
                    <option value="">Select Warranty</option>
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
                    <span className="label-text font-medium">
                      Maintenance Notes
                    </span>
                  </label>
                  <input
                    {...register("maintenanceNotes")}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="e.g., Monthly cleaning required"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline order-2 sm:order-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary order-1 sm:order-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Update Asset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Modal backdrop - clicking outside closes modal */}
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeModal}>
            close
          </button>
        </form>
      </dialog>

      {/* Asset Details Modal - Redesigned */}
      <dialog
        ref={detailsModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box max-w-6xl max-h-[95vh] overflow-y-auto">
          {viewingAsset && (
            <>
              {/* Simple Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-primary">
                  Asset Details - {viewingAsset.productName}
                </h3>
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 auto-rows-fr">
                  <div className="card bg-base-200 shadow-sm h-full flex">
                    <div className="card-body p-4 text-center">
                      <div
                        className={`text-2xl font-bold ${
                          viewingAsset.productQuantity === 0
                            ? "text-error"
                            : viewingAsset.productQuantity <= 5
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {viewingAsset.productQuantity}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Available Quantity
                      </div>
                      <div
                        className={`badge badge-sm mt-1 ${
                          viewingAsset.productQuantity === 0
                            ? "badge-error"
                            : viewingAsset.productQuantity <= 5
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {viewingAsset.productQuantity === 0
                          ? "Out of Stock"
                          : viewingAsset.productQuantity <= 5
                          ? "Low Stock"
                          : "In Stock"}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4 text-center">
                      <div
                        className={`text-2xl font-bold ${
                          viewingAsset.status === "Available"
                            ? "text-success"
                            : viewingAsset.status === "Assigned"
                            ? "text-warning"
                            : "text-error"
                        }`}
                      >
                        <svg
                          className="w-8 h-8 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {viewingAsset.status === "Available" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </div>
                      <div className="text-sm text-base-content/70">Status</div>
                      <div
                        className={`badge badge-sm mt-1 ${
                          viewingAsset.status === "Available"
                            ? "badge-success"
                            : viewingAsset.status === "Assigned"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {viewingAsset.status || "Available"}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4 text-center">
                      <div className="text-2xl font-bold text-info">
                        {viewingAsset.requestCount || 0}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Total Requests
                      </div>
                      <div className="badge badge-info badge-sm mt-1">
                        {viewingAsset.requestCount > 0 ? "Popular" : "New"}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4 text-center">
                      <div className="text-2xl font-bold text-neutral">
                        <svg
                          className="w-8 h-8 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-base-content/70">Added</div>
                      <div className="badge badge-neutral badge-sm mt-1">
                        {new Date(viewingAsset.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Asset Image */}
                  <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                      <div className="card-body p-4">
                        <h4 className="card-title text-lg mb-4">Asset Image</h4>
                        <div className="aspect-square rounded-lg overflow-hidden bg-base-200 flex items-center justify-center">
                          <img
                            src={viewingAsset.productImage}
                            alt={viewingAsset.productName}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x400?text=No+Image+Available";
                            }}
                          />
                        </div>

                        {/* Assignment Info */}
                        {viewingAsset.assignedTo && (
                          <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                            <div className="flex items-center gap-2 text-warning-content">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="font-medium">
                                Currently Assigned
                              </span>
                            </div>
                            <div className="mt-2 text-sm">
                              <div>
                                <strong>Employee:</strong>{" "}
                                {viewingAsset.assignedEmployeeName ||
                                  viewingAsset.assignedTo}
                              </div>
                              {viewingAsset.assignedDate && (
                                <div>
                                  <strong>Since:</strong>{" "}
                                  {new Date(
                                    viewingAsset.assignedDate
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Asset Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                      <div className="card-body p-4">
                        <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-base-content/70">
                                Category
                              </label>
                              <div className="mt-1">
                                <span className="badge badge-outline badge-lg">
                                  {viewingAsset.category || "Uncategorized"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-base-content/70">
                                Brand
                              </label>
                              <div className="mt-1 font-semibold">
                                {viewingAsset.brand || "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-base-content/70">
                                Department
                              </label>
                              <div className="mt-1">
                                {viewingAsset.department || "Not specified"}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-base-content/70">
                                Model
                              </label>
                              <div className="mt-1 font-semibold">
                                {viewingAsset.model || "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-base-content/70">
                                Location
                              </label>
                              <div className="mt-1">
                                {viewingAsset.location || "Not specified"}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-base-content/70">
                                Last Updated
                              </label>
                              <div className="mt-1 text-sm">
                                {new Date(
                                  viewingAsset.updatedAt ||
                                    viewingAsset.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {viewingAsset.description && (
                      <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                          <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Description
                          </h4>
                          <p className="text-base-content/80 leading-relaxed bg-base-200 p-4 rounded-lg">
                            {viewingAsset.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Warranty & Maintenance */}
                    {(viewingAsset.specifications?.warranty ||
                      viewingAsset.specifications?.maintenanceNotes) && (
                      <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                          <h4 className="card-title text-lg mb-4 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            Warranty & Maintenance
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {viewingAsset.specifications?.warranty && (
                              <div>
                                <label className="text-sm font-medium text-base-content/70">
                                  Warranty Period
                                </label>
                                <div className="mt-1">
                                  <span className="badge badge-success badge-lg">
                                    {viewingAsset.specifications.warranty}
                                  </span>
                                </div>
                              </div>
                            )}
                            {viewingAsset.specifications
                              ?.lastInspectionDate && (
                              <div>
                                <label className="text-sm font-medium text-base-content/70">
                                  Last Inspection
                                </label>
                                <div className="mt-1">
                                  {new Date(
                                    viewingAsset.specifications.lastInspectionDate
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                          {viewingAsset.specifications?.maintenanceNotes && (
                            <div className="mt-4">
                              <label className="text-sm font-medium text-base-content/70">
                                Maintenance Notes
                              </label>
                              <p className="mt-1 text-sm bg-base-200 p-3 rounded-lg">
                                {viewingAsset.specifications.maintenanceNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-base-300 pt-6 mt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        closeDetailsModal();
                        openEditModal(viewingAsset);
                      }}
                      className="btn btn-primary w-full sm:w-auto"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Asset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeDetailsModal();
                        handleDeleteAsset(viewingAsset._id);
                      }}
                      className="btn btn-error w-full sm:w-auto"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Asset
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={closeDetailsModal}
                    className="btn btn-outline w-full sm:w-auto"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeDetailsModal}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default AssetList;
