import React, { useEffect, useState } from 'react'
import { doctors } from '../../assets/assets_frontend/assets'
import DocsCard from '../docsCard/docsCard';
import { useParams } from 'react-router-dom';

const Recommendation = ({ speciality }) => {
  const [otherDocs, setOtherDocs] = useState([]);
  const { docName } = useParams();
   const getRelatedDocs = async () => {
      let apiResponse = await fetch("http://localhost:5000/api/doctor")
        .then((res) => res.json())
        .catch((err) => console.log(err))
     if (speciality) {
       const recommendedDoctors = apiResponse.data.filter(doc => doc.specialization === speciality);
       setOtherDocs(recommendedDoctors.slice(0, 4));
        }
    }
    useEffect(() => {
          getRelatedDocs();
   },[speciality,docName])
    // useEffect(() => {
    //   setOtherDocs(doctors.filter((doc) => doc.speciality == speciality))
    // },[speciality,doctors,docName])
  return (
      <>
          <div className="text mx-auto mt-8"><h1 className='text-center text-3xl font-medium my-2'>Other Experts</h1>
          <p className='text-[gray]'>Simply browse through our extensive list of trusted doctors.</p></div>
      <div className="docsSection w-full flex flex-wrap gap-8 items-center  px-3 sm:px-0 my-10 text-center">
    {otherDocs.map((doc) => {
          return (
             <DocsCard doc={doc}/>
      )})
      }
</div></>
  )
}

export default Recommendation
