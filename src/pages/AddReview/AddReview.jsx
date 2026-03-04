import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const AddReview = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [reviewData, setReviewData] = useState(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: profile = {}, isLoading: profileLoading } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { isFetching: isPending } = useQuery({
    queryKey: ["submit-review", reviewData],
    enabled: shouldSubmit && !!reviewData,
    queryFn: async () => {
      const res = await axiosSecure.post("/reviews", reviewData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Review submitted successfully!");
      reset();
      setReviewData(null);
      setShouldSubmit(false);
      setSelectedRating(0);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
      setShouldSubmit(false);
    },
  });

  const handleAddReview = (data) => {
    if (!profile?.name) {
      toast.error("Profile name is missing. Please update your profile.");
      return;
    }

    if (!profile?.role) {
      toast.error("Profile role is missing. Please update your profile.");
      return;
    }

    const companyName = profile?.companyName || profile?.company || profile?.affiliations?.[0]?.companyName;
    if (!companyName) {
      toast.error("Company information is missing. Please update your profile.");
      return;
    }

    const review = {
      name: profile.name,
      role: profile.role,
      company: companyName,
      image: profile?.photo || profile?.companyLogo || "",
      content: data.content,
      rating: Number(data.rating),
      createdAt: new Date().toLocaleString(),
    };

    setReviewData(review);
    setShouldSubmit(true);
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  if (profileLoading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Share Your Experience - AssetVerse</title>
        <meta name="description" content="Share your experience with AssetVerse and help others discover how we can transform their asset management." />
      </Helmet>

      <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              💬 Your Feedback Matters
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content mb-4">
              Share Your <span className="text-primary">Experience</span>
            </h1>
            <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto">
              Help others discover how AssetVerse can transform their asset management journey
            </p>
          </div>

          {/* Warning Alert */}
          {(!profile?.name || !profile?.role || (!profile?.companyName && !profile?.company && !profile?.affiliations?.[0]?.companyName)) && (
            <div className="alert alert-warning mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Some profile information is missing. Please ensure your profile is complete before submitting a review.</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Side - Form */}
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaQuoteLeft className="text-3xl text-primary/30" />
                <h2 className="text-2xl font-bold text-base-content">
                  Write Your Review
                </h2>
              </div>

              <form onSubmit={handleSubmit(handleAddReview)} className="space-y-6">
                {/* Rating Section */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-base">How would you rate your experience?</span>
                  </label>
                  <div className="flex gap-2 justify-center sm:justify-start py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all duration-200 hover:scale-110"
                      >
                        <FaStar
                          className={`text-4xl sm:text-5xl transition-colors ${
                            star <= (hoveredRating || selectedRating)
                              ? "text-warning fill-warning"
                              : "text-base-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    {...register("rating", { required: "Please select a rating" })}
                  />
                  {errors.rating && (
                    <p className="text-error text-sm mt-2">{errors.rating.message}</p>
                  )}
                  {selectedRating > 0 && (
                    <p className="text-center sm:text-left text-sm text-base-content/60 mt-2">
                      {selectedRating === 5 && "⭐ Excellent!"}
                      {selectedRating === 4 && "👍 Great!"}
                      {selectedRating === 3 && "😊 Good"}
                      {selectedRating === 2 && "😐 Fair"}
                      {selectedRating === 1 && "😞 Needs Improvement"}
                    </p>
                  )}
                </div>

                {/* Review Content */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-base">Share your thoughts</span>
                    <span className="label-text-alt text-base-content/60">Min. 10 characters</span>
                  </label>
                  <textarea
                    placeholder="Tell us about your experience with AssetVerse. What features do you love? How has it helped your organization?"
                    rows={6}
                    className="textarea textarea-bordered w-full text-base focus:textarea-primary transition-all"
                    {...register("content", {
                      required: "Review content is required",
                      minLength: {
                        value: 10,
                        message: "Minimum 10 characters required",
                      },
                    })}
                  />
                  {errors.content && (
                    <p className="text-error text-sm mt-2">{errors.content.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full text-base sm:text-lg h-12 sm:h-14"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Preview & Info */}
            <div className="space-y-6">
              {/* Profile Preview */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-base-300 p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-base-content mb-4">Review Preview</h3>
                <div className="bg-base-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                      <img
                        src={profile?.photo || profile?.companyLogo || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}`}
                        alt={profile?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{profile?.name || "Your Name"}</h4>
                      <p className="text-sm text-base-content/60">{profile?.role ? profile.role.toUpperCase() : "Your Role"}</p>
                      <p className="text-sm text-primary font-medium">
                        {profile?.companyName || profile?.company || "Your Company"}
                      </p>
                    </div>
                  </div>
                  {selectedRating > 0 && (
                    <div className="flex gap-1 mb-3">
                      {[...Array(selectedRating)].map((_, i) => (
                        <FaStar key={i} className="text-warning fill-warning text-lg" />
                      ))}
                    </div>
                  )}
                  <p className="text-base-content/70 text-sm italic">
                    "Your review will appear here..."
                  </p>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-base-100 rounded-2xl border border-base-300 p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-base-content mb-4">💡 Tips for a Great Review</h3>
                <ul className="space-y-3 text-sm text-base-content/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Be specific about features you found helpful</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Share how AssetVerse improved your workflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Mention any standout experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Keep it honest and constructive</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReview;
