import React, { useEffect, useState } from "react";
import "./navbar.css"
import MenuIcon from '@mui/icons-material/Menu';
import { logoutCall } from "../../apiCalls";

const Navbar = ({authenticated, dispatch}) => {

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        logoutCall(dispatch);
    }

    return <>
        <nav className="navbar">
            <div className="main-nav-btns" id="home">
                <div className="nav-logo">
                    <a href="/">Arbi</a>
                </div>
                {isMobile &&
                    <div className="nav-menu">
                        <button className={isMenuOpen ? "rotate" : "unrotate"} onClick={() => setMenuOpen(!isMenuOpen)}>
                            <MenuIcon className="btn-icon"/>
                        </button>
                    </div>
                }
            </div>
            
            {(!isMobile || isMenuOpen) &&
                <div className={!isMobile ? "nav-links" : 'nav-links-mobile'}>
                    <a href="#about">About</a>
                    <a href="#experience">Experience</a>
                    <a href="#skills">Skills</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                    {authenticated && <a onClick={handleLogout} style={{cursor: "pointer"}} role="button">Log out</a>}
                </div>
            }
        </nav>
    </>
}

export default Navbar;