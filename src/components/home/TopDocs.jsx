import React, { useEffect, useState } from 'react'
import { doctors } from '../../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'
import DocsCard from '../docsCard/docsCard'

const TopDocs = () => {
  const [topDoctors,setTopDoctors] = useState([])
  const getTopDocs = async () => {
        let apiResponse = await fetch("http://localhost:5000/api/doctor")
          .then((res) => res.json())
          .catch((err) => console.log(err))
        const recommendedDoctors = apiResponse.data;
        setTopDoctors(recommendedDoctors);
      }
      useEffect(() => {
            getTopDocs();
     },[])
  return (
    <div className='text-center mt-14'>
          <h1 className='text-3xl font-medium my-6'>Top Doctors to Book</h1>
          <p className=' text-sm'>Simply browse through our extensive list of trusted doctors.</p>
          <div className="docsSection w-full flex flex-wrap gap-8 items-center justify-center px-3 sm:px-0 my-10">
              {topDoctors.slice(0,10).map((doc) => {
                  return (
                     <DocsCard doc={doc}/>
              )})
              }
          </div>
          <Link to='/doctors/all'> 
          <button className="rounded-md bg-primary py-2 px-8  border-none text-center text-md text-white transition-all shadow-md hover:shadow-lg" type="button" onClick={()=>scrollTo(0,0)}>More
              </button>
          </Link>
    </div>
  )
}

export default TopDocs
