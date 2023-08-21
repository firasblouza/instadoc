import { EnvelopeClosedIcon, MobileIcon } from "@radix-ui/react-icons";
import { logo } from "../../assets";
import { Link } from "react-router-dom";

const UpperHeader = () => {
  return (
    <div className="UpperHeader w-full items-center justify-center lg:justify-between flex flex-row border-b border-opacity-30 border-black">
      <div className="Logo w-[180px] h-full p-5 items-center flex justify-center">
        <Link to="/">
          <img src={logo} alt="InstaDoc" />
        </Link>
      </div>
      <div className="UpperHeader__Right hidden w-full h-full lg:flex flex-row items-center justify-end">
        <div className="UpperHeader__Right__Item border-r-2 border-black gap-1 px-2 flex flex-row items-center justify-center">
          <EnvelopeClosedIcon className="w-[30px] h-[30px] text-blue-400" />
          <p className="text-[#1E1E1E] font-medium text-[16px]">
            contact@instadoc.com
          </p>
        </div>
        <div className="UpperHeader__Right__Item gap-1 px-2 flex flex-row items-center justify-center">
          <MobileIcon className="w-[30px] h-[30px] text-blue-400" />
          <p className="text-[#1E1E1E] font-medium text-[16px]">
            +216 21 745 331
          </p>
        </div>
        <div className="UpperHeader__Right__Item  gap-1 px-2 flex flex-row items-center justify-center">
          <button className="bg-blue-400 text-white font-bold text-[16px] px-4 py-2 rounded-md hover:bg-blue-300 transition-all duration-500">
            Demande une consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpperHeader;
