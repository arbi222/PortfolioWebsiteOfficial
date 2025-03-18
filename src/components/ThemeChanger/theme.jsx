import React, { useEffect, useState } from "react";
import "./theme.css"

const ThemeChanger = () => {

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.classList.toggle("dark-theme", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return <>
        <div className="themeChangerContainer">
            <h1>Personalize Theme</h1>
            <div className="themes">
                <div className="dot white" style={{border: theme === "light" && "2px solid #000"}} onClick={() => {setTheme("light")}}></div>
                <div className="dot black" style={{border: theme === "dark" && "2px solid #fff"}} onClick={() => {setTheme("dark")}}></div>
            </div>
            <p>Theme settings will be saved for your next visit.</p>
        </div>
    </>
}

export default ThemeChanger;