import React, { useEffect, useState } from "react";
import "./home.css"
import Navbar from "../Navbar/navbar";
import Presentation from "../Presentation/presentation";
import About from "../About/about";
import Experience from "../Experience/experience";
import ThemeChanger from "../ThemeChanger/theme";
import Skills from "../Skills/skills";
import Projects from "../Projects/projects";
import Contact from "../Contact/contact";
import BackToTopBtn from "../BacktoTop/backtotop";
import Item from "../Projects/Item/item";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { RiseLoader } from "react-spinners";

const Home = ({authenticated, dispatch}) => {

    const apiUrl = import.meta.env.VITE_API_KEY;

    useEffect(() => {
      AOS.init({
        duration: 1300, 
        once: true,
        offset: 30,
        easing: "ease-in-out",
      });
    }, []);
    
    const [openItem, setOpenItem] = useState(false);
    const [singleItem, setSingleItem] = useState(null);

    useEffect(() => {
        const handleKeydown = (objEvent) => {
          if (objEvent.isComposing || objEvent.keyCode === 9) { 
            objEvent.preventDefault();
          }
        };
      
        if (openItem) {
          document.body.style.overflow = 'hidden'; 
          document.body.addEventListener("keydown", handleKeydown);
        } else {
          document.body.style.overflow = 'unset';
        }
      
        return () => {
          document.body.style.overflow = 'unset'; 
          document.body.removeEventListener("keydown", handleKeydown); 
        };
    }, [openItem]);


    const [userInfo, setUserInfo] = useState(null);
    const [loader, setLoader] = useState(true);
    useEffect(() => {
      setLoader(true);
      const getUser = async () => {
        const res = await axios.get(apiUrl + "/api/users/getUser");
        setUserInfo(res.data[0]);
        setLoader(false);
      }
      getUser();
    }, [])

    return (
      <>
        {loader ? 
            <div className="home-loader">
              <RiseLoader color="#0da2b8" size={35} speedMultiplier={1.3}/>
            </div>
          :
          <div className="home-page">
            <Navbar authenticated={authenticated} dispatch={dispatch} />
            <BackToTopBtn />

            <div data-aos="fade">
              <Presentation authenticated={authenticated} userInfo={userInfo} />
            </div>

            <div data-aos="fade">
              <hr className="hr" />
            </div>
            <div data-aos="fade-up">
              <ThemeChanger />
            </div>

            <div data-aos="fade">
              <hr className="hr" id="about"/>
            </div>
            <div data-aos="fade-up">
              <About authenticated={authenticated} userInfo={userInfo} />
            </div>
          
            <div data-aos="fade">
              <hr className="hr" id="experience"/>
            </div>
            <div data-aos="fade-up">
              <Experience authenticated={authenticated} />
            </div>

            <div data-aos="fade">
              <hr className="hr" id="skills"/>
            </div>
            <div data-aos="fade">
              <Skills authenticated={authenticated} userInfo={userInfo} />
            </div>

            <div data-aos="fade">
              <hr className="hr" id="projects"/>
            </div>
            <div data-aos="fade">
              <Projects setOpenItem={setOpenItem} authenticated={authenticated} setSingleItem={setSingleItem} />
            </div>

            <div data-aos="fade">
              <hr className="hr" id="contact"/>
            </div>
            <div data-aos="fade-up">
              <Contact authenticated={authenticated} userInfo={userInfo} />
            </div>
          
            {/* pop-up */}
            {openItem && (
              <Item
                openItem={openItem}
                setOpenItem={setOpenItem}
                authenticated={authenticated}
                singleItem={singleItem}
                setSingleItem={setSingleItem}
              />
            )}
          </div>
        }
      </>
    );

}

export default Home;