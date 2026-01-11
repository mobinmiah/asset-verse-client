import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      const confirmPayment = async () => {
        try {
          const res = await axiosSecure.patch("/payment-success", { sessionId });
          if (res.data.success) {
            Swal.fire("Success!", res.data.message, "success");
            navigate("/dashboard/my-profile");
          }
        } catch (error) {
          Swal.fire("Error", "Failed to update plan", error);
          navigate("/dashboard/my-profile");
        }
      };

      confirmPayment();
    }
  }, [sessionId, navigate, axiosSecure]);

  return (
    <div className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <Helmet>
        <title>Payment Success - AssetVerse | Payment Confirmed</title>
        <meta name="description" content="Your payment has been processed successfully. Your subscription has been updated." />
      </Helmet>
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
        Processing your payment...
      </h2>
    </div>
  );
};

export default PaymentSuccess;
