import { BrowserRouter,Routes,Route } from "react-router-dom"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import About from "./components/AboutUs/About"
import Footer from "./components/Footer/Footer"
import DoctorDetails from "./components/DoctorDetails/DoctorDetails"
import DoctorsListing from "./components/DoctorsListing/DoctorsListing"
import Contact from "./components/Contact/Contact"
import Invalid from "./components/InvalidURL/Invalid"
import Login from "./components/Signup/Login"
import MyProfile from "./components/MyProfile/MyProfile"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Myappoitment from "./components/MyAppointments/Myappoitment"
import DoctorForm from "./components/doctorOnboardingForm/DoctorForm"
import PatientForm from "./components/PatientForm/PatientForm"

function App() {

  return (
    <>
      <BrowserRouter>
      <ToastContainer />
        <Navbar/>
        <Routes>
        <Route path='/' element={<Home/>}/>
          <Route path='about' element={<About />} />
          <Route path='doctor/:docName' element={<DoctorDetails/>} />
          <Route path='contact' element={<Contact />} />
          <Route path='my-profile' element={<MyProfile />} />
          <Route path='my-appointments' element={<Myappoitment />} />
          <Route path='doctors/:speciality' element={<DoctorsListing />} />

          // creation of doctor and patient
          <Route path='doctor/register' element={<DoctorForm />} />
          <Route path='patient/register' element={<PatientForm />} />
        <Route path="login" element={<Login />} />
          <Route path='*' element={<Invalid/>} />
        </Routes> 
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
