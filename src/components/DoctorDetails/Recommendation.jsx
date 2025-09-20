import React, { useEffect, useState } from "react";
import DocsCard from "../docsCard/DocsCard";
import { useParams } from "react-router-dom";
import RecommendationLoading from "../LoadingSkeleton/RecommendationLoading";

const Recommendation = ({ speciality }) => {
  const [otherDocs, setOtherDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { docName } = useParams();

  const getRelatedDocs = async () => {
    try {
      let response = await fetch(
        "https://medlist-backend.onrender.com/api/doctor"
      );
      let apiResponse = await response.json();

      if (apiResponse.data && apiResponse.data.length > 0) {
        const recommendedDoctors = apiResponse.data.filter(
          (doc) => doc.specialization === speciality
        );
        setOtherDocs(recommendedDoctors.slice(1, 4));
      }
    } catch (err) {
      console.log("Error fetching doctors:", err);
    } finally {
      setIsLoading(false); // Ensure loading stops in all cases
    }
  };

  useEffect(() => {
    getRelatedDocs();
  }, [speciality]);

  return (
    <>
      <div className="text mx-auto mt-8">
        <h1 className="text-center text-3xl font-medium my-2">Other Experts</h1>
        <p className="text-[gray]">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>
      <div className="docsSection w-full flex flex-wrap gap-8 items-center  px-3 sm:px-0 my-10 text-center">
        {isLoading ? (
          <RecommendationLoading />
        ) : otherDocs.length > 0 ? (
          otherDocs.map((doc) => <DocsCard key={doc.id} doc={doc} />)
        ) : (
          <h1>No data Found</h1>
        )}
      </div>
    </>
  );
};

export default Recommendation;
