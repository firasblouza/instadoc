import React from "react";

const Contact = () => {
  return (
    <section className="contactezNous w-full min-h-screen flex flex-col items-center pt-10">
      <div className="w-full h-auto flex flex-col justify-start items-center gap-5">
        <h1 className="text-2xl font-bold text-center md:text-left">
          Contactez Nous
        </h1>
        <div className="mainContainer border w-full md:w-1/2 flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden overflow-y-auto min-h-screen">
          <p className="font-medium text-xl text-center my-3">
            Vous avez des questions? N'hesitez pas de nous contactez !
          </p>
          <div className="flex flex-col md:flex-row w-full justify-center items-center gap-10 mb-5">
            <div className="flex flex-col w-full md:w-1/2 gap-5">
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="nom"
                  className="text-sm font-bold text-gray-600"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  placeholder="Nom"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full outline-none"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full outline-none"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="sujet"
                  className="text-sm font-bold text-gray-600"
                >
                  Sujet
                </label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  placeholder="Sujet"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full outline-none"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-bold text-gray-600"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  cols="30"
                  rows="10"
                  placeholder="Message"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full outline-none"
                ></textarea>
              </div>
              <div className="flex flex-col w-full gap-2">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
