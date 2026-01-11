import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { Loading } from "../../components/LoadingStates/LoadingStates";
import Swal from "sweetalert2";

const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();

  // Fetch asset details based on role
  const {
    data: asset,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["asset-details", id, role],
    queryFn: async () => {
      // All users (admin, HR, employee) use the same endpoint
      // The backend handles role-based filtering
      const res = await axiosSecure.get("/assets");
      
      // Handle different response formats
      const assets = role === 'admin' 
        ? (res.data.assets || [])
        : (Array.isArray(res.data) ? res.data : []);
      
      return assets.find(asset => asset._id === id);
    },
    enabled: !!id && !!user && !!role,
  });

  // Fetch related assets
  const { data: relatedAssets = [] } = useQuery({
    queryKey: ["related-assets", asset?.productType, role],
    queryFn: async () => {
      if (!asset) return [];
      
      let allAssets = [];
      if (role === "admin") {
        const res = await axiosSecure.get("/admin/assets");
        allAssets = res.data.assets || res.data;
      } else {
        const res = await axiosSecure.get("/assets");
        allAssets = res.data;
      }
      
      return allAssets
        .filter(a => a.productType === asset.productType && a._id !== id)
        .slice(0, 4);
    },
    enabled: !!asset && !!role,
  });

  const handleRequestAsset = () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to request this asset",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // Redirect to request asset page with pre-filled data
    navigate("/dashboard/request-asset", {
      state: { preselectedAsset: asset },
    });
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-primary mb-4">Login Required</h2>
          <p className="text-base-content/70 mb-6">
            Please login to view asset details
          </p>
          <Link to="/login" className="btn btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error || !asset) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-error mb-4">
            Asset Not Found
          </h2>
          <p className="text-base-content/70 mb-6">
            The asset you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/admin/assets" className="btn btn-primary">
            Browse All Assets
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-base-200">
      <Helmet>
        <title>{asset.productName} - AssetVerse | Asset Details</title>
        <meta
          name="description"
          content={`View details for ${asset.productName}. ${asset.productType} asset available for request.`}
        />
      </Helmet>

      <div className="container-responsive py-8">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <Link to="/" className="text-primary hover:text-primary-focus">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/assets"
                className="text-primary hover:text-primary-focus"
              >
                All Assets
              </Link>
            </li>
            <li className="text-base-content/70">{asset.productName}</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-base-100 rounded-xl shadow-sm p-4">
              <img
                src={asset.productImage}
                alt={asset.productName}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

          </div>

          {/* Asset Information */}
          <div className="space-y-6">
            <div className="bg-base-100 rounded-xl shadow-sm p-6">
              <h1 className="text-3xl font-bold text-primary mb-4">
                {asset.productName}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`badge badge-lg ${
                    asset.productType === "Returnable"
                      ? "badge-success"
                      : "badge-info"
                  }`}
                >
                  {asset.productType}
                </span>
                <span
                  className={`badge badge-lg ${
                    asset.productQuantity > 0 ? "badge-info" : "badge-error"
                  }`}
                >
                  {asset.productQuantity > 0
                    ? `${asset.productQuantity} Available`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Asset Code:</span>
                  <span className="font-mono text-sm">
                    {asset.assetCode || asset._id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Asset Type:</span>
                  <span>{asset.productType}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Availability:</span>
                  <span
                    className={
                      asset.productQuantity > 0 ? "text-success" : "text-error"
                    }
                  >
                    {asset.productQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Quantity:</span>
                  <span className="font-semibold">{asset.productQuantity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Date Added:</span>
                  <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
                {(role === "admin" || role === "hr") && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-base-300">
                      <span className="font-medium">Company:</span>
                      <span>{asset.companyName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-300">
                      <span className="font-medium">HR:</span>
                      <span>{asset.hrEmail || "N/A"}</span>
                    </div>
                  </>
                )}
                {asset.assignedTo && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-base-300">
                      <span className="font-medium">Assigned To:</span>
                      <span>
                        {asset.assignedEmployeeName || asset.assignedTo}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-base-300">
                      <span className="font-medium">Assigned Date:</span>
                      <span>
                        {asset.assignedDate
                          ? new Date(asset.assignedDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    {asset.expectedReturnDate && (
                      <div className="flex justify-between items-center py-2 border-b border-base-300">
                        <span className="font-medium">Expected Return:</span>
                        <span>
                          {new Date(
                            asset.expectedReturnDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="font-medium">Request Count:</span>
                  <span>{asset.requestCount || 0}</span>
                </div>
              </div>

              <div className="space-y-3">
                {role === "employee" && (
                  <button
                    onClick={handleRequestAsset}
                    disabled={asset.productQuantity === 0}
                    className="btn btn-primary w-full btn-lg"
                  >
                    {asset.productQuantity === 0 ? (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                          />
                        </svg>
                        Out of Stock
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Request This Asset
                      </>
                    )}
                  </button>
                )}

                {role === "hr" && (
                  <div className="alert alert-info">
                    <svg
                      className="w-5 h-5"
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
                    <span>
                      As HR, you can manage this asset from your dashboard
                    </span>
                  </div>
                )}

                {role === "admin" && (
                  <div className="alert alert-success">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Admin view - You can see all the assets</span>
                  </div>
                )}

                <Link
                  to="/assets"
                  className="btn btn-outline btn-primary w-full"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to All Assets
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Description */}
        <div className="bg-base-100 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Description</h2>
          <div className="prose max-w-none">
            <p className="text-base-content/80 leading-relaxed">
              {asset.description ||
                `The ${
                  asset.productName
                } is a ${asset.productType.toLowerCase()} asset available for organizational use. This asset is currently ${
                  asset.productQuantity > 0 ? "available" : "out of stock"
                } and can be requested through our asset management system.`}
            </p>
          </div>
        </div>

        {/* Asset Specifications */}
        <div className="bg-base-100 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Asset Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-secondary">
                Basic Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Asset ID:</span>
                  <span className="font-mono">{asset._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Asset Code:</span>
                  <span className="font-mono">{asset.assetCode || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Category:</span>
                  <span>{asset.productType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Status:</span>
                  <span
                    className={
                      asset.productQuantity > 0 ? "text-success" : "text-error"
                    }
                  >
                    {asset.status ||
                      (asset.productQuantity > 0
                        ? "Available"
                        : "Out of Stock")}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-secondary">
                Availability
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Total Quantity:</span>
                  <span className="font-semibold">{asset.productQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Available:</span>
                  <span className="text-success">{asset.productQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Assigned:</span>
                  <span className="text-warning">
                    {asset.assignedTo ? 1 : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Request Count:</span>
                  <span>{asset.requestCount || 0}</span>
                </div>
              </div>
            </div>

            {(role === "admin" || role === "hr") && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-secondary">
                  Organization
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Company:</span>
                    <span>{asset.companyName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">HR:</span>
                    <span>{asset.hrEmail || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Date Added:</span>
                    <span>
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Information (if assigned) */}
        {asset.assignedTo && (
          <div className="bg-base-100 rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Current Assignment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-secondary">
                  Assigned Employee
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Employee:</span>
                    <span>{asset.assignedEmployeeName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Email:</span>
                    <span>{asset.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Assigned Date:</span>
                    <span>
                      {asset.assignedDate
                        ? new Date(asset.assignedDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {asset.productType === "Returnable" && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-secondary">
                    Return Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">
                        Expected Return:
                      </span>
                      <span>
                        {asset.expectedReturnDate
                          ? new Date(
                              asset.expectedReturnDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">
                        Return Status:
                      </span>
                      <span className="text-warning">Pending Return</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Information */}
        <div className="bg-base-100 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Key Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Asset Details</h3>
              <ul className="space-y-2 text-base-content/80">
                <li>• Asset Name: {asset.productName}</li>
                <li>• Type: {asset.productType}</li>
                <li>• Current Stock: {asset.productQuantity} units</li>
                <li>
                  • Status:{" "}
                  {asset.productQuantity > 0 ? "Available" : "Out of Stock"}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {role === "employee"
                  ? "Request Information"
                  : role === "hr"
                  ? "Management Options"
                  : "Admin Information"}
              </h3>
              <ul className="space-y-2 text-base-content/80">
                {role === "employee" && (
                  <>
                    <li>• Login required to request</li>
                    <li>• Subject to approval process</li>
                    <li>
                      •{" "}
                      {asset.productType === "Returnable"
                        ? "Must be returned after use"
                        : "Non-returnable item"}
                    </li>
                    <li>• Request tracking available</li>
                  </>
                )}
                {role === "hr" && (
                  <>
                    <li>• Manage from dashboard</li>
                    <li>• Edit asset details</li>
                    <li>• View request history</li>
                    <li>• Approve/reject requests</li>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <li>• System-wide asset view</li>
                    <li>• Cross-organization visibility</li>
                    <li>• Full administrative access</li>
                    <li>• Analytics and reporting</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Assets */}
        {relatedAssets.length > 0 && (
          <div className="bg-base-100 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Related Assets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedAssets.map((relatedAsset) => (
                <Link
                  key={relatedAsset._id}
                  to={`/asset/${relatedAsset._id}`}
                  className="card bg-base-200 hover:bg-base-300 transition-colors duration-200"
                >
                  <figure className="px-4 pt-4">
                    <img
                      src={relatedAsset.productImage}
                      alt={relatedAsset.productName}
                      className="rounded-lg h-32 w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/200x150?text=No+Image";
                      }}
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm line-clamp-2">
                      {relatedAsset.productName}
                    </h3>
                    <span
                      className={`badge badge-sm ${
                        relatedAsset.productQuantity > 0
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {relatedAsset.productQuantity > 0
                        ? "Available"
                        : "Out of Stock"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetails;