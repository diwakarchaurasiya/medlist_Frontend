const MyAppointmentsSkeleton = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 my-6 text-center">
        My Appointments
      </h1>
      {[1, 2, 3].map((_, idx) => (
        <div
          key={idx}
          className="w-full rounded-md border border-gray-200 shadow animate-pulse p-4 flex gap-4"
        >
          {/* Doctor Image */}
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] bg-gray-300 rounded-full"></div>

          {/* Appointment Info */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
            <div className="flex gap-4 pt-2">
              <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
              <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointmentsSkeleton;
