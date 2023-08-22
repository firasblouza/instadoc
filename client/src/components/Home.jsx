import { useContext } from "react";
import Hero from "./Hero";
import Services from "./Services";
import About from "./About";
import Mission from "./Mission";
import Specialities from "./Specialities";
import NewsLetter from "./NewsLetter";

import AuthContext from "../context/AuthContext";

const Home = () => {
  const { aboutRef } = useContext(AuthContext);
  return (
    <main className="w-full min-h-screen">
      <Hero />
      <Services />
      <About aboutRef={aboutRef} />
      <Mission />
      <Specialities />
      <NewsLetter />
    </main>
  );
};

export default Home;
