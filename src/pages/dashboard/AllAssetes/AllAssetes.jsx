import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AllAssetes = () => {
  const [searchText, setSearchText] = useState("");
  const axiosSecure = useAxiosSecure();
  const { data: assets = [] } = useQuery({
    queryKey: ["public-assets", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/assets/public?searchText=${searchText}`
      );
      return res.data;
    },
  });

  const handleSendRequest = (id) => {
    console.log(id);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">
        All Assets from All Companies ({assets.length})
      </h2>
      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-sm">
          <label className="input flex items-center gap-2 w-full">
            <svg
              className="h-5 w-5 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="search"
              className="grow input-bordered w-full"
              placeholder="Search Asset"
            />
          </label>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>#</th>
              <th className="min-w-[120px]">Name</th>
              <th>Quantity</th>
              <th className="min-w-[140px]">Date Added</th>
              <th className="min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((product, index) => (
              <tr key={product._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-10 w-10 sm:h-12 sm:w-12">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                        />
                      </div>
                    </div>
                    <div className="truncate">
                      <div className="font-bold truncate">
                        {product.productName}
                      </div>
                      <div className="text-xs sm:text-sm opacity-50 truncate">
                        {product.productType}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{product.productQuantity}</td>
                <td>{new Date(product.createdAt).toLocaleString()}</td>
                <th className="flex flex-wrap gap-1">
                  <button
                    onClick={() => handleSendRequest(product._id)}
                    className="btn btn-primary"
                  >
                    Request
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAssetes;
