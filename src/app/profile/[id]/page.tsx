'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NotesSection from '@/components/NotesSection';

interface Jobseeker {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience_years: number;
  skills: string;
  status: string;
  created_at: string;
}

export default function JobseekerProfile() {
  const params = useParams();
  const jobseekerId = params.id as string;
  const [jobseeker, setJobseeker] = useState<Jobseeker | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobseeker = async () => {
      try {
        const response = await fetch(`/api/jobseeker/${jobseekerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobseeker data');
        }
        const data = await response.json();
        setJobseeker(data.data);
      } catch (error) {
        console.error('Error fetching jobseeker:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobseeker();
  }, [jobseekerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!jobseeker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Jobseeker Not Found</h1>
          <Link href="/jobseekers" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
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
                href="/jobseekers"
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Jobseeker Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                jobseeker.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {jobseeker.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {jobseeker?.name ? jobseeker.name.split(' ').map(n => n[0]).join('') : ''}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{jobseeker.name}</h2>
                <p className="text-gray-600">{jobseeker.email}</p>
                <p className="text-gray-600">{jobseeker.phone}</p>
                <p className="text-gray-600">{jobseeker.location}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {jobseeker.experience_years} years of experience
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Notes
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {jobseeker?.skills ? jobseeker.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    )) : null}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Experience</dt>
                      <dd className="mt-1 text-sm text-gray-900">{jobseeker.experience_years} years</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{jobseeker.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">{jobseeker.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Join Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(jobseeker.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <NotesSection jobseekerId={parseInt(jobseekerId)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
