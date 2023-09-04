import { useEffect } from "react";

const Interface = () => {
  return (
    // Create an Interface that has a chatbox to receive and send message and below it an input field to send messages
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] gap-2 ">
      <div className="chatbox flex flex-col items-start justify-start w-full h-full gap-2 border border-black rounded-lg shadow-lg p-4 overflow-auto">
        {/* Left Side  */}
        <div className="message flex flex-col items-start justify-start w-full h-full gap-2">
          <p className="font-bold text-lg">Patient: </p>
          <p className="font-normal text-lg p-2 rounded-lg bg-emerald-500 text-white">
            Hello, I have a question about my appointment
          </p>
        </div>
        {/* Right Side */}
        <div className="message flex flex-col items-end justify-start w-full h-full gap-2">
          <p className="font-bold text-lg ">You: </p>
          <p className="font-normal text-lg  p-2 rounded-lg bg-sky-500 text-white">
            Hello, how can I help you?
          </p>
        </div>
      </div>
      <div className="input flex flex-col md:flex-row items-start justify-start w-full  gap-2">
        <input
          type="text"
          placeholder="Type your message here"
          className="w-full md:w-4/5 h-8 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white text-black list-none overflow-auto"
        />
        <button className="w-full md:w-1/5 px-2 py-1 rounded-md bg-gray-700 text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default Interface;
