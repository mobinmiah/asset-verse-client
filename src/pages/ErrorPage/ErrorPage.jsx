import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="bg-base-100 shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-error mb-4">
          {error?.status || 404}
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
         Something went wrong
        </h2>

        <p className="text-base-content/70 mb-6">
          {error?.statusText ||
            error?.message ||
            "The page you are looking for doesn’t exist."}
        </p>

        <Link to="/" className="btn btn-primary w-full">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
