import {
  service_appt,
  service_consult,
  service_secure,
  service_support,
} from "../assets";

const Services = () => {
  return (
    <section
      id="services"
      className="w-full h-auto flex flex-col mt-10 gap-5 lg:flex-row justify-evenly md:gap-3 lg:-mt-[130px] bg-transparent"
    >
      <div className="service__card rounded-lg min-w-[260px] w-full flex flex-col items-center gap-1 lg:gap-3 justify-start lg:justify-evenly lg:max-w-[300px] h-auto p-5 bg-white shadow-lg z-10">
        <div className="service__card__img flex items-center justify-center w-1/2 lg:w-2/3">
          <img src={service_consult} alt="Expert Medical Consultations" />
        </div>

        <h1 className="text-[18px] whitespace-nowrap text-center font-bold text-[#1E1E1E]">
          Expert Medical Consultation
        </h1>

        <p className="text-[16px] text-center text-[#1E1E1E]">
          Access virtual consultations with highly qualified and experienced
          doctors. Receive personalized medical advice and treatement plans
          tailored to your needs.
        </p>
      </div>

      <div className="service__card rounded-lg min-w-[260px] w-full flex flex-col items-center gap-1 lg:gap-3 justify-evenly lg:max-w-[300px] h-auto p-5 bg-white shadow-lg z-10">
        <div className="service__card__img flex items-center justify-center w-1/2 lg:w-2/3">
          <img src={service_appt} alt="Instant Appointments" />
        </div>

        <h1 className="text-[18px] whitespace-nowrap text-center font-bold text-[#1E1E1E]">
          Instant Appointments
        </h1>

        <p className="text-[16px] text-center text-[#1E1E1E]">
          Book appointments instantly, without waiting in long queues. Get quick
          access to medical care when you need it most.
        </p>
      </div>

      <div className="service__card rounded-lg min-w-[260px] w-full flex flex-col items-center gap-1 lg:gap-3 justify-evenly lg:max-w-[300px] h-auto p-5 bg-white shadow-lg z-10">
        <div className="service__card__img flex items-center justify-center w-1/2 lg:w-2/3">
          <img src={service_secure} alt="Secure and Private" />
        </div>

        <h1 className="text-[18px] whitespace-nowrap text-center font-bold text-[#1E1E1E]">
          Secure and Private
        </h1>

        <p className="text-[16px] text-center text-[#1E1E1E]">
          Your health information is kept confidential and secure. We prioritize
          data privacy and ensure your sensetive information remains protected.
        </p>
      </div>

      <div className="service__card rounded-lg min-w-[260px] w-full flex flex-col items-center gap-1 lg:gap-3 justify-evenly lg:max-w-[300px] h-auto p-5 bg-white shadow-lg z-10">
        <div className="service__card__img flex items-center justify-center w-1/2 lg:w-2/3">
          <img src={service_support} alt="Live Support 24/7" />
        </div>

        <h1 className="text-[18px] whitespace-nowrap text-center font-bold text-[#1E1E1E]">
          Live Support 24/7
        </h1>

        <p className="text-[16px] text-center text-[#1E1E1E]">
          Get immediate assistance and medical support round the clock. Our
          dedicated team of professionals is available 24/7 to address your
          health concerns and answer your questions.
        </p>
      </div>
    </section>
  );
};

export default Services;
