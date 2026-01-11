import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router";

const PaymentCancelled = () => {
  return (
    <div className="py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-lg shadow-sm shadow-neutral bg-base-100">
      <Helmet>
        <title>Payment Cancelled - AssetVerse | Payment Not Completed</title>
        <meta name="description" content="Your payment was cancelled. You can try again or contact support if you need assistance." />
      </Helmet>
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
        Payment is Canceled. Please try again
      </h2>
      <Link to="/dashboard/upgrade-package-hr">
        <button className="btn bg-primary">Try Again</button>
      </Link>
    </div>
  );
};

export default PaymentCancelled;
