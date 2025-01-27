import React from "react";
import { assets } from "../../assets/assets_frontend/assets";
import {
  FaStethoscope,
  FaHeartbeat,
  FaSyringe,
  FaBrain,
  FaChild,
  FaWeight,
} from "react-icons/fa";

const About = () => {
  const servicesData = [
    {
      id: 1,
      title: "Free Checkup",
      description:
        "We provide free checkups to ensure that everyone has access to essential healthcare services, regardless of their financial situation.",
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920626.png",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "Emergency Service",
      description:
        "Our 24/7 emergency services ensure that you receive timely care when you need it the most, because your health is our priority.",
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920626.png",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title: "Health Consultation",
      description:
        "Our expert health consultations are designed to guide you towards better health and wellness with personalized care.",
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920626.png",
      image: "https://via.placeholder.com/300x200",
    },
  ];

  const featuresData = [
    {
      id: 1,
      title: "Primary Care",
      description:
        "Our certified doctors provide best medical care to help keep you healthy",
      icon: <FaStethoscope className="text-primary text-4xl" />,
    },
    {
      id: 2,
      title: "Heart Care",
      description:
        "The most advanced doctor and facility heart care in the region happens at lifecare",
      icon: <FaHeartbeat className="text-primary text-4xl" />,
    },
    {
      id: 3,
      title: "Surgery",
      description:
        "Surgeons at Lifecare in mobile, have expertise in colorectal and general surgeries",
      icon: <FaSyringe className="text-primary text-4xl" />,
    },
    {
      id: 4,
      title: "Mental Health",
      description:
        "Helping you feel better as you did while undergoing treatment for mental healthcare",
      icon: <FaBrain className="text-primary text-4xl" />,
    },
    {
      id: 5,
      title: "Fertility",
      description:
        "Guiding you through fertility hormones, you have a choice whether you want children",
      icon: <FaChild className="text-primary text-4xl" />,
    },
    {
      id: 6,
      title: "Weight Loss",
      description:
        "We help you lose weight by preparing prescription drugs according to your needs",
      icon: <FaWeight className="text-primary text-4xl" />,
    },
  ];

  return (
    <div>
      <h1 className="text-4xl text-center font-bold my-8">About Us</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start ">
        {/* Profile Picture */}
        <div className="md:w-1/3 flex justify-center">
          <img
            className="rounded-lg w-48 h-48 md:w-60 md:h-80 object-cover bg-primary"
            src={assets.about_image}
            alt={assets.about_image}
          />
        </div>

        {/* Doctor Information */}
        <div className="md:w-2/3 md:ml-8 text-center md:text-left mt-4 md:mt-0">
          <h1 className="font-bold flex items-center justify-center md:justify-start my-2 ">
            What We Believe
          </h1>
          <span className="text-lg text-blue-600 mt-2">
            <p className="text-sm  text-[gray]">
              Welcome to Prescripto, your trusted partner in managing your
              healthcare needs conveniently and efficiently. At Prescripto, we
              are committed to providing exceptional healthcare services, as
              highlighted in our core offerings:
              <br />
              <strong>Free Checkups</strong>,{" "}
              <strong>Emergency Services</strong>, and
              <strong> Health Consultations</strong>. These services embody our
              mission to make quality healthcare accessible to everyone.
              <br />
              Prescripto continuously strives to enhance our platform with the
              latest advancements, ensuring you receive the best care possible.
            </p>
            <h1 className="font-bold flex items-center justify-center md:justify-start my-2 ">
              Our Vision
            </h1>
            <p className="text-sm  text-[gray]">
              Our vision at Prescripto is to create a seamless healthcare
              experience for every user. By offering services like Free
              Checkups, Emergency Services, and Health Consultations, we aim to
              bridge the gap between patients and healthcare providers, ensuring
              timely and efficient care for all.
            </p>
          </span>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Why We Are Better Than Others
          </h2>
          <p className="text-gray-600 mb-12">
            Feed everything for a sure guarantee and you will be happy and safe
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                className="bg-white shadow-none rounded-md p-6 text-center  border border-primary  transition duration-300 flex flex-col justify-center items-center "
              >
                <div className="mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                <span
                  href="#"
                  className="text-primary font-semibold mt-4 inline-block"
                >
                  Learn more →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
