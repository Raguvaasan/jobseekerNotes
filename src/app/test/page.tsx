'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName: string, testFunction: () => Promise<boolean>) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
    }
    setLoading(false);
  };

  const testApiConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/jobseeker/1/notes');
      return response.ok;
    } catch {
      return false;
    }
  };

  const testAddNote = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/jobseeker/1/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'This is a test note with more than 20 characters to meet the minimum requirement.' })
      });
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  };

  const testValidation = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/jobseeker/1/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Short note' })
      });
      const data = await response.json();
      return !data.success && response.status === 400;
    } catch {
      return false;
    }
  };

  const runAllTests = async () => {
    await runTest('API Connection', testApiConnection);
    await runTest('Add Note', testAddNote);
    await runTest('Validation', testValidation);
  };

  const getStatusIcon = (testName: string) => {
    if (!(testName in testResults)) return '⏳';
    return testResults[testName] ? '✅' : '❌';
  };

  const getStatusText = (testName: string) => {
    if (!(testName in testResults)) return 'Not run';
    return testResults[testName] ? 'Passed' : 'Failed';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-black">System Tests</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-black">API Tests</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-bold text-black">API Connection Test</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStatusIcon('API Connection')}</span>
                    <span className="text-sm font-semibold text-black">{getStatusText('API Connection')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-bold text-black">Add Note Test</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStatusIcon('Add Note')}</span>
                    <span className="text-sm font-semibold text-black">{getStatusText('Add Note')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-bold text-black">Validation Test</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStatusIcon('Validation')}</span>
                    <span className="text-sm font-semibold text-black">{getStatusText('Validation')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={runAllTests}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </button>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4 text-black">Manual Testing Links</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/profile/1"
                  className="block p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
                >
                  <h3 className="font-bold text-blue-900">Test Profile Page</h3>
                  <p className="text-sm text-blue-800 font-medium">Test the complete notes functionality</p>
                </Link>

                <Link
                  href="/jobseekers"
                  className="block p-4 bg-green-50 border border-green-200 rounded hover:bg-green-100"
                >
                  <h3 className="font-bold text-green-900">Test Jobseekers List</h3>
                  <p className="text-sm text-green-800 font-medium">Test navigation and search functionality</p>
                </Link>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4 text-black">Features Checklist</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-black">Frontend Features</h3>
                  <div className="space-y-1 text-sm">
                    <div className="text-black font-medium">✅ Jobseeker Profile Page</div>
                    <div className="text-black font-medium">✅ Notes Tab/Section</div>
                    <div className="text-black font-medium">✅ Add Note Form (min 20 chars)</div>
                    <div className="text-black font-medium">✅ Save Note Button</div>
                    <div className="text-black font-medium">✅ Display Notes with Date & User</div>
                    <div className="text-black font-medium">✅ Edit/Delete with Confirmation</div>
                    <div className="text-black font-medium">✅ Role-based Access Control</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-black">Backend Features</h3>
                  <div className="space-y-1 text-sm">
                    <div className="text-black font-medium">✅ API Endpoints (/api/jobseeker/id/notes)</div>
                    <div className="text-black font-medium">✅ MySQL Database Integration</div>
                    <div className="text-black font-medium">✅ Input Validation (20+ chars)</div>
                    <div className="text-black font-medium">✅ Error Handling</div>
                    <div className="text-black font-medium">✅ User Tracking (created_by)</div>
                    <div className="text-black font-medium">✅ CRUD Operations</div>
                    <div className="text-black font-medium">✅ TypeScript Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
