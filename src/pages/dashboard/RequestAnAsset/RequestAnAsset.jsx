import React, { useState, useEffect, useMemo } from "react";
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

  const itemsPerPage = 8;

  // Fetch all assets
  const {
    data: allAssets = [],
    isLoading,
  } = useQuery({
    queryKey: ["public-assets-all"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/public?limit=1000`);
      return res.data.assets || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { filteredAssets, totalPages, paginatedAssets } = useMemo(() => {

    let filtered = allAssets;
    
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      filtered = allAssets.filter(asset => 
        asset.productName?.toLowerCase().includes(searchLower) ||
        asset.companyName?.toLowerCase().includes(searchLower) ||
        asset.productType?.toLowerCase().includes(searchLower) ||
        asset.brand?.toLowerCase().includes(searchLower) ||
        asset.model?.toLowerCase().includes(searchLower) ||
        asset.category?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const paginatedAssets = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredAssets: filtered,
      totalPages,
      paginatedAssets
    };
  }, [allAssets, searchText, currentPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const handleConfirmRequest = async () => {
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post("/asset-requests", {
        assetId: selectedAsset._id,
      });

      if (res.data.success) {
        toast.success("Asset request sent successfully");
        document.getElementById("request_modal").close();
        setSelectedAsset(null);
      }
    } catch (error) {
      toast.error("Failed to send request. Please try again.");
    }
    setIsSubmitting(false);
  };

  const clearSearch = () => {
    setSearchText("");
    setCurrentPage(0);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10 bg-base-100 rounded-xl shadow-sm">
      <Helmet>
        <title>RequestAsset</title>
      </Helmet>
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
        Request an Asset from Any Company
      </h2>

      {/* Enhanced Search */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full pr-20"
              placeholder="Search by name, company, type, brand..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            
            {/* Clear button */}
            {searchText && (
              <button
                onClick={clearSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Search icon */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Search results info */}
          {searchText && (
            <p className="text-sm text-base-content/60 mt-2 text-center">
              {filteredAssets.length === 0 
                ? `No results found for "${searchText}"`
                : `Found ${filteredAssets.length} asset${filteredAssets.length !== 1 ? 's' : ''} for "${searchText}"`
              }
            </p>
          )}
        </div>
      </div>

      {/* Empty State */}
      {paginatedAssets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-base-content/70 mb-2">
            {searchText ? 'No Assets Found' : 'No Assets Available'}
          </h3>
          <p className="text-base-content/50">
            {searchText 
              ? `Try adjusting your search terms or browse all available assets`
              : 'No assets are currently available for request'
            }
          </p>
          {searchText && (
            <button 
              onClick={clearSearch}
              className="btn btn-outline btn-primary btn-sm mt-4"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Asset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {paginatedAssets.map((product) => (
          <div
            key={product._id}
            className="card bg-base-200 rounded-xl hover:shadow-lg shadow-neutral transition"
          >
            <figure className="px-3 pt-3">
              <img
                src={product.productImage}
                alt={product.productName}
                className="rounded-xl h-60 w-full object-cover"
              />
            </figure>

            <div className="card-body p-4">
              <h3 className="text-primary font-semibold text-center md:text-left">
                {product.productName}
              </h3>

              <div className="flex justify-between items-center text-sm mt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-base-content/70">Type:</span>
                  <span className={`badge badge-xs ${
                    product.productType === "Returnable" ? "badge-success" : "badge-info"
                  }`}>
                    {product.productType === "Returnable" ? "Returnable" : "Non-returnable"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-base-content/70">Available:</span>
                  <span className="font-semibold text-primary">
                    {product.productQuantity}
                  </span>
                </div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {currentPage > 0 && (
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn btn-sm"
            >
              Prev
            </button>
          )}

          {[...Array(totalPages).keys()].map((page) => (
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

          {currentPage < totalPages - 1 && (
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn btn-sm"
            >
              Next
            </button>
          )}
        </div>
      )}

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
