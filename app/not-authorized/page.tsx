export default function NotAuthorizedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-3xl font-semibold text-red-600">403 - Access Denied</h2>
          <p className="mt-4 text-gray-600">
            You do not have the necessary permissions to access this page.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please contact an administrator if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
}