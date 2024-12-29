import React from 'react'
import { Link } from 'react-router-dom'

const DocsCard = ({doc}) => {
  return (
    <div className="doc-card border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 md:w-1/6  " key={doc._id} onClick={()=>scrollTo(0,0)}>
    <Link to={"/doctor/" + doc._id}>
    <img  className="bg-primary hover:bg-[#045f04]" src={doc.profileImage} alt="" />
    <span className='pl-2 text-center'>
          <h2 className='text-[#262626] text-md font-bold '>{doc.name}</h2>
    <p className='text-[#5C5C5C] text-sm'>{doc.specialization}</p>
        </span>
        <p className='py-2'><span className='text-sm text-[gray]'>Fees-</span>₹{doc.appointmentFees}</p>
        <div className="button m-2">
        <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-green-600 transition duration-300">Book Me</button>
        </div>
    </Link>
    </div>
  )
}

export default DocsCard
