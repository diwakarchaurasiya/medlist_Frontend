import React, { useEffect, useState } from "react";

// Helper to format camelCase or snake_case to Normal Text
const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase());

// Accepts 'user' prop directly (which is the complete user object from App.jsx state)
const MyProfile = ({ user }) => {
  // We'll use 'profileData' to hold the actual user details (e.g., name, age, email)
  // and 'currentRole' for the user's role.
  const [profileData, setProfileData] = useState({});
  const [currentRole, setCurrentRole] = useState("");
  const [editSection, setEditSection] = useState(false);
  const [formValues, setFormValues] = useState({});
  console.log("MyProfile - Initial user prop:", user);

  useEffect(() => {
    // When the 'user' prop changes (e.g., after login), update our state
    if (user && user.user) {
      // Ensure user and nested user details exist
      setProfileData(user.user); // Set the actual user details
      setCurrentRole(user.userType); // Set the user's role
      setFormValues(user.user); // Initialize form values for editing
    } else {
      // Clear data if user is not available (e.g., after logout)
      setProfileData({});
      setCurrentRole("");
      setFormValues({});
    }
    console.log("MyProfile - User prop received:", user);
  }, [user]); // Re-run when the 'user' prop changes

  const handleEdit = () => {
    setFormValues(profileData); // Populate form with current displayed data
    setEditSection(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfileData(formValues); // Update displayed data
    setEditSection(false);
    // TODO: Add API call to save updates to the backend
    // You'll likely need the user's ID and token for this API call.
    // Example:
    // const token = user.token;
    // const userId = user.user.id;
    // fetch(`/api/${user.userType}/${userId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(formValues)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Profile updated successfully:', data);
    //   // Optionally, update the 'user' state in App.jsx and localStorage if backend returns new data
    //   // e.g., if you have a `updateUser` function passed as a prop from App.jsx
    //   // If you want App.jsx's state to reflect the changes, you would need to lift this state up
    //   // or pass a callback to update it. For now, it just updates locally.
    // })
    // .catch(error => {
    //   console.error('Failed to update profile:', error);
    // });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString; // Return original if invalid date
    }
  };

  // Define editable fields based on what you expect for Patient, Doctor, Admin.
  // This example uses fields common to a patient profile.
  // You might need separate components or conditional rendering for different roles.
  const commonEditableFields = [
    { key: "name", type: "text" },
    { key: "email", type: "email" }, // Email might not be editable by user
    { key: "contactNumber", type: "text" },
    { key: "address", type: "text" },
    { key: "gender", type: "text" },
    { key: "dateOfBirth", type: "date" },
    // Add other fields specific to your user types (e.g., speciality for doctor, etc.)
  ];

  // Example of role-specific fields (you can expand this logic)
  let specificFields = [];
  if (currentRole === "patient") {
    specificFields = [
      { key: "emergencyContact", type: "text" },
      { key: "medicalHistory", type: "text" },
    ];
  } else if (currentRole === "doctor") {
    specificFields = [
      { key: "speciality", type: "text" },
      { key: "qualifications", type: "text" },
      { key: "experience", type: "number" },
    ];
  } else if (currentRole === "admin") {
    specificFields = [
      // Admin might not have many "profile" fields editable by themselves
    ];
  }

  const fieldsToDisplay = [...commonEditableFields, ...specificFields];

  return (
    <div className="min-h-screen text-black bg-gray-100">
      <div className="max-w-screen-md mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <img
            src={profileData.profileImage || "https://via.placeholder.com/80"} // Fallback image
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-primary capitalize">
              {profileData.name || "N/A"}
            </h1>
            <p className="text-sm capitalize">{currentRole || "User"}</p>
            <p className="text-sm">{profileData.address || "N/A"}</p>
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
              {fieldsToDisplay.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-600">
                    {formatKey(field.key)}
                  </label>
                  <input
                    type={field.type}
                    name={field.key}
                    value={formValues[field.key] || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded shadow-sm border border-gray-300 focus:outline-none focus:border-primary"
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
              {fieldsToDisplay.map((field) => (
                <div key={field.key}>
                  <p className="text-sm font-semibold text-gray-600">
                    {formatKey(field.key)}
                  </p>
                  <p className="font-medium text-black">
                    {field.key === "dateOfBirth"
                      ? formatDate(profileData[field.key])
                      : profileData[field.key] || "—"}
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

export default MyProfile;
