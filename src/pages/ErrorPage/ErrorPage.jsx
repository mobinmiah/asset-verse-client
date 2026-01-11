import { Helmet } from "react-helmet";
import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Helmet>
        <title>Error {error?.status || 404} - AssetVerse | Page Not Found</title>
        <meta name="description" content="The page you are looking for could not be found. Return to AssetVerse homepage or try again." />
      </Helmet>
      
      <div className="bg-base-100 shadow-xl rounded-2xl p-10 max-w-md w-full text-center hover:shadow-2xl transition-all duration-300">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">😵</div>
          <h1 className="text-6xl font-bold text-error mb-4 animate-pulse">
            {error?.status || 404}
          </h1>
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-primary">
         Oops! Something went wrong
        </h2>

        <p className="text-base-content/70 mb-6 leading-relaxed">
          {error?.statusText ||
            error?.message ||
            "The page you are looking for doesn't exist or has been moved."}
        </p>

        <div className="space-y-3">
          <Link 
            to="/" 
            className="btn btn-primary w-full hover:scale-105 transition-transform duration-200"
          >
            🏠 Go Back Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline btn-primary w-full hover:scale-105 transition-transform duration-200"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;