import React, { useState } from "react";
import { assets } from "../../assets/assets_frontend/assets";
const Contact = () => {
  const inputClass =
    "w-full p-3 bg-white placeholder-gray-300 text-black rounded-md outline-primary";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="w-full my-8 ">
        <div className=" bg-gradient-to-b from-black via-gray-900 to-secondary flex items-center justify-center px-6 py-12 rounded-lg">
          <div className="flex flex-col md:flex-row bg-opacity-50 backdrop-blur-lg bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
            {/* Form Section */}
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-white mb-4">
                Let's connect
              </h2>
              <p className="text-white mb-6">
                Let's align our constellations! Reach out and let the magic of
                collaboration illuminate our skies.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className={inputClass}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={inputClass}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className={inputClass}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4">
                  <textarea
                    name="message"
                    placeholder="Message"
                    className={`${inputClass} h-28`}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 mt-6 rounded-md hover:bg-secondary/90 transition"
                >
                  Send it to MedList 🚀
                </button>
              </form>
            </div>

            {/* Image Section */}
            <div className="md:pl-8 py-4 md:w-1/2">
              <img
                src="https://images.pexels.com/photos/7584492/pexels-photo-7584492.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Astronaut"
                className="rounded-md "
              />
            </div>
          </div>
        </div>
        <h1 className="text-4xl text-[gray] text-center font-bold my-16">
          Location
        </h1>
        <div className="mapouter bg-[#e1e1e1] rounded-md">
          <div className="gmap_canvas">
            <iframe
              className="gmap_iframe rounded-md h-96 w-full"
              src="https://maps.google.com/maps?width=600&height=400&hl=en&q=ddugu&t=&z=14&ie=UTF8&iwloc=B&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
