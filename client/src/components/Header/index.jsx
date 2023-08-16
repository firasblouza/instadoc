import UpperHeader from "./UpperHeader";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className="Header w-full  flex flex-col md:px-2 lg:px-28 items-center justify-center">
      <UpperHeader />
      <div className="LowerHeader w-full flex flex-row">
        <Navbar />
      </div>
    </div>
  );
};

export default Header;
