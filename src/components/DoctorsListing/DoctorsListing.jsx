import React, { useEffect, useState } from "react";
import { doctors } from "../../assets/assets_frontend/assets";
import { specialityData } from "../../assets/assets_frontend/assets";
import DocsCard from "../docsCard/docsCard";
import { Link, Navigate, useParams } from "react-router-dom";
import fetchFromApi from "../../utility/fetchFromApi";
import { FaUserDoctor } from "react-icons/fa6";

const DoctorsListing = () => {
  // useEffect(() => {
  //   const checkLogin = () => {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     if (!user) {
  //       return <Navigate to="/login" />;
  //     }
  //   };
  //   checkLogin();
  // }, []);
  let { speciality } = useParams();
  const [specialists, setSpecialists] = useState([]); // Filtered specialists
  const [allSpecialists, setAllSpecialists] = useState([]);
  let [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    fetchFromApi("http://localhost:5000/api/doctor", "GET")
      .then((data) => {
        setAllSpecialists(data.data);
      })
      .catch((error) => console.error("Failed to fetch doctors:", err));
  }, []);

  // Filter locally whenever "speciality" changes
  useEffect(() => {
    if (speciality === "all") {
      setSpecialists(allSpecialists); // Reset to all specialists
    } else {
      setSpecialists(
        allSpecialists.filter((doc) => doc.specialization === speciality)
      );
    }
  }, [speciality, allSpecialists]);
  return (
    <>
      <button
        className={`w-1/2 rounded-md block md:hidden bg-[transparent] py-2 px-4 border  border-primary text-center text-md transition-all shadow-md hover:shadow-lg mt-4 ml-4 ${
          showFilter ? "bg-white text-primary" : " bg-primary text-white "
        } `}
        onClick={() => setShowFilter(!showFilter)}
      >
        Filters
      </button>
      {showFilter ? (
        ""
      ) : (
        <div className="  specialization p-4 flex justify-between flex-nowrap flex-col md:flex-row md:flex-wrap gap-4">
          <Link to="/doctors/all">
            <button
              className={` w-full rounded-md bg-[transparent] py-2 px-4 border  border-primary text-center text-md text-primary transition-all shadow-md hover:shadow-lg ${
                speciality == "all" ? " bg-primary text-white" : ""
              }`}
              type="button"
            >
              All
            </button>
          </Link>
          {specialityData.map((specs) => {
            return (
              <Link to={"/doctors/" + specs.speciality}>
                <button
                  className={` w-full rounded-md bg-[transparent] py-2 px-4 border  border-primary text-center text-md text-primary transition-all shadow-md hover:shadow-lg ${
                    speciality == specs.speciality
                      ? " bg-primary text-white"
                      : ""
                  }`}
                  type="button"
                >
                  <FaUserDoctor className="inline-block mr-2" />
                  {specs.speciality}
                </button>
              </Link>
            );
          })}
        </div>
      )}
      <div className="docsSection w-full flex flex-wrap gap-8 items-center  px-3 sm:px-0 my-10 text-center">
        {specialists.map((doc) => {
          return <DocsCard doc={doc} />;
        })}
      </div>
      <p className="text-center"> We don't have more {speciality}...🙏</p>
    </>
  );
};

export default DoctorsListing;
