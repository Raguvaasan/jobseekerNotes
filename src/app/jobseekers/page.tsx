'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Jobseeker {
  id: number;
  name: string;
  email: string;
  location: string;
  experience_years: number;
  skills: string;
  status: string;
}

export default function JobseekersPage() {
  const [jobseekers, setJobseekers] = useState<Jobseeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchJobseekers() {
      try {
        setLoading(true);
        const response = await fetch('/api/jobseekers');
        const data = await response.json();
        
        if (data.success) {
          setJobseekers(data.data);
        } else {
          console.error('Failed to fetch jobseekers:', data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobseekers:', error);
        setLoading(false);
      }
    }

    fetchJobseekers();
  }, []);

  const filteredJobseekers = jobseekers.filter(jobseeker =>
    jobseeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobseeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jobseeker.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Jobseekers</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Jobseekers
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or skills..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredJobseekers.length} of {jobseekers.length} jobseekers
          </p>
        </div>

        {/* Jobseekers Grid */}
        {filteredJobseekers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No jobseekers found</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobseekers.map((jobseeker) => (
              <div key={jobseeker.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {jobseeker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {jobseeker.name}
                        </h3>
                        <p className="text-sm text-gray-500">{jobseeker.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      jobseeker.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {jobseeker.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{jobseeker.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2">{jobseeker.experience_years} years</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {jobseeker.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                      {jobseeker.skills.split(',').length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{jobseeker.skills.split(',').length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/profile/${jobseeker.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors inline-block text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
