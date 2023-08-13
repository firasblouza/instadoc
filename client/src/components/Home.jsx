import React from "react";
import Hero from "./Hero";
import Services from "./Services";
import About from "./About";

const Home = () => {
  return (
    <main className="w-full h-full">
      <Hero />
      <Services />
      <About />
    </main>
  );
};

export default Home;
