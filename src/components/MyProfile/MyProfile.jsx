import React, { useEffect, useState } from "react";
import fetchFromApi from "../../utility/fetchFromApi";

// // User data from database
// fetchFromApi(
//   "http://localhost:5000/api/patient/6773ecdd87ef67ddf16b342f",
//   "GET"
// )
//   .then((data) => setData(data))
//   .catch((error) => console.error(error));
// const userData = {
//   name: "Babar Ajam",
//   age: 20,
//   role: "patient",
//   gender: "Male",
//   dateOfBirth: "2000-01-10T00:00:00.000+00:00",
//   contactNumber: "3829749823",
//   email: "babarajam123@gmail.com",
//   address: "Atari",
//   medicalHistory: "none",
//   profileImage: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//   emergencyContact: "1234567890",
// };

const Profile = () => {
  const [data, setData] = useState([]);
  const [editSection, setEditSection] = useState(null);
  const [formValues, setFormValues] = useState({});

  const handleEdit = (section) => {
    setEditSection(section);
    setFormValues(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setData(formValues);
    setEditSection(null);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // User data from database
  useEffect(() => {
    fetchFromApi(
      "http://localhost:5000/api/patient/6773ecdd87ef67ddf16b342f",
      "GET"
    )
      .then((data) => setData(data.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
          <img
            src={data.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-primary">{data.name}</h1>
            <p className="text-sm">{data.role}</p>
            <p className="text-sm">{data.address}</p>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary">
              Personal Information
            </h2>
            <button
              className="text-primary hover:bg-secondary transition-colors hover:text-white px-4 py-1 rounded"
              onClick={() => handleEdit("personalInfo")}
            >
              Edit
            </button>
          </div>
          {editSection === "personalInfo" ? (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                  // Exclude sensitive or non-editable fields
                  if (
                    [
                      "profileImage",
                      "password",
                      "_id",
                      "__v",
                      "createdAt",
                    ].includes(key)
                  )
                    return null;
                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={key === "dateOfBirth" ? "date" : "text"}
                        name={key}
                        value={formValues[key] || ""}
                        onChange={handleChange}
                        className="w-full p-2 rounded shadow-sm border-gray-300"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => setEditSection(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Object.entries(data).map(([key, value]) => {
                // Exclude sensitive or unnecessary fields
                if (["profileImage", "password", "_id", "__v"].includes(key))
                  return null;
                return (
                  <div key={key}>
                    <p className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="font-medium text-black">
                      {key === "dateOfBirth" ? formatDate(value) : value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
