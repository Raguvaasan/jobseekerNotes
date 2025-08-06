import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Jobseeker Not Found</h1>
        <Link href="/jobseekers" className="text-blue-600 hover:text-blue-800">
          Back to Jobseekers
        </Link>
      </div>
    </div>
  );
}
