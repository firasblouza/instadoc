import { useContext, useEffect } from "react";
import Hero from "./Hero";
import Services from "./Services";
import About from "./About";
import Mission from "./Mission";
import Specialities from "./Specialities";
import NewsLetter from "./NewsLetter";

import AuthContext from "../context/AuthContext";
import usePageSEO from "../hooks/usePageSEO";

const Home = () => {
  const { aboutRef } = useContext(AuthContext);
  
  // Set page SEO
  usePageSEO('home');

  // const effectRan = useRef(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#about") {
        const aboutSection = aboutRef.current;
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange(); // Check hash on component mount

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
