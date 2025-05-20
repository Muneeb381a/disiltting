import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  TruckIcon,
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Mock data (unchanged)
const mockSupervisors = [
  { supervisor_id: "1", name: "Ahmed Khan" },
  { supervisor_id: "2", name: "Saima Riaz" },
  { supervisor_id: "3", name: "Bilal Ahmed" },
  { supervisor_id: "4", name: "Fatima Zafar" },
  { supervisor_id: "5", name: "Hassan Malik" },
];

const mockTeams = [
  { team_id: "1", team_name: "Pipeline Maintenance Crew" },
  { team_id: "2", team_name: "Sewerage Task Force" },
  { team_id: "3", team_name: "Water Supply Unit" },
  { team_id: "4", team_name: "Drainage Crew" },
  { team_id: "5", team_name: "Emergency Response Team" },
];

const mockMachinery = [
  { machinery_id: "1", name: "Jetting Machine JM-50" },
  { machinery_id: "2", name: "Suction Pump SP-200" },
  { machinery_id: "3", name: "Pipe Cutter PC-300" },
  { machinery_id: "4", name: "Water Tanker WT-100" },
  { machinery_id: "5", name: "Dredging Machine DM-400" },
];

const mockAreas = ["Residential", "Commercial", "Industrial", "Rural"];
const mockUnionCouncils = [
  "UC-1 Madina Town",
  "UC-2 Peoples Colony",
  "UC-3 Ghulam Muhammadabad",
  "UC-4 D-Type Colony",
  "UC-5 Batala Colony",
  "UC-6 Jinnah Colony",
];
const mockNAConstituencies = [
  "NA-101 Faisalabad-I",
  "NA-102 Faisalabad-II",
  "NA-103 Faisalabad-III",
  "NA-104 Faisalabad-IV",
  "NA-105 Faisalabad-V",
];
const mockTaskTypes = [
  "Pipeline Repair",
  "Sewer Cleaning",
  "Water Supply",
  "Drainage Maintenance",
  "Pump Installation",
  "Leak Detection",
];
const mockTaskStatuses = [
  "Pending",
  "In Progress",
  "Urgent",
  "On Hold",
  "Completed",
];
const mockTaskCategories = ["Water Supply", "Sewerage", "Drainage"];

// Reusable Input Component
const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  icon: Icon,
  ...props
}) => (
  <div className="relative">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-gray-50 p-3 ${
          Icon ? "pl-10" : "pl-3"
        } text-sm text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md`}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

// Reusable Select Component
const Select = ({
  id,
  label,
  value,
  onChange,
  error,
  options,
  required,
  placeholder,
  tooltip,
}) => (
  <div className="relative">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
    >
      {label} {required && <span className="text-red-500">*</span>}
      {tooltip && (
        <span className="ml-2 relative group">
          <InformationCircleIcon className="h-4 w-4 text-gray-400" />
          <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block text-xs text-white bg-gray-800 rounded p-2 w-40 shadow-lg z-10">
            {tooltip}
          </span>
        </span>
      )}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-gray-50 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 appearance-none transition-all duration-200 shadow-sm hover:shadow-md`}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" className="text-gray-500">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

// Reusable Textarea Component
const Textarea = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  rows = 4,
}) => (
  <div className="relative">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-lg border ${
        error ? "border-red-500" : "border-gray-300"
      } bg-gray-50 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md`}
      placeholder={placeholder}
      required={required}
      rows={rows}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

const TaskForm = () => {
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem("taskFormDraft");
    return savedDraft
      ? JSON.parse(savedDraft)
      : {
          description: "",
          priority: "Medium",
          supervisor_id: "",
          team_id: "",
          machinery_id: "",
          equipment_quantity: "",
          area: "",
          distilling_name: "",
          union_council: "",
          na_constituency: "",
          total_length: "",
          task_type: "",
          task_status: "Pending",
          due_date: "",
          estimated_duration: "",
          remarks: "",
          task_category: "",
          budget_estimate: "",
          crew_size: "",
          task_reference_id: "",
        };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

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
      localStorage.setItem("taskFormDraft", JSON.stringify(formData));
    }, 500);
    debouncedSave();
  }, [formData]);

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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.description || formData.description.length > 500)
      newErrors.description = formData.description
        ? "Description must be 500 characters or less"
        : "Task description is required";
    if (!formData.supervisor_id)
      newErrors.supervisor_id = "Supervisor is required";
    if (!formData.team_id) newErrors.team_id = "Team is required";
    if (!formData.area) newErrors.area = "Area of performance is required";
    if (!formData.union_council)
      newErrors.union_council = "Union council is required";
    if (
      formData.total_length &&
      (isNaN(formData.total_length) || formData.total_length < 0)
    )
      newErrors.total_length = "Total length must be a non-negative number";
    if (!formData.task_type) newErrors.task_type = "Task type is required";
    if (!formData.task_status)
      newErrors.task_status = "Task status is required";
    if (!formData.due_date) newErrors.due_date = "Due date is required";
    if (formData.due_date) {
      const today = new Date().toISOString().split("T")[0];
      if (formData.due_date < today)
        newErrors.due_date = "Due date cannot be in the past";
    }
    if (
      formData.estimated_duration &&
      (isNaN(formData.estimated_duration) || formData.estimated_duration < 0)
    )
      newErrors.estimated_duration =
        "Estimated duration must be a non-negative number";
    if (
      formData.budget_estimate &&
      (isNaN(formData.budget_estimate) || formData.budget_estimate < 0)
    )
      newErrors.budget_estimate =
        "Budget estimate must be a non-negative number";
    if (
      formData.crew_size &&
      (isNaN(formData.crew_size) || formData.crew_size < 1)
    )
      newErrors.crew_size = "Crew size must be a positive number";
    if (formData.machinery_id && !formData.equipment_quantity)
      newErrors.equipment_quantity =
        "Equipment quantity is required when machinery is selected";
    if (
      formData.equipment_quantity &&
      (isNaN(formData.equipment_quantity) || formData.equipment_quantity < 1)
    )
      newErrors.equipment_quantity =
        "Equipment quantity must be a positive number";
    if (!formData.task_category)
      newErrors.task_category = "Task category is required";
    if (formData.task_reference_id && formData.task_reference_id.length > 20)
      newErrors.task_reference_id =
        "Task reference ID must be 20 characters or less";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitMessage({
        type: "error",
        text: "Please fix the errors in the form",
      });
      return;
    }
    if (!window.confirm("Are you sure you want to assign this task?")) return;
    setIsLoading(true);
    setSubmitMessage(null);
    try {
      await mockApiPost("/tasks", formData);
      setSubmissionHistory([
        ...submissionHistory,
        {
          ...formData,
          submittedAt: new Date().toLocaleString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
        },
      ]);
      setSubmitMessage({
        type: "success",
        text: "Task assigned successfully!",
      });
      setFormData({
        description: "",
        priority: "Medium",
        supervisor_id: "",
        team_id: "",
        machinery_id: "",
        equipment_quantity: "",
        area: "",
        distilling_name: "",
        union_council: "",
        na_constituency: "",
        total_length: "",
        task_type: "",
        task_status: "Pending",
        due_date: "",
        estimated_duration: "",
        remarks: "",
        task_category: "",
        budget_estimate: "",
        crew_size: "",
        task_reference_id: "",
      });
      localStorage.removeItem("taskFormDraft");
      setErrors({});
      setShowPreview(false);
      document.getElementById("description")?.focus();
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: `Error assigning task: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the form? All unsaved data will be lost."
      )
    ) {
      setFormData({
        description: "",
        priority: "Medium",
        supervisor_id: "",
        team_id: "",
        machinery_id: "",
        equipment_quantity: "",
        area: "",
        distilling_name: "",
        union_council: "",
        na_constituency: "",
        total_length: "",
        task_type: "",
        task_status: "Pending",
        due_date: "",
        estimated_duration: "",
        remarks: "",
        task_category: "",
        budget_estimate: "",
        crew_size: "",
        task_reference_id: "",
      });
      setErrors({});
      setSubmitMessage(null);
      localStorage.removeItem("taskFormDraft");
      document.getElementById("description")?.focus();
    }
  };

  // Export history
  const handleExportHistory = () => {
    const dataStr = JSON.stringify(submissionHistory, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wasa-task-history-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Form progress
  const requiredFields = [
    "description",
    "supervisor_id",
    "team_id",
    "area",
    "union_council",
    "task_type",
    "task_status",
    "due_date",
    "task_category",
  ];
  const filledFields = requiredFields.filter((field) => formData[field]).length;
  const progress = Math.round((filledFields / requiredFields.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
            <DocumentTextIcon className="h-8 w-8 sm:h-10 sm:w-10 mr-3" />
            WASA Faisalabad Task Assignment
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Form Progress
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Completion: {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md text-sm"
                disabled={isLoading}
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                Preview Task
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md text-sm"
                disabled={isLoading}
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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md text-sm"
                disabled={isLoading}
              >
                <XCircleIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {submitMessage && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center shadow-md animate-slide-in ${
                  submitMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">{submitMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Task Details */}
              <div className="pb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 mr-2 text-emerald-600" />
                  Task Details
                </h3>
                <div className="space-y-6">
                  <Textarea
                    id="description"
                    label="Task Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    error={errors.description}
                    placeholder="Enter task details (e.g., Repair pipeline leak)"
                    required
                    rows={4}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                      id="task_category"
                      label="Task Category"
                      value={formData.task_category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          task_category: e.target.value,
                        })
                      }
                      error={errors.task_category}
                      options={mockTaskCategories}
                      placeholder="Select Task Category"
                      required
                      tooltip="Select the category of the task (e.g., Water Supply)."
                    />
                    <Select
                      id="task_type"
                      label="Task Type"
                      value={formData.task_type}
                      onChange={(e) =>
                        setFormData({ ...formData, task_type: e.target.value })
                      }
                      error={errors.task_type}
                      options={mockTaskTypes}
                      placeholder="Select Task Type"
                      required
                      tooltip="Specify the type of task (e.g., Pipeline Repair)."
                    />
                    <Select
                      id="priority"
                      label="Priority"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      options={["Low", "Medium", "High"]}
                      placeholder="Select Priority"
                      tooltip="Set the urgency of the task."
                    />
                  </div>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="pb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <TruckIcon className="h-6 w-6 mr-2 text-emerald-600" />
                  Assignment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Select
                    id="supervisor_id"
                    label="Supervisor"
                    value={formData.supervisor_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supervisor_id: e.target.value,
                      })
                    }
                    error={errors.supervisor_id}
                    options={mockSupervisors.map((s) => ({
                      value: s.supervisor_id,
                      label: s.name,
                    }))}
                    placeholder="Select Supervisor"
                    required
                    tooltip="Select the supervisor responsible for overseeing the task."
                  />
                  <Select
                    id="team_id"
                    label="Team"
                    value={formData.team_id}
                    onChange={(e) =>
                      setFormData({ ...formData, team_id: e.target.value })
                    }
                    error={errors.team_id}
                    options={mockTeams.map((t) => ({
                      value: t.team_id,
                      label: t.team_name,
                    }))}
                    placeholder="Select Team"
                    required
                    tooltip="Select the team assigned to the task."
                  />
                  <Select
                    id="machinery_id"
                    label="Machinery"
                    value={formData.machinery_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        machinery_id: e.target.value,
                        equipment_quantity: e.target.value
                          ? formData.equipment_quantity
                          : "",
                      })
                    }
                    options={mockMachinery.map((m) => ({
                      value: m.machinery_id,
                      label: m.name,
                    }))}
                    placeholder="Select Machinery (Optional)"
                    tooltip="Select machinery if required for the task."
                  />
                  {formData.machinery_id && (
                    <Input
                      id="equipment_quantity"
                      label="Equipment Quantity"
                      type="number"
                      value={formData.equipment_quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          equipment_quantity: e.target.value,
                        })
                      }
                      error={errors.equipment_quantity}
                      placeholder="e.g., 2"
                      required
                      min="1"
                      step="1"
                      tooltip="Specify the number of selected machinery units."
                    />
                  )}
                </div>
              </div>

              {/* Location Details */}
              <div className="pb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <TagIcon className="h-6 w-6 mr-2 text-emerald-600" />
                  Location Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Select
                    id="area"
                    label="Area of Performance"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    error={errors.area}
                    options={mockAreas}
                    placeholder="Select Area"
                    required
                    tooltip="Select the area type where the task will be performed."
                  />
                  <Input
                    id="distilling_name"
                    label="Distilling Name"
                    value={formData.distilling_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        distilling_name: e.target.value,
                      })
                    }
                    placeholder="e.g., Main Canal Pump Station"
                    tooltip="Enter the name of the facility or site (e.g., Main Canal Pump Station)."
                  />
                  <Select
                    id="union_council"
                    label="Union Council"
                    value={formData.union_council}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        union_council: e.target.value,
                      })
                    }
                    error={errors.union_council}
                    options={mockUnionCouncils}
                    placeholder="Select Union Council"
                    required
                    tooltip="Select the union council where the task is located."
                  />
                </div>
              </div>

              {/* Optional Details */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center focus:outline-none hover:text-emerald-600 transition-colors duration-200 w-full"
                  aria-expanded={showOptionalFields}
                  aria-controls="optional-details"
                >
                  <InformationCircleIcon className="h-6 w-6 mr-2 text-emerald-600" />
                  Optional Details
                  <ChevronDownIcon
                    className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${
                      showOptionalFields ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showOptionalFields && (
                  <div
                    id="optional-details"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <Select
                      id="na_constituency"
                      label="National Assembly Constituency"
                      value={formData.na_constituency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          na_constituency: e.target.value,
                        })
                      }
                      options={mockNAConstituencies}
                      placeholder="Select NA Constituency (Optional)"
                      tooltip="Select the NA constituency (optional)."
                    />
                    <Input
                      id="total_length"
                      label="Total Length (meters)"
                      type="number"
                      value={formData.total_length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_length: e.target.value,
                        })
                      }
                      error={errors.total_length}
                      placeholder="e.g., 500"
                      min="0"
                      step="0.1"
                      tooltip="Enter the pipeline or area length in meters (optional)."
                    />
                    <Input
                      id="budget_estimate"
                      label="Budget Estimate (PKR)"
                      type="number"
                      value={formData.budget_estimate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budget_estimate: e.target.value,
                        })
                      }
                      error={errors.budget_estimate}
                      placeholder="e.g., 50000"
                      min="0"
                      step="1000"
                      icon={CurrencyDollarIcon}
                      tooltip="Enter the estimated budget in Pakistani Rupees (optional)."
                    />
                    <Input
                      id="crew_size"
                      label="Crew Size"
                      type="number"
                      value={formData.crew_size}
                      onChange={(e) =>
                        setFormData({ ...formData, crew_size: e.target.value })
                      }
                      error={errors.crew_size}
                      placeholder="e.g., 5"
                      min="1"
                      step="1"
                      icon={UsersIcon}
                      tooltip="Enter the number of workers required (optional)."
                    />
                    <Input
                      id="task_reference_id"
                      label="Task Reference ID"
                      value={formData.task_reference_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          task_reference_id: e.target.value,
                        })
                      }
                      error={errors.task_reference_id}
                      placeholder="e.g., WASA-TSK-2025-001"
                      maxLength="20"
                      tooltip="Enter a unique identifier for the task (optional, max 20 characters)."
                    />
                  </div>
                )}
              </div>

              {/* Scheduling Details */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-emerald-600" />
                  Scheduling Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Select
                    id="task_status"
                    label="Task Status"
                    value={formData.task_status}
                    onChange={(e) =>
                      setFormData({ ...formData, task_status: e.target.value })
                    }
                    error={errors.task_status}
                    options={mockTaskStatuses}
                    placeholder="Select Task Status"
                    required
                    tooltip="Set the initial status of the task."
                  />
                  <Input
                    id="due_date"
                    label="Due Date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                    error={errors.due_date}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    icon={CalendarIcon}
                    tooltip="Select the deadline for the task."
                  />
                  <Input
                    id="estimated_duration"
                    label="Estimated Duration (hours)"
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimated_duration: e.target.value,
                      })
                    }
                    error={errors.estimated_duration}
                    placeholder="e.g., 4"
                    min="0"
                    step="0.5"
                    icon={ClockIcon}
                    tooltip="Enter the expected duration of the task in hours (optional)."
                  />
                </div>
                <div className="mt-4">
                  <Textarea
                    id="remarks"
                    label="Remarks"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    placeholder="Additional notes or special instructions"
                    tooltip="Add any additional notes or special instructions (optional)."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="sticky bottom-0 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 sm:p-6 -mx-6 sm:-mx-8 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="submit"
                  className={`w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md text-sm ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
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
                    <TruckIcon className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>

            {/* Preview Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <EyeIcon className="h-6 w-6 mr-2 text-emerald-600" />
                    Task Preview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <div className="space-y-2">
                      <p>
                        <strong>Description:</strong>{" "}
                        {formData.description || "N/A"}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {formData.task_category || "N/A"}
                      </p>
                      <p>
                        <strong>Type:</strong> {formData.task_type || "N/A"}
                      </p>
                      <p>
                        <strong>Priority:</strong> {formData.priority || "N/A"}
                      </p>
                      <p>
                        <strong>Status:</strong> {formData.task_status || "N/A"}
                      </p>
                      <p>
                        <strong>Due Date:</strong> {formData.due_date || "N/A"}
                      </p>
                      <p>
                        <strong>Estimated Duration:</strong>{" "}
                        {formData.estimated_duration || "N/A"} hours
                      </p>
                      <p>
                        <strong>Supervisor:</strong>{" "}
                        {mockSupervisors.find(
                          (s) => s.supervisor_id === formData.supervisor_id
                        )?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Team:</strong>{" "}
                        {mockTeams.find((t) => t.team_id === formData.team_id)
                          ?.team_name || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>Machinery:</strong>{" "}
                        {mockMachinery.find(
                          (m) => m.machinery_id === formData.machinery_id
                        )?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Equipment Quantity:</strong>{" "}
                        {formData.equipment_quantity || "N/A"}
                      </p>
                      <p>
                        <strong>Area:</strong> {formData.area || "N/A"}
                      </p>
                      <p>
                        <strong>Distilling Name:</strong>{" "}
                        {formData.distilling_name || "N/A"}
                      </p>
                      <p>
                        <strong>Union Council:</strong>{" "}
                        {formData.union_council || "N/A"}
                      </p>
                      <p>
                        <strong>NA Constituency:</strong>{" "}
                        {formData.na_constituency || "N/A"}
                      </p>
                      <p>
                        <strong>Total Length:</strong>{" "}
                        {formData.total_length || "N/A"} meters
                      </p>
                      <p>
                        <strong>Budget Estimate:</strong>{" "}
                        {formData.budget_estimate || "N/A"} PKR
                      </p>
                      <p>
                        <strong>Crew Size:</strong>{" "}
                        {formData.crew_size || "N/A"}
                      </p>
                      <p>
                        <strong>Task Reference ID:</strong>{" "}
                        {formData.task_reference_id || "N/A"}
                      </p>
                      <p>
                        <strong>Remarks:</strong> {formData.remarks || "N/A"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md text-sm"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}

            {/* Submission History */}
            {submissionHistory.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Recent Submissions
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <Select
                      id="filter_status"
                      label=""
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      options={mockTaskStatuses}
                      placeholder="All Statuses"
                      className="w-full sm:w-48"
                    />
                    <button
                      onClick={handleExportHistory}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md text-sm"
                    >
                      Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sm:whitespace-nowrap">
                          Task
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sm:whitespace-nowrap">
                          Reference ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sm:whitespace-nowrap">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sm:whitespace-nowrap">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sm:whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sm:whitespace-nowrap">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {submissionHistory
                        .filter(
                          (submission) =>
                            !filterStatus ||
                            submission.task_status === filterStatus
                        )
                        .map((submission, index) => (
                          <tr
                            key={index}
                            className={`transition-colors duration-200 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-emerald-50`}
                          >
                            <td className="px-4 py-3 text-xs text-gray-700 truncate max-w-[150px] sm:max-w-none">
                              {submission.description}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 sm:whitespace-nowrap">
                              {submission.task_reference_id || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 sm:whitespace-nowrap">
                              {submission.task_category}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 sm:whitespace-nowrap">
                              {submission.task_type}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 sm:whitespace-nowrap">
                              {submission.task_status}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 sm:whitespace-nowrap">
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TaskForm;
