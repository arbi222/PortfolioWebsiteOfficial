import React, { useEffect, useState } from "react";
import "./backtotop.css";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const BackToTopBtn = () => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) { 
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return <>
        <div className="back-to-top-btn" style={{display: isVisible ? "block" : "none"}}>
            <button onClick={scrollToTop}>
                <ArrowUpwardIcon />
            </button>
        </div>
    </>
}

export default BackToTopBtn;