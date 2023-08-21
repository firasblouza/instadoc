import React from "react";
import Hero from "./Hero";
import Services from "./Services";
import About from "./About";
import Mission from "./Mission";
import Specialities from "./Specialities";
import NewsLetter from "./NewsLetter";

const Home = () => {
  return (
    <main className="w-full min-h-screen">
      <Hero />
      <Services />
      <About />
      <Mission />
      <Specialities />
      <NewsLetter />
    </main>
  );
};

export default Home;
