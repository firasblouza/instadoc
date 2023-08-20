import { useState, useEffect, useRef } from "react";

const Profile = () => {
  const effectRan = useRef(null);

  const [statistics, setStatistics] = useState({
    consultations: 0
  });

  return (
    <section className="profile w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      {/* Create a page to view the user data and the ability to modify them */}
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
          Profile
        </h1>
      </div>
    </section>
  );
};

export default Profile;
