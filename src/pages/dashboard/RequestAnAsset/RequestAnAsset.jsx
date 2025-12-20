import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const RequestAnAsset = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const limit = 12;

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const { data = {}, isLoading } = useQuery({
    queryKey: ["public-assets", searchText, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/assets/public?searchText=${searchText}&limit=${limit}&skip=${
          currentPage * limit
        }`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const assets = data.assets || [];
  const totalAssets = data.total || 0;
  const totalPage = Math.ceil(totalAssets / limit);

  const handleConfirmRequest = async () => {
    setIsSubmitting(true);
    const res = await axiosSecure.post("/asset-requests", {
      assetId: selectedAsset._id,
    });

    if (res.data.success) {
      toast.success("Asset request sent successfully");
      document.getElementById("request_modal").close();
      setSelectedAsset(null);
    }

    setIsSubmitting(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10 bg-base-100 rounded-xl shadow-sm">
      <Helmet><title>RequestAsset</title></Helmet>
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
        Request an Asset from Any Companye
      </h2>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-sm">
          <label className="input flex items-center gap-2">
            <svg
              className="h-5 w-5 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" />
              <path d="m21 21-4.3-4.3" fill="none" stroke="currentColor" />
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Search asset"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </label>
        </div>
      </div>

      {assets.length === 0 && (
        <p className="text-center text-base-content/60 mt-10">
          No assets found.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((product) => (
          <div
            key={product._id}
            className="card bg-base-200 rounded-xl hover:shadow-xl shadow-neutral transition"
          >
            <figure className="px-3 pt-3">
              <img
                src={product.productImage}
                alt={product.productName}
                className="rounded-xl h-60 w-full"
              />
            </figure>

            <div className="card-body p-4">

              <h3 className="text-primary font-semibold text-center md:text-left">
                {product.productName}
              </h3>

              <div className="flex justify-between text-sm mt-3">
                <p className="text-start">
                  Type:{" "}
                  <span className="font-semibold">{product.productType}</span>
                </p>
                <p className="text-end">
                  Available:{" "}
                  <span className="font-semibold">
                    {product.productQuantity}
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedAsset(product);
                  document.getElementById("request_modal").showModal();
                }}
                disabled={product.productQuantity === 0}
                className="btn btn-primary btn-sm w-full md:w-auto mt-4"
              >
                Request Asset
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-10 flex-wrap">
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            className="btn btn-sm"
          >
            Prev
          </button>
        )}

        {[...Array(totalPage).keys()].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`btn btn-sm ${
              page === currentPage ? "btn-primary" : "btn-outline"
            }`}
          >
            {page + 1}
          </button>
        ))}

        {currentPage < totalPage - 1 && (
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="btn btn-sm"
          >
            Next
          </button>
        )}
      </div>

      <dialog id="request_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg text-primary">
            Confirm Asset Request
          </h3>

          {selectedAsset && (
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Asset:</strong> {selectedAsset.productName}
              </p>
              <p>
                <strong>Company:</strong> {selectedAsset.companyName}
              </p>
              <p>
                <strong>HR:</strong> {selectedAsset.hrEmail}
              </p>
            </div>
          )}

          <div className="modal-action flex-col sm:flex-row gap-2">
            <button
              className="btn btn-outline w-full sm:w-auto"
              onClick={() => document.getElementById("request_modal").close()}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmRequest}
              disabled={isSubmitting}
              className="btn btn-primary w-full sm:w-auto"
            >
              {isSubmitting ? "Sending..." : "Confirm Request"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default RequestAnAsset;
