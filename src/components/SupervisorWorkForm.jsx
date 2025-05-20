import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  MapPinIcon,
  PhotoIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Mock data for tasks assigned to the supervisor
const mockTasks = [
  {
    task_id: "1",
    description: "Repair pipeline leak near Madina Town",
    task_category: "Water Supply",
    task_type: "Pipeline Repair",
    team_name: "Pipeline Maintenance Crew",
    total_length: 500,
    due_date: "2025-05-25",
  },
  {
    task_id: "2",
    description: "Clean sewer line in Peoples Colony",
    task_category: "Sewerage",
    task_type: "Sewer Cleaning",
    team_name: "Sewerage Task Force",
    total_length: 300,
    due_date: "2025-05-22",
  },
];

// Mock work statuses
const mockWorkStatuses = ["Completed", "Partially Completed", "Paused"];

const SupervisorWorkForm = () => {
  const [activeTab, setActiveTab] = useState("start");
  const [selectedTask, setSelectedTask] = useState("");
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem("supervisorWorkFormDraft");
    return savedDraft
      ? JSON.parse(savedDraft)
      : {
          task_id: "",
          start_location: { lat: "", lng: "", timestamp: "" },
          start_images: [],
          start_notes: "",
          progress_length: "",
          progress_location: { lat: "", lng: "", timestamp: "" },
          progress_images: [],
          progress_notes: "",
          end_location: { lat: "", lng: "", timestamp: "" },
          end_images: [],
          end_length: "",
          end_status: "",
          end_remarks: "",
        };
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [filterTaskId, setFilterTaskId] = useState("");
  const [imagePreviews, setImagePreviews] = useState({
    start: [],
    progress: [],
    end: [],
  });

  // Debounce input changes
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Auto-save form data to localStorage
  useEffect(() => {
    const debouncedSave = debounce(() => {
      localStorage.setItem("supervisorWorkFormDraft", JSON.stringify(formData));
    }, 500);
    debouncedSave();
  }, [formData]);

  // Get live location
  const getLocation = (type, callback) => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
            timestamp: new Date().toLocaleString("en-PK", {
              timeZone: "Asia/Karachi",
            }),
          };
          callback(location);
          setIsLoading(false);
        },
        (error) => {
          setErrors((prev) => ({
            ...prev,
            [type]:
              "Unable to access location. Please allow location access or enter manually.",
          }));
          setIsLoading(false);
        }
      );
    } else {
      setErrors((prev) => ({
        ...prev,
        [type]: "Geolocation is not supported by your browser.",
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/png"];
    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Only JPEG or PNG images are allowed.",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Each image must be less than 5MB.",
        }));
        return;
      }
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (newImages.length + formData[`${type}_images`].length > 5) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Maximum 5 images allowed per section.",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [`${type}_images`]: [...prev[`${type}_images`], ...newImages],
    }));
    setImagePreviews((prev) => ({
      ...prev,
      [type]: [...prev[type], ...newPreviews],
    }));
    setErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  // Mock API function
  const mockApiPost = async (endpoint, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.1) {
          reject(new Error("Mock API failure"));
        } else {
          console.log("Mock API call:", { endpoint, data });
          resolve({ status: 200 });
        }
      }, 1000);
    });
  };

  const validateForm = (tab) => {
    const newErrors = {};
    if (!selectedTask) newErrors.task_id = "Please select a task.";
    if (tab === "start") {
      if (!formData.start_location.lat || !formData.start_location.lng)
        newErrors.start_location = "Live location is required.";
      if (formData.start_images.length === 0)
        newErrors.start_images = "At least one image is required.";
    }
    if (tab === "progress") {
      if (!formData.progress_length || formData.progress_length < 0)
        newErrors.progress_length =
          "Total length completed must be a non-negative number.";
      if (!formData.progress_location.lat || !formData.progress_location.lng)
        newErrors.progress_location = "Live location is required.";
      if (formData.progress_images.length === 0)
        newErrors.progress_images = "At least one image is required.";
    }
    if (tab === "end") {
      if (!formData.end_location.lat || !formData.end_location.lng)
        newErrors.end_location = "Live location is required.";
      if (formData.end_images.length === 0)
        newErrors.end_images = "At least one image is required.";
      if (!formData.end_length || formData.end_length < 0)
        newErrors.end_length =
          "Total length completed must be a non-negative number.";
      if (!formData.end_status)
        newErrors.end_status = "Work status is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, tab) => {
    e.preventDefault();
    if (!validateForm(tab)) {
      setSubmitMessage({
        type: "error",
        text: "Please fix the errors in the form.",
      });
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to submit the ${tab} work details?`
      )
    )
      return;
    setIsLoading(true);
    setSubmitMessage(null);
    try {
      const submissionData = {
        task_id: selectedTask,
        ...formData,
        phase: tab,
        submittedAt: new Date().toLocaleString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
      };
      await mockApiPost(`/work-submissions/${tab}`, submissionData);
      setSubmissionHistory([...submissionHistory, submissionData]);
      setSubmitMessage({
        type: "success",
        text: `${
          tab.charAt(0).toUpperCase() + tab.slice(1)
        } work details submitted successfully!`,
      });
      setFormData({
        task_id: "",
        start_location: { lat: "", lng: "", timestamp: "" },
        start_images: [],
        start_notes: "",
        progress_length: "",
        progress_location: { lat: "", lng: "", timestamp: "" },
        progress_images: [],
        progress_notes: "",
        end_location: { lat: "", lng: "", timestamp: "" },
        end_images: [],
        end_length: "",
        end_status: "",
        end_remarks: "",
      });
      setImagePreviews({ start: [], progress: [], end: [] });
      setSelectedTask("");
      localStorage.removeItem("supervisorWorkFormDraft");
      setErrors({});
      document.getElementById("task_id").focus();
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: `Error submitting ${tab} details: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the form? All unsaved data will be lost."
      )
    ) {
      setFormData({
        task_id: "",
        start_location: { lat: "", lng: "", timestamp: "" },
        start_images: [],
        start_notes: "",
        progress_length: "",
        progress_location: { lat: "", lng: "", timestamp: "" },
        progress_images: [],
        progress_notes: "",
        end_location: { lat: "", lng: "", timestamp: "" },
        end_images: [],
        end_length: "",
        end_status: "",
        end_remarks: "",
      });
      setImagePreviews({ start: [], progress: [], end: [] });
      setSelectedTask("");
      setErrors({});
      setSubmitMessage(null);
      localStorage.removeItem("supervisorWorkFormDraft");
      document.getElementById("task_id").focus();
    }
  };

  const handleExportHistory = () => {
    const dataStr = JSON.stringify(submissionHistory, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wasa-work-history-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedTaskData = mockTasks.find(
    (task) => task.task_id === selectedTask
  );
  const completionPercentage =
    selectedTaskData && formData.progress_length
      ? Math.min(
          (formData.progress_length / selectedTaskData.total_length) * 100,
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <DocumentTextIcon className="h-10 w-10 mr-4" />
            WASA Faisalabad Supervisor Work Submission
          </h2>
        </div>

        <div className="p-10">
          {submitMessage && (
            <div
              className={`mb-8 p-4 rounded-lg flex items-center ${
                submitMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <InformationCircleIcon className="h-6 w-6 mr-3" />
              {submitMessage.text}
            </div>
          )}

          {/* Task Selection */}
          <div className="mb-10">
            <label
              htmlFor="task_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Task
              <span
                className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                title="Select the task you are working on."
              >
                ?
              </span>
            </label>
            <div className="relative">
              <select
                id="task_id"
                value={selectedTask}
                onChange={(e) => {
                  setSelectedTask(e.target.value);
                  setFormData({ ...formData, task_id: e.target.value });
                }}
                className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                  errors.task_id ? "border-red-500" : ""
                }`}
                required
                aria-describedby={errors.task_id ? "task-id-error" : undefined}
              >
                <option value="" className="text-gray-500">
                  Select Task
                </option>
                {mockTasks.map((task) => (
                  <option key={task.task_id} value={task.task_id}>
                    {task.description} ({task.task_category})
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
            {errors.task_id && (
              <p id="task-id-error" className="mt-2 text-sm text-red-500">
                {errors.task_id}
              </p>
            )}
            {selectedTaskData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                <p>
                  <strong>Description:</strong> {selectedTaskData.description}
                </p>
                <p>
                  <strong>Category:</strong> {selectedTaskData.task_category}
                </p>
                <p>
                  <strong>Type:</strong> {selectedTaskData.task_type}
                </p>
                <p>
                  <strong>Team:</strong> {selectedTaskData.team_name}
                </p>
                <p>
                  <strong>Total Length:</strong> {selectedTaskData.total_length}{" "}
                  meters
                </p>
                <p>
                  <strong>Due Date:</strong> {selectedTaskData.due_date}
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {["start", "progress", "end"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`flex-1 py-4 px-6 text-sm font-medium text-center transition-all duration-200 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
                disabled={!selectedTask}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Work
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          {selectedTask && activeTab !== "start" && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Task Completion: {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Content */}
          {selectedTask && (
            <form
              onSubmit={(e) => handleSubmit(e, activeTab)}
              className="space-y-8"
            >
              {activeTab === "start" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-blue-600" />
                    Start Work
                  </h3>
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Live Location
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Capture your current location or enter coordinates manually."
                        >
                          ?
                        </span>
                      </label>
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={formData.start_location.lat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              start_location: {
                                ...formData.start_location,
                                lat: e.target.value,
                              },
                            })
                          }
                          className={`flex-1 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            errors.start_location ? "border-red-500" : ""
                          }`}
                          placeholder="Latitude"
                          aria-describedby={
                            errors.start_location
                              ? "start-location-error"
                              : undefined
                          }
                        />
                        <input
                          type="text"
                          value={formData.start_location.lng}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              start_location: {
                                ...formData.start_location,
                                lng: e.target.value,
                              },
                            })
                          }
                          className={`flex-1 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            errors.start_location ? "border-red-500" : ""
                          }`}
                          placeholder="Longitude"
                          aria-describedby={
                            errors.start_location
                              ? "start-location-error"
                              : undefined
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            getLocation("start_location", (location) =>
                              setFormData({
                                ...formData,
                                start_location: location,
                              })
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg flex items-center transition-all duration-200"
                          disabled={isLoading}
                        >
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          Get Location
                        </button>
                      </div>
                      {formData.start_location.timestamp && (
                        <p className="mt-2 text-sm text-gray-500">
                          Captured at: {formData.start_location.timestamp}
                        </p>
                      )}
                      {errors.start_location && (
                        <p
                          id="start-location-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.start_location}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="start_images"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Images
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Upload images of the work site (JPEG/PNG, max 5MB, up to 5 images)."
                        >
                          ?
                        </span>
                      </label>
                      <input
                        id="start_images"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleImageUpload(e, "start")}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        aria-describedby={
                          errors.start_images ? "start-images-error" : undefined
                        }
                      />
                      {imagePreviews.start.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {imagePreviews.start.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Start preview ${index + 1}`}
                              className="h-24 w-24 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                      {errors.start_images && (
                        <p
                          id="start-images-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.start_images}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="start_notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Notes
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Add any initial observations or notes."
                        >
                          ?
                        </span>
                      </label>
                      <textarea
                        id="start_notes"
                        value={formData.start_notes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_notes: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Initial observations or notes"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "progress" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-3 text-blue-600" />
                    Progress Update
                  </h3>
                  <div className="space-y-6">
                    <div className="relative">
                      <label
                        htmlFor="progress_length"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Total Length Completed (meters)
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Enter the total length of work completed so far."
                        >
                          ?
                        </span>
                      </label>
                      <input
                        id="progress_length"
                        type="number"
                        value={formData.progress_length}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            progress_length: e.target.value,
                          })
                        }
                        className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                          errors.progress_length ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., 200"
                        min="0"
                        step="0.1"
                        aria-describedby={
                          errors.progress_length
                            ? "progress-length-error"
                            : undefined
                        }
                      />
                      {errors.progress_length && (
                        <p
                          id="progress-length-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.progress_length}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Live Location
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Capture your current location or enter coordinates manually."
                        >
                          ?
                        </span>
                      </label>
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={formData.progress_location.lat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              progress_location: {
                                ...formData.progress_location,
                                lat: e.target.value,
                              },
                            })
                          }
                          className={`flex-1 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            errors.progress_location ? "border-red-500" : ""
                          }`}
                          placeholder="Latitude"
                          aria-describedby={
                            errors.progress_location
                              ? "progress-location-error"
                              : undefined
                          }
                        />
                        <input
                          type="text"
                          value={formData.progress_location.lng}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              progress_location: {
                                ...formData.progress_location,
                                lng: e.target.value,
                              },
                            })
                          }
                          className={`flex-1 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            errors.progress_location ? "border-red-500" : ""
                          }`}
                          placeholder="Longitude"
                          aria-describedby={
                            errors.progress_location
                              ? "progress-location-error"
                              : undefined
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            getLocation("progress_location", (location) =>
                              setFormData({
                                ...formData,
                                progress_location: location,
                              })
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg flex items-center transition-all duration-200"
                          disabled={isLoading}
                        >
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          Get Location
                        </button>
                      </div>
                      {formData.progress_location.timestamp && (
                        <p className="mt-2 text-sm text-gray-500">
                          Captured at: {formData.progress_location.timestamp}
                        </p>
                      )}
                      {errors.progress_location && (
                        <p
                          id="progress-location-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.progress_location}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="progress_images"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Images
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Upload images of the work in progress (JPEG/PNG, max 5MB, up to 5 images)."
                        >
                          ?
                        </span>
                      </label>
                      <input
                        id="progress_images"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleImageUpload(e, "progress")}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        aria-describedby={
                          errors.progress_images
                            ? "progress-images-error"
                            : undefined
                        }
                      />
                      {imagePreviews.progress.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {imagePreviews.progress.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Progress preview ${index + 1}`}
                              className="h-24 w-24 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                      {errors.progress_images && (
                        <p
                          id="progress-images-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.progress_images}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="progress_notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Notes
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Add any progress observations or notes."
                        >
                          ?
                        </span>
                      </label>
                      <textarea
                        id="progress_notes"
                        value={formData.progress_notes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            progress_notes: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Progress observations or notes"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "end" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <CheckCircleIcon className="h-6 w-6 mr-3 text-blue-600" />
                    End Work/Day
                  </h3>
                  <div className="space-y-6">
                    <div className="relative">
                      <label
                        htmlFor="end_length"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Total Length Completed (meters)
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Enter the final length of work completed."
                        >
                          ?
                        </span>
                      </label>
                      <input
                        id="end_length"
                        type="number"
                        value={formData.end_length}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            end_length: e.target.value,
                          })
                        }
                        className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                          errors.end_length ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., 500"
                        min="0"
                        step="0.1"
                        aria-describedby={
                          errors.end_length ? "end-length-error" : undefined
                        }
                      />
                      {errors.end_length && (
                        <p
                          id="end-length-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.end_length}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Live Location
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Capture your current location or enter coordinates manually."
                        >
                          ?
                        </span>
                      </label>
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={formData.end_location.lat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              end_location: {
                                ...formData.end_location,
                                lat: e.target.value,
                              },
                            })
                          }
                          className={`flex-1 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            errors.end_location ? "border-red-500" : ""
                          }`}
                          placeholder="Latitude"
                          aria-describedby={
                            errors.end_location
                              ? "end-location-error"
                              : undefined
                          }
                        />
                        <input
                          type="text"
                          value={formData.end_location.lng}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              end_location: {
                                ...formData.end_location,
                                lng: e.target.value,
                              },
                            })
                          }
                          className={`flex-1 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                            errors.end_location ? "border-red-500" : ""
                          }`}
                          placeholder="Longitude"
                          aria-describedby={
                            errors.end_location
                              ? "end-location-error"
                              : undefined
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            getLocation("end_location", (location) =>
                              setFormData({
                                ...formData,
                                end_location: location,
                              })
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg flex items-center transition-all duration-200"
                          disabled={isLoading}
                        >
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          Get Location
                        </button>
                      </div>
                      {formData.end_location.timestamp && (
                        <p className="mt-2 text-sm text-gray-500">
                          Captured at: {formData.end_location.timestamp}
                        </p>
                      )}
                      {errors.end_location && (
                        <p
                          id="end-location-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.end_location}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="end_images"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Images
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Upload images of the completed work (JPEG/PNG, max 5MB, up to 5 images)."
                        >
                          ?
                        </span>
                      </label>
                      <input
                        id="end_images"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={(e) => handleImageUpload(e, "end")}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        aria-describedby={
                          errors.end_images ? "end-images-error" : undefined
                        }
                      />
                      {imagePreviews.end.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {imagePreviews.end.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`End preview ${index + 1}`}
                              className="h-24 w-24 object-cover rounded-lg shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                      {errors.end_images && (
                        <p
                          id="end-images-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.end_images}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="end_status"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Work Status
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Select the status of the work at the end of the day."
                        >
                          ?
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          id="end_status"
                          value={formData.end_status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              end_status: e.target.value,
                            })
                          }
                          className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                            errors.end_status ? "border-red-500" : ""
                          }`}
                          required
                          aria-describedby={
                            errors.end_status ? "end-status-error" : undefined
                          }
                        >
                          <option value="" className="text-gray-500">
                            Select Work Status
                          </option>
                          {mockWorkStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
                      {errors.end_status && (
                        <p
                          id="end-status-error"
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.end_status}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="end_remarks"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Remarks
                        <span
                          className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                          title="Add any final remarks or observations."
                        >
                          ?
                        </span>
                      </label>
                      <textarea
                        id="end_remarks"
                        value={formData.end_remarks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            end_remarks: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        placeholder="Final remarks or observations"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="sticky bottom-0 bg-gradient-to-r from-blue-50 to-green-50 p-6 -mx-10 border-t border-gray-200 flex space-x-4">
                <button
                  type="submit"
                  className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md ${
                    isLoading || !selectedTask
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isLoading || !selectedTask}
                  aria-label={`Submit ${activeTab} Details`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
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
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                  )}
                  {isLoading
                    ? "Submitting..."
                    : `Submit ${
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                      } Details`}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md"
                  disabled={isLoading}
                  aria-label="Reset Form"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.confirm("Are you sure you want to cancel?") &&
                    window.location.reload()
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md"
                  disabled={isLoading}
                  aria-label="Cancel"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Submission History */}
          {submissionHistory.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Submission History
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={filterTaskId}
                      onChange={(e) => setFilterTaskId(e.target.value)}
                      className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                    >
                      <option value="" className="text-gray-500">
                        All Tasks
                      </option>
                      {mockTasks.map((task) => (
                        <option key={task.task_id} value={task.task_id}>
                          {task.description}
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
                  <button
                    onClick={handleExportHistory}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-200 shadow-md"
                    aria-label="Export History"
                  >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Task
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Phase
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Length (m)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissionHistory
                      .filter(
                        (submission) =>
                          !filterTaskId || submission.task_id === filterTaskId
                      )
                      .map((submission, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {mockTasks.find(
                              (t) => t.task_id === submission.task_id
                            )?.description || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.phase.charAt(0).toUpperCase() +
                              submission.phase.slice(1)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission[`${submission.phase}_location`].lat &&
                            submission[`${submission.phase}_location`].lng
                              ? `${
                                  submission[`${submission.phase}_location`].lat
                                }, ${
                                  submission[`${submission.phase}_location`].lng
                                }`
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission[`${submission.phase}_length`] || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.end_status || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.submittedAt}
                          </td>
                        </tr>
                      ))}
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

export default SupervisorWorkForm;
