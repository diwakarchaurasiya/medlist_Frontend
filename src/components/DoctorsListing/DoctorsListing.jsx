import React, { useEffect, useState } from "react";
import { doctors } from "../../assets/assets_frontend/assets";
import { specialityData } from "../../assets/assets_frontend/assets";
import DocsCard from "../docsCard/DocsCard";
import { Link, Navigate, useParams } from "react-router-dom";
import fetchFromApi from "../../utility/fetchFromApi";
import { FaUserDoctor } from "react-icons/fa6";

const DoctorsListing = () => {
  let { speciality } = useParams();
  const [specialists, setSpecialists] = useState([]); // Filtered specialists
  const [allSpecialists, setAllSpecialists] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState(""); // State to manage sorting criteria

  useEffect(() => {
    fetchFromApi("http://localhost:5000/api/doctor", "GET")
      .then((data) => {
        setAllSpecialists(data.data);
      })
      .catch((error) => console.error("Failed to fetch doctors:", error));
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

  // Function to sort specialists by fees or experience
  const sortSpecialists = (criteria) => {
    let sortedSpecialists = [...specialists];

    switch (criteria) {
      case "fees-asc":
        sortedSpecialists.sort((a, b) => a.appointmentFees - b.appointmentFees);
        break;
      case "fees-desc":
        sortedSpecialists.sort((a, b) => b.appointmentFees - a.appointmentFees);
        break;
      case "experience-asc":
        sortedSpecialists.sort((a, b) => a.experience - b.experience);
        break;
      case "experience-desc":
        sortedSpecialists.sort((a, b) => b.experience - a.experience);
        break;
      default:
        break;
    }

    setSpecialists(sortedSpecialists);
    setSortBy(criteria);
  };

  // CSS classes for form elements
  const labelClass = "text-primary text-sm md:w-1/4 p-4";
  const inputClass =
    "border border-primary rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-xs";

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
        <div className="specialization p-4 flex justify-between flex-nowrap flex-col md:flex-row md:flex-wrap gap-4">
          <Link to="/doctors/all">
            <button
              className={`w-full rounded-md bg-[transparent] py-2 px-4 border  border-primary text-center text-md text-primary transition-all shadow-md hover:shadow-lg ${
                speciality == "all" ? " bg-primary text-white" : ""
              }`}
              type="button"
            >
              All
            </button>
          </Link>
          {specialityData.map((specs) => {
            return (
              <Link to={"/doctors/" + specs.speciality} key={specs.speciality}>
                <button
                  className={`w-full rounded-md bg-[transparent] py-2 px-4 border  border-primary text-center text-md text-primary transition-all shadow-md hover:shadow-lg ${
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

      <div className=" my-2">
        <label htmlFor="Sortby" className={labelClass}>
          Sort by:
        </label>
        <select
          className={`${inputClass}`}
          onChange={(e) => sortSpecialists(e.target.value)}
        >
          <option value="fees-asc">Fees:Low to High</option>
          <option value="fees-desc">Fees:High to Low</option>
          <option value="experience-asc">Experience:Low to High</option>
          <option value="experience-desc">Experience:High to Low</option>
        </select>
      </div>
      <div className="docsSection w-full flex flex-wrap gap-8 items-center px-3 sm:px-0 my-10 text-center md:justify-start justify-center">
        {specialists.map((doc) => (
          <DocsCard doc={doc} key={doc._id} />
        ))}
      </div>
      <p className="text-center"> We don't have more {speciality}...🙏</p>
    </>
  );
};

export default DoctorsListing;
