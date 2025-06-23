import React, { useEffect, useState } from "react";

// Helper to format camelCase or snake_case to Normal Text
const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase());

const Profile = () => {
  const [data, setData] = useState({});
  const [editSection, setEditSection] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    // const patientToken = localStorage.getItem("patient_token");
    // console.log("Stored user data:", stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed.user || {});
      } catch (err) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleEdit = () => {
    setFormValues(data);
    setEditSection(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setData(formValues);
    setEditSection(false);
    // Optional: Add API call to save updates to the backend
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const editableFields = [
    "name",
    "age",
    "gender",
    "dateOfBirth",
    "contactNumber",
    "email",
    "address",
    "emergencyContact",
    "medicalHistory",
  ];

  return (
    <div className="min-h-screen text-black ">
      <div className="max-w-screen-md mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <img
            src={
              data.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/7162/7162728.png"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-primary capitalize ">
              {data.name || "Not Found"}
            </h1>
            <p className="text-sm capitalize">{data.role}</p>
            <p className="text-sm">{data.address}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Personal Information
            </h2>
            {!editSection && (
              <button
                className="text-primary hover:bg-secondary transition-colors hover:text-white px-4 py-1 rounded"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>

          {editSection ? (
            <div className="grid grid-cols-2 gap-4">
              {editableFields.map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-600">
                    {formatKey(key)}
                  </label>
                  <input
                    type={key === "dateOfBirth" ? "date" : "text"}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded shadow-sm border-gray-300"
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditSection(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {editableFields.map((key) => (
                <div key={key}>
                  <p className="text-sm font-semibold text-gray-600">
                    {formatKey(key)}
                  </p>
                  <p className="font-medium text-black">
                    {key === "dateOfBirth" && data[key]
                      ? formatDate(data[key])
                      : data[key] || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
