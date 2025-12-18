import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://asset-verse-server-dun.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;