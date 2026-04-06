import { useEffect, useState } from "react";
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
import AOS from "aos";
import "aos/dist/aos.css";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Home = () => {

    const {user, isAuthenticated, dispatch} = useContext(AuthContext);

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


    return (
      <>
          <div className="home-page">
            <Navbar authenticated={isAuthenticated} dispatch={dispatch} />
            <BackToTopBtn />

            <div data-aos="fade">
              <Presentation authenticated={isAuthenticated} userInfo={user} />
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
              <About authenticated={isAuthenticated} userInfo={user} />
            </div>
          
            <div data-aos="fade">
              <hr className="hr" id="experience"/>
            </div>
            <div data-aos="fade-up">
              <Experience authenticated={isAuthenticated} userInfo={user} />
            </div>

            <div data-aos="fade">
              <hr className="hr" id="skills"/>
            </div>
            <div data-aos="fade">
              <Skills authenticated={isAuthenticated} userInfo={user} />
            </div>

            <div data-aos="fade">
              <hr className="hr" id="projects"/>
            </div>
            <div data-aos="fade">
              <Projects setOpenItem={setOpenItem} authenticated={isAuthenticated} setSingleItem={setSingleItem} userInfo={user}/>
            </div>

            <div data-aos="fade">
              <hr className="hr" id="contact"/>
            </div>
            <div data-aos="fade-up">
              <Contact authenticated={isAuthenticated} userInfo={user} />
            </div>
          
            {/* pop-up */}
            {openItem && (
              <Item
                openItem={openItem}
                setOpenItem={setOpenItem}
                authenticated={isAuthenticated}
                singleItem={singleItem}
                setSingleItem={setSingleItem}
              />
            )}
          </div>
      </>
    );

}

export default Home;