import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const AssetList = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const modalRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, setValue } = useForm();
  const {
    data: assets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets");
      return res.data;
    },
  });
  const openEditModal = (product) => {
    setSelectedAsset(product);
    setValue("productName", product.productName);
    setValue("productImage", product.productImage);
    setValue("productType", product.productType);
    setValue("productQuantity", product.productQuantity);
    modalRef.current.showModal();
  };

  const handleEditAsset = async (id, data) => {
    modalRef.current.close();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to update this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/assets/${id}`, data);

        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: "Updated!",
            text: "Your product has been updated.",
            icon: "success",
          });
        }
      } catch (err) {
        Swal.fire("Error", "Update failed", err.message);
      }
    }
  };

  const handleDeleteAsset = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/assets/${id}`).then((res) => {
          if (res.data.deletedCount) {
            modalRef.current.close();
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };
  const onSubmitEdit = (data) => {
    if (!selectedAsset) return;

    handleEditAsset(selectedAsset._id, data);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(onSubmitEdit)();
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        All Assets : ({assets.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Date Added</th>
              <th>Acions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((product, index) => (
              <tr key={product._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={product.productImage}
                          alt={`Product Image ${product.productName}`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{product.productName}</div>
                      <div className="text-sm opacity-50">
                        {product.productType}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{product.productQuantity}</td>
                <td>{new Date(product.createdAt).toLocaleString()}</td>
                <th className="space-x-1">
                  <button
                    onClick={() => openEditModal(product)}
                    className="btn btn-primary btn-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(product._id)}
                    className="btn btn-error btn-xs"
                  >
                    Delete
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-lg w-full">
            <h3 className="text-xl font-bold mb-6 text-center text-primary">
              Edit Asset
            </h3>

            {selectedAsset && (
              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  {...register("productName")}
                  className="input input-bordered w-full"
                />
                <input
                  {...register("productImage")}
                  className="input input-bordered w-full"
                />

                <select {...register("productType")} className="select w-full">
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>

                <input
                  type="number"
                  {...register("productQuantity")}
                  className="input input-bordered w-full"
                />

                <div className="flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary flex-1">
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
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AssetList;
