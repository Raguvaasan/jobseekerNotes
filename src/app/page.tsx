import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-black mb-4">
            Jobseeker Profile Management
          </h1>
          <p className="text-2xl text-gray-800 font-semibold mb-8">
            Manage jobseeker profiles with advanced note-taking functionality
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/jobseekers"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              View Jobseekers
            </Link>
            <Link 
              href="/profile/1"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Demo Profile
            </Link>
            <Link 
              href="/test"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Test System
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 text-2xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2 text-black">Add Notes</h3>
            <p className="text-gray-800 font-medium">
              Add detailed notes to jobseeker profiles with minimum 20 characters requirement.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-green-600 text-2xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2 text-black">Role-Based Access</h3>
            <p className="text-gray-800 font-medium">
              Only Recruitment Executives and higher roles can add, edit, or delete notes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-purple-600 text-2xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-black">Track History</h3>
            <p className="text-gray-800 font-medium">
              View all notes with timestamps and user information for complete traceability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
