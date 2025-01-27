import React, { useState } from "react";
import { toast } from "react-toastify";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null); // For storing the selected image
  const [previewImage, setPreviewImage] = useState(null); // For previewing the image
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      console.log(selectedImage);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Simulate database upload
  const handleUpload = async () => {
    if (!selectedImage) {
      toast.warn("Please select an image first!");
      return;
    }

    try {
      // Simulate image upload
      const formData = new FormData();
      formData.append("profileImage", selectedImage);
      const response = await fetch(
        "http://localhost:5000/api/doctor/image/6777c83cc131acc823b7c7c9",
        {
          method: "put",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      let responseData = await response.json();
      toast.success(responseData.message || "Image uploaded successfully!");

      // Clear input after successful upload
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload the image.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-1/2 bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          Image Upload
        </h2>

        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div className="mb-4">
            <img
              src={previewImage}
              alt="Selected Preview"
              className="w-full h-auto object-cover rounded-md border"
            />
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className={`w-full px-4 py-2 text-white font-bold rounded-md bg-primary`}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
