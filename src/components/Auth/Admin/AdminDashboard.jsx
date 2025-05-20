import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import SubmissionReview from './SubmissionReview'; // Import from previous artifact

// Mock API for dashboard data
const mockApi = {
  get: async (endpoint) => {
    if (endpoint === '/dashboard') {
      return {
        data: {
          kpis: {
            totalSubmissions: 25,
            pendingApprovals: 8,
            completedTasks: 10,
            totalLengthCompleted: 2500, // meters
          },
          tasks: [
            {
              task_id: '1',
              description: 'Repair pipeline leak near Madina Town',
              total_length: 500,
              length_completed: 400,
              status: 'In Progress',
              due_date: '2025-05-25',
            },
            {
              task_id: '2',
              description: 'Clean sewer line in Peoples Colony',
              total_length: 300,
              length_completed: 300,
              status: 'Completed',
              due_date: '2025-05-22',
            },
          ],
        },
      };
    }
    throw new Error('Unknown endpoint');
  },
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [kpis, setKpis] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await mockApi.get('/dashboard');
        setKpis(res.data.kpis);
        setTasks(res.data.tasks);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Export tasks as CSV
  const handleExportTasks = () => {
    const headers = ['Task ID,Description,Total Length (m),Length Completed (m),Status,Due Date'];
    const rows = tasks.map(
      (t) =>
        `${t.task_id},"${t.description}",${t.total_length},${t.length_completed},${t.status},${t.due_date}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wasa-tasks-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'submissions', label: 'Submissions', icon: DocumentTextIcon },
    { id: 'tasks', label: 'Tasks', icon: ClipboardDocumentListIcon },
  ];

  // Filter tasks by search query
  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <CheckCircleIcon className="h-8 w-8 mr-2" />
            WASA Admin
          </h2>
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } transition-colors duration-200`}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <button
              className="lg:hidden text-gray-600"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              WASA Faisalabad Admin Dashboard
            </h1>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="rounded-lg border border-gray-300 bg-gray-50 p-2 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                aria-label="Search tasks"
              />
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg flex items-center bg-red-50 text-red-700 border border-red-200">
              <CheckCircleIcon className="h-6 w-6 mr-3" />
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center mb-6">
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

          {/* Overview Section */}
          {activeSection === 'overview' && kpis && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-3 text-blue-600" />
                Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <h3 className="text-sm font-medium text-gray-600">Total Submissions</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{kpis.totalSubmissions}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <h3 className="text-sm font-medium text-gray-600">Pending Approvals</h3>
                  <p className="mt-2 text-3xl font-bold text-yellow-600">{kpis.pendingApprovals}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <h3 className="text-sm font-medium text-gray-600">Completed Tasks</h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">{kpis.completedTasks}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                  <h3 className="text-sm font-medium text-gray-600">Total Length Completed</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{kpis.totalLengthCompleted} m</p>
                </div>
              </div>
            </div>
          )}

          {/* Submissions Section */}
          {activeSection === 'submissions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
                Work Submissions
              </h2>
              <SubmissionReview />
            </div>
          )}

          {/* Tasks Section */}
          {activeSection === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <ClipboardDocumentListIcon className="h-6 w-6 mr-3 text-blue-600" />
                  Tasks
                </h2>
                <button
                  onClick={handleExportTasks}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md"
                  aria-label="Export tasks"
                >
                  {/* <DownloadIcon className="h-5 w-5 mr-2" /> */}
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTasks.map((task) => {
                      const completionPercentage = Math.min(
                        (task.length_completed / task.total_length) * 100,
                        100
                      ).toFixed(1);
                      return (
                        <tr
                          key={task.task_id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{task.task_id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            {task.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                              <span>{completionPercentage}%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {task.length_completed}/{task.total_length} m
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                task.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'In Progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {task.due_date}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;