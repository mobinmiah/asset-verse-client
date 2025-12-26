import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";
import useAuth from "../../../hooks/useAuth";

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Fetch user profile (assigned assets)
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Fetch approved asset requests
  const { data: approvedAssets = [] } = useQuery({
    queryKey: ["employee-approved-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/asset-requests/employee?status=approved"
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

 const mergedAssets = (profile.assets || []).map((asset) => {
   // Find the approved request that matches this asset
   const request = approvedAssets.find(
     (r) => r.assetId === asset.assetId && r.status === "approved"
   );

   return {
     ...asset,
     status: request?.status || asset.status || "pending",
     requestDate: request?.requestDate || asset.requestDate,
     approvalDate: request?.actionDate || asset.approvalDate,
     companyName: request?.companyName || asset.companyName,
   };
 });

  // Filter by search and type
  const filteredAssets = mergedAssets.filter(
    (asset) =>
      asset.productName.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? asset.productType === typeFilter : true)
  );

  return (
    <div className="p-6 space-y-4">
      <Helmet>
        <title>My Assets | AssetVerse</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">My Assets</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search asset..."
            className="input"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select border-primary outline-none"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>

          <button onClick={() => window.print()} className="btn btn-primary">
            Print
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Asset</th>
              <th>HR Email</th>
              <th>Request Date</th>
              <th>Approval Date</th>
              <th>Status</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <tr key={asset.assetId}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={asset.productImage}
                            alt={asset.productName}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{asset.productName}</div>
                        <div className="text-sm opacity-50">
                          {asset.companyName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{asset.hrEmail}</td>
                  <td>{new Date(asset.requestDate).toLocaleDateString()}</td>
                  <td>{new Date(asset.approvalDate).toLocaleDateString()}</td>
                  <td>{asset.status || "approved"}</td>
                  <td>{asset.productType}</td>
                  <td>
                    {asset.productType === "Returnable" &&
                    asset.status === "approved" ? (
                      <button className="btn btn-xs btn-primary">Return</button>
                    ) : (
                      <p>Not Returnable</p>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssets;
