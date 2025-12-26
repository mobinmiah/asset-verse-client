import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const AssetList = () => {
  const modalRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, setValue, reset } = useForm();
 const {
   data: assets = [],
   isLoading,
   refetch,
 } = useQuery({
   queryKey: ["assets", searchQuery],
   queryFn: async () => {
     const res = await axiosSecure.get(`/assets?searchText=${searchQuery}`);
     return res.data;
   },
   staleTime: 1000 * 5,
   refetchOnWindowFocus: false,
 });


  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setValue("productName", asset.productName);
    setValue("productImage", asset.productImage);
    setValue("productType", asset.productType);
    setValue("productQuantity", asset.productQuantity);
    modalRef.current.showModal();
  };

  const onSubmitEdit = async (data) => {
    if (!selectedAsset) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to update this asset!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/assets/${selectedAsset._id}`, data);

      if (res.data.modifiedCount) {
        modalRef.current.close();
        reset();
        refetch();
        Swal.fire("Updated!", "Asset updated successfully.", "success");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Update failed",
        icon: "error",
      });
    }
  };

  const handleDeleteAsset = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const res = await axiosSecure.delete(`/assets/${id}`);

    if (res.data.deletedCount) {
      refetch();
      Swal.fire("Deleted!", "Asset has been deleted.", "success");
    }
  };
const handleSearch = () => {
  setSearchQuery(searchText.trim());
};

useEffect(() => {
  if (searchText === "") {
    setSearchQuery("");
  }
}, [searchText]);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-base-100 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 pt-5 text-center text-primary">
        All Assets ({assets.length})
      </h2>

      <div className="flex justify-center  mb-6">
        <div className="flex gap-2 w-full max-w-sm relative">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Search asset"
            value={searchText}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="btn btn-primary absolute right-0 z-50"
          >
            Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tabtable table-zebra w-fullle">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No assets found
                </td>
              </tr>
            )}

            {assets.map((asset, index) => (
              <tr key={asset._id}>
                <td>{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={asset.productImage}
                      alt={asset.productName}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <p className="font-bold">{asset.productName}</p>
                    </div>
                  </div>
                </td>
                <td>{asset.productType}</td>
                <td
                  className={
                    asset.productQuantity === 0 ? "text-error font-bold" : ""
                  }
                >
                  {asset.productQuantity}
                </td>
                <td>{new Date(asset.createdAt).toLocaleDateString()}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => openEditModal(asset)}
                    className="btn btn-xs btn-info"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(asset._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-4 text-center">Edit Asset</h3>

          <form
            onSubmit={handleSubmit(onSubmitEdit)}
            className="grid grid-cols-1 gap-4"
          >
            <input
              {...register("productName", { required: true })}
              className="input"
              placeholder="Product Name"
            />
            <select
              {...register("productType")}
              className="select border-primary outline-none w-full"
            >
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
            <input
              type="number"
              {...register("productQuantity", { required: true })}
              className="input"
              placeholder="Quantity"
            />

            <div className="flex gap-2">
              <button
                onClick={() => modalRef.current.close()}
                type="submit"
                className="btn btn-primary flex-1"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => modalRef.current.close()}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AssetList;
