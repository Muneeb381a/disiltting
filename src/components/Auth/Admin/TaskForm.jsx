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
} from "@heroicons/react/24/outline";

// Mock data tailored for WASA Faisalabad
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

  // Mock API function with error simulation
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
      document.getElementById("description").focus();
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: `Error assigning task: ${err.message}`,
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
      document.getElementById("description").focus();
    }
  };

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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <DocumentTextIcon className="h-10 w-10 mr-4" />
            WASA Faisalabad Task Assignment
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

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Form Completion: {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Task Details */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
                Task Details
              </h3>
              <div className="space-y-6">
                <div className="relative">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Task Description
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Describe the task in detail (e.g., repair pipeline leak near main road)."
                    >
                      ?
                    </span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    required
                    placeholder="Enter task details (e.g., Repair pipeline leak)"
                    rows="5"
                    aria-describedby={
                      errors.description ? "description-error" : undefined
                    }
                  />
                  {errors.description && (
                    <p
                      id="description-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <label
                      htmlFor="task_category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Task Category
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Select the category of the task (e.g., Water Supply)."
                      >
                        ?
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        id="task_category"
                        value={formData.task_category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            task_category: e.target.value,
                          })
                        }
                        className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                          errors.task_category ? "border-red-500" : ""
                        }`}
                        required
                        aria-describedby={
                          errors.task_category
                            ? "task-category-error"
                            : undefined
                        }
                      >
                        <option value="" className="text-gray-500">
                          Select Task Category
                        </option>
                        {mockTaskCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
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
                    {errors.task_category && (
                      <p
                        id="task-category-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.task_category}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="task_type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Task Type
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Specify the type of task (e.g., Pipeline Repair)."
                      >
                        ?
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        id="task_type"
                        value={formData.task_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            task_type: e.target.value,
                          })
                        }
                        className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                          errors.task_type ? "border-red-500" : ""
                        }`}
                        required
                        aria-describedby={
                          errors.task_type ? "task-type-error" : undefined
                        }
                      >
                        <option value="" className="text-gray-500">
                          Select Task Type
                        </option>
                        {mockTaskTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
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
                    {errors.task_type && (
                      <p
                        id="task-type-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.task_type}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Priority
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Set the urgency of the task."
                      >
                        ?
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 mr-3 text-blue-600" />
                Assignment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label
                    htmlFor="supervisor_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Supervisor
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Select the supervisor responsible for overseeing the task."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="supervisor_id"
                      value={formData.supervisor_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supervisor_id: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                        errors.supervisor_id ? "border-red-500" : ""
                      }`}
                      required
                      aria-describedby={
                        errors.supervisor_id ? "supervisor-error" : undefined
                      }
                    >
                      <option value="" className="text-gray-500">
                        Select Supervisor
                      </option>
                      {mockSupervisors.map((s) => (
                        <option key={s.supervisor_id} value={s.supervisor_id}>
                          {s.name}
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
                  {errors.supervisor_id && (
                    <p
                      id="supervisor-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.supervisor_id}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="team_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Team
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Select the team assigned to the task."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="team_id"
                      value={formData.team_id}
                      onChange={(e) =>
                        setFormData({ ...formData, team_id: e.target.value })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                        errors.team_id ? "border-red-500" : ""
                      }`}
                      required
                      aria-describedby={
                        errors.team_id ? "team-error" : undefined
                      }
                    >
                      <option value="" className="text-gray-500">
                        Select Team
                      </option>
                      {mockTeams.map((t) => (
                        <option key={t.team_id} value={t.team_id}>
                          {t.team_name}
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
                  {errors.team_id && (
                    <p id="team-error" className="mt-2 text-sm text-red-500">
                      {errors.team_id}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="machinery_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Machinery
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Select machinery if required for the task."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="machinery_id"
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
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                    >
                      <option value="" className="text-gray-500">
                        Select Machinery (Optional)
                      </option>
                      {mockMachinery.map((m) => (
                        <option key={m.machinery_id} value={m.machinery_id}>
                          {m.name}
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
                </div>

                {formData.machinery_id && (
                  <div className="relative">
                    <label
                      htmlFor="equipment_quantity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Equipment Quantity
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Specify the number of selected machinery units."
                      >
                        ?
                      </span>
                    </label>
                    <input
                      id="equipment_quantity"
                      type="number"
                      value={formData.equipment_quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          equipment_quantity: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                        errors.equipment_quantity ? "border-red-500" : ""
                      }`}
                      required
                      placeholder="e.g., 2"
                      min="1"
                      step="1"
                      aria-describedby={
                        errors.equipment_quantity
                          ? "equipment-quantity-error"
                          : undefined
                      }
                    />
                    {errors.equipment_quantity && (
                      <p
                        id="equipment-quantity-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.equipment_quantity}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <TagIcon className="h-6 w-6 mr-3 text-blue-600" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Area of Performance
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Select the area type where the task will be performed."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="area"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                        errors.area ? "border-red-500" : ""
                      }`}
                      required
                      aria-describedby={errors.area ? "area-error" : undefined}
                    >
                      <option value="" className="text-gray-500">
                        Select Area
                      </option>
                      {mockAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
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
                  {errors.area && (
                    <p id="area-error" className="mt-2 text-sm text-red-500">
                      {errors.area}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="distilling_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Distilling Name
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Enter the name of the facility or site (e.g., Main Canal Pump Station)."
                    >
                      ?
                    </span>
                  </label>
                  <input
                    id="distilling_name"
                    type="text"
                    value={formData.distilling_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        distilling_name: e.target.value,
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="e.g., Main Canal Pump Station"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="union_council"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Union Council
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Select the union council where the task is located."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="union_council"
                      value={formData.union_council}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          union_council: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                        errors.union_council ? "border-red-500" : ""
                      }`}
                      required
                      aria-describedby={
                        errors.union_council ? "union-council-error" : undefined
                      }
                    >
                      <option value="" className="text-gray-500">
                        Select Union Council
                      </option>
                      {mockUnionCouncils.map((uc) => (
                        <option key={uc} value={uc}>
                          {uc}
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
                  {errors.union_council && (
                    <p
                      id="union-council-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.union_council}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Details */}
            <div>
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="text-xl font-semibold text-gray-800 mb-6 flex items-center focus:outline-none hover:text-blue-600 transition-colors duration-200"
                aria-expanded={showOptionalFields}
                aria-controls="optional-details"
              >
                <InformationCircleIcon className="h-6 w-6 mr-3 text-blue-600" />
                Optional Details
                <svg
                  className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
                    showOptionalFields ? "rotate-180" : ""
                  }`}
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
              </button>
              {showOptionalFields && (
                <div
                  id="optional-details"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="relative">
                    <label
                      htmlFor="na_constituency"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      National Assembly Constituency
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Select the NA constituency (optional)."
                      >
                        ?
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        id="na_constituency"
                        value={formData.na_constituency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            na_constituency: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                      >
                        <option value="" className="text-gray-500">
                          Select NA Constituency (Optional)
                        </option>
                        {mockNAConstituencies.map((na) => (
                          <option key={na} value={na}>
                            {na}
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
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="total_length"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Total Length (meters)
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Enter the pipeline or area length in meters (optional)."
                      >
                        ?
                      </span>
                    </label>
                    <input
                      id="total_length"
                      type="number"
                      value={formData.total_length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_length: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                        errors.total_length ? "border-red-500" : ""
                      }`}
                      placeholder="e.g., 500"
                      min="0"
                      step="0.1"
                      aria-describedby={
                        errors.total_length ? "total-length-error" : undefined
                      }
                    />
                    {errors.total_length && (
                      <p
                        id="total-length-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.total_length}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="budget_estimate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Budget Estimate (PKR)
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Enter the estimated budget in Pakistani Rupees (optional)."
                      >
                        ?
                      </span>
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="budget_estimate"
                        type="number"
                        value={formData.budget_estimate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budget_estimate: e.target.value,
                          })
                        }
                        className={`pl-12 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                          errors.budget_estimate ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., 50000"
                        min="0"
                        step="1000"
                        aria-describedby={
                          errors.budget_estimate
                            ? "budget-estimate-error"
                            : undefined
                        }
                      />
                    </div>
                    {errors.budget_estimate && (
                      <p
                        id="budget-estimate-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.budget_estimate}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="crew_size"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Crew Size
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Enter the number of workers required (optional)."
                      >
                        ?
                      </span>
                    </label>
                    <div className="relative">
                      <UsersIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="crew_size"
                        type="number"
                        value={formData.crew_size}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            crew_size: e.target.value,
                          })
                        }
                        className={`pl-12 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                          errors.crew_size ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., 5"
                        min="1"
                        step="1"
                        aria-describedby={
                          errors.crew_size ? "crew-size-error" : undefined
                        }
                      />
                    </div>
                    {errors.crew_size && (
                      <p
                        id="crew-size-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.crew_size}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="task_reference_id"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Task Reference ID
                      <span
                        className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                        title="Enter a unique identifier for the task (optional, max 20 characters)."
                      >
                        ?
                      </span>
                    </label>
                    <input
                      id="task_reference_id"
                      type="text"
                      value={formData.task_reference_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          task_reference_id: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                        errors.task_reference_id ? "border-red-500" : ""
                      }`}
                      placeholder="e.g., WASA-TSK-2025-001"
                      maxLength="20"
                      aria-describedby={
                        errors.task_reference_id
                          ? "task-reference-id-error"
                          : undefined
                      }
                    />
                    {errors.task_reference_id && (
                      <p
                        id="task-reference-id-error"
                        className="mt-2 text-sm text-red-500"
                      >
                        {errors.task_reference_id}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Scheduling Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <CalendarIcon className="h-6 w-6 mr-3 text-blue-600" />
                Scheduling Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label
                    htmlFor="task_status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Task Status
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Set the initial status of the task."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="task_status"
                      value={formData.task_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          task_status: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200 ${
                        errors.task_status ? "border-red-500" : ""
                      }`}
                      required
                      aria-describedby={
                        errors.task_status ? "task-status-error" : undefined
                      }
                    >
                      <option value="" className="text-gray-500">
                        Select Task Status
                      </option>
                      {mockTaskStatuses.map((status) => (
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
                  {errors.task_status && (
                    <p
                      id="task-status-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.task_status}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="due_date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Due Date
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Select the deadline for the task."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                      className={`pl-12 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                        errors.due_date ? "border-red-500" : ""
                      }`}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      aria-describedby={
                        errors.due_date ? "due-date-error" : undefined
                      }
                    />
                  </div>
                  {errors.due_date && (
                    <p
                      id="due-date-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.due_date}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="estimated_duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Estimated Duration (hours)
                    <span
                      className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                      title="Enter the expected duration of the task in hours (optional)."
                    >
                      ?
                    </span>
                  </label>
                  <div className="relative">
                    <ClockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="estimated_duration"
                      type="number"
                      value={formData.estimated_duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimated_duration: e.target.value,
                        })
                      }
                      className={`pl-12 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                        errors.estimated_duration ? "border-red-500" : ""
                      }`}
                      placeholder="e.g., 4"
                      min="0"
                      step="0.5"
                      aria-describedby={
                        errors.estimated_duration
                          ? "estimated-duration-error"
                          : undefined
                      }
                    />
                  </div>
                  {errors.estimated_duration && (
                    <p
                      id="estimated-duration-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.estimated_duration}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 relative">
                <label
                  htmlFor="remarks"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Remarks
                  <span
                    className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full cursor-help"
                    title="Add any additional notes or special instructions (optional)."
                  >
                    ?
                  </span>
                </label>
                <textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Additional notes or special instructions"
                  rows="4"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-gradient-to-r from-blue-50 to-green-50 p-6 -mx-10 border-t border-gray-200 flex space-x-4">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md"
                disabled={isLoading}
                aria-label="Preview Task"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                Preview Task
              </button>
              <button
                type="submit"
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label="Assign Task"
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

          {/* Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-auto shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Task Preview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
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
                  <div>
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
                      <strong>Crew Size:</strong> {formData.crew_size || "N/A"}
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
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md"
                  aria-label="Close Preview"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}

          {/* Submission History */}
          {submissionHistory.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Recent Submissions
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                    >
                      <option value="" className="text-gray-500">
                        All Statuses
                      </option>
                      {mockTaskStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
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
                    {/* <DownloadIcon className="h-5 w-5 mr-2" /> */}
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
                        Reference ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Type
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
                          !filterStatus ||
                          submission.task_status === filterStatus
                      )
                      .map((submission, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.task_reference_id || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.task_category}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.task_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {submission.task_status}
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

export default TaskForm;
