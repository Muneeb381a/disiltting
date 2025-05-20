import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  MapPinIcon,
  InformationCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';

// Mock API (simulating backend for demo purposes)
const mockApi = {
  get: async () => ({
    data: [
      {
        submission_id: '1',
        task_id: '1',
        task_description: 'Repair pipeline leak near Madina Town',
        phase: 'Start',
        location: { lat: 31.4504, lng: 73.1350 },
        images: [
          'https://via.placeholder.com/150?text=Before',
          'https://via.placeholder.com/150?text=After',
        ],
        length_completed: 0,
        notes: 'Initial site inspection completed.',
        status: 'Pending',
        submitted_at: '2025-05-20 09:00 AM',
      },
      {
        submission_id: '2',
        task_id: '1',
        task_description: 'Repair pipeline leak near Madina Town',
        phase: 'Progress',
        location: { lat: 31.4505, lng: 73.1351 },
        images: ['https://via.placeholder.com/150?text=Progress'],
        length_completed: 200,
        notes: 'Repaired 200m of pipeline.',
        status: 'Pending',
        submitted_at: '2025-05-20 02:00 PM',
      },
      {
        submission_id: '3',
        task_id: '2',
        task_description: 'Clean sewer line in Peoples Colony',
        phase: 'End',
        location: { lat: 31.3978, lng: 73.1234 },
        images: ['https://via.placeholder.com/150?text=Completed'],
        length_completed: 300,
        notes: 'Sewer cleaning completed.',
        status: 'Approved',
        submitted_at: '2025-05-19 05:00 PM',
      },
    ],
  }),
  put: async (url, data) => {
    if (Math.random() < 0.1) throw new Error('Mock API failure');
    return { status: 200 };
  },
};

const SubmissionReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTaskId, setFilterTaskId] = useState('');
  const [sortBy, setSortBy] = useState('submitted_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImageModal, setShowImageModal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const submissionsPerPage = 5;

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const res = await mockApi.get('/submissions');
        setSubmissions(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submissions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // Handle approve/reject actions
  const handleAction = async (submissionId, action) => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this submission?`)) return;
    setIsLoading(true);
    try {
      await mockApi.put(`/submissions/${submissionId}`, { status: action });
      setSubmissions(submissions.map(s =>
        s.submission_id === submissionId ? { ...s, status: action } : s
      ));
      setError(null);
    } catch (err) {
      setError(`Error ${action.toLowerCase()} submission: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Export submissions as JSON
  const handleExport = () => {
    const filteredSubmissions = submissions.filter(
      (s) =>
        (!filterStatus || s.status === filterStatus) &&
        (!filterTaskId || s.task_id === filterTaskId)
    );
    const dataStr = JSON.stringify(filteredSubmissions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wasa-submissions-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter(
      (s) =>
        (!filterStatus || s.status === filterStatus) &&
        (!filterTaskId || s.task_id === filterTaskId)
    )
    .sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (sortBy === 'submitted_at') {
        return sortOrder === 'asc'
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * submissionsPerPage,
    currentPage * submissionsPerPage
  );

  // Unique task IDs for filter
  const uniqueTaskIds = [...new Set(submissions.map((s) => s.task_id))];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <CheckCircleIcon className="h-10 w-10 mr-4" />
            WASA Faisalabad Submission Review
          </h2>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-8 p-4 rounded-lg flex items-center bg-red-50 text-red-700 border border-red-200">
              <InformationCircleIcon className="h-6 w-6 mr-3" />
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center mb-8">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
            </div>
          )}

          {/* Filters and Export */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-4 w-full sm:w-auto">
              <div className="relative flex-1">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="relative flex-1">
                <select
                  value={filterTaskId}
                  onChange={(e) => setFilterTaskId(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                >
                  <option value="">All Tasks</option>
                  {uniqueTaskIds.map((taskId) => (
                    <option key={taskId} value={taskId}>
                      Task #{taskId}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-200 shadow-md"
              aria-label="Export Submissions"
            >
              {/* <DownloadIcon className="h-5 w-5 mr-2" /> */}
              Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'task_id', label: 'Task ID' },
                    { key: 'task_description', label: 'Description' },
                    { key: 'phase', label: 'Phase' },
                    { key: 'images', label: 'Images' },
                    { key: 'location', label: 'Location' },
                    { key: 'length_completed', label: 'Length (m)' },
                    { key: 'status', label: 'Status' },
                    { key: 'submitted_at', label: 'Submitted' },
                    { key: 'actions', label: 'Actions' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => col.key !== 'images' && col.key !== 'actions' && handleSort(col.key)}
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSubmissions.map((s) => (
                  <tr
                    key={s.submission_id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{s.task_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {s.task_description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {s.phase}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {s.images.map((img, idx) => (
                          <button
                            key={idx}
                            className="relative group"
                            onClick={() => setShowImageModal({ submission: s, imageIndex: idx })}
                            aria-label={`View image ${idx + 1}`}
                          >
                            <PhotoIcon
                              className={`h-12 w-12 ${
                                idx === 0 ? 'text-blue-500' : 'text-green-500'
                              }`}
                            />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {idx === 0 ? 'Before' : 'After'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="inline-flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-red-500" />
                        {s.location.lat.toFixed(4)}, {s.location.lng.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {s.length_completed || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          s.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : s.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {s.submitted_at}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAction(s.submission_id, 'Approved')}
                          className="text-green-600 hover:text-green-800 flex items-center transition-colors duration-200"
                          disabled={isLoading || s.status !== 'Pending'}
                          aria-label="Approve submission"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(s.submission_id, 'Rejected')}
                          className="text-red-600 hover:text-red-800 flex items-center transition-colors duration-200"
                          disabled={isLoading || s.status !== 'Pending'}
                          aria-label="Reject submission"
                        >
                          <XCircleIcon className="h-5 w-5 mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => setShowDetailsModal(s)}
                          className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                          aria-label="View details"
                        >
                          <EyeIcon className="h-5 w-5 mr-1" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-all duration-200"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Image Modal */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-auto shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Image Gallery - Task #{showImageModal.submission.task_id} ({showImageModal.submission.phase})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {showImageModal.submission.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Submission image ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                      <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs rounded py-1 px-2">
                        {idx === 0 ? 'Before' : 'After'}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowImageModal(null)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md"
                  aria-label="Close image modal"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Details Modal */}
          {showDetailsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-auto shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Submission Details - Task #{showDetailsModal.task_id}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p><strong>Task Description:</strong> {showDetailsModal.task_description}</p>
                    <p><strong>Phase:</strong> {showDetailsModal.phase}</p>
                    <p>
                      <strong>Location:</strong>{' '}
                      {showDetailsModal.location.lat.toFixed(4)},{' '}
                      {showDetailsModal.location.lng.toFixed(4)}
                    </p>
                    <p><strong>Length Completed:</strong> {showDetailsModal.length_completed || 'N/A'} meters</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong> {showDetailsModal.status}</p>
                    <p><strong>Submitted At:</strong> {showDetailsModal.submitted_at}</p>
                    <p><strong>Notes:</strong> {showDetailsModal.notes || 'N/A'}</p>
                    <p>
                      <strong>Images:</strong>{' '}
                      {showDetailsModal.images.length} image(s) available
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(null)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md"
                  aria-label="Close details modal"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionReview;